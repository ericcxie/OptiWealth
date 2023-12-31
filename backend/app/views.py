import logging
import os
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
import json

import pandas as pd
from flask import jsonify, request, send_file
from sqlalchemy.exc import IntegrityError
from werkzeug.utils import secure_filename

from . import app, cache, db
from .config import ALLOWED_EXTENSIONS
from .models import UserPortfolio
from .utils.app_functions import (clean_data, delete_account_from_db,
                                  dict_to_xlsx, get_portfolio_data,
                                  get_portfolio_history_from_db,
                                  get_stock_prices, insert_portfolio_value,
                                  is_valid_ticker, parse_image,
                                  upsert_user_email_in_db)
from .utils.rebalance import rebalance
from .utils.encryption import aes_cipher


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/upload', methods=['POST'])
def upload_file():
    """
    This function handles file uploads to the server. It accepts POST requests with a file attached.
    The file can be either an image (PNG, JPG, JPEG) or a CSV/XLSX file. The function will parse the file
    and return the data in JSON format.

    Returns:
        JSON: The parsed data in JSON format.
    """
    logging.info("Endpoint /upload hit with POST method.")
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Check if the uploaded file is an image
        if filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg'}:
            try:
                target_data = parse_image(filepath)
                stock_data = clean_data(target_data)
                os.remove(filepath)  # Deleting the file after processing
                return jsonify(stock_data)

            except Exception as e:
                return jsonify({'error': 'Error processing uploaded image: ' + str(e)}), 500

        # Check if the uploaded file is a csv or xlsx
        elif filename.rsplit('.', 1)[1].lower() in {'csv', 'xlsx'}:
            try:
                df = pd.read_excel(filepath) if filepath.endswith(
                    '.xlsx') else pd.read_csv(filepath)
                data = df[['Ticker', 'Total Shares']].to_dict(orient='records')

                os.remove(filepath)  # Deleting the file after processing
                return jsonify(data)

            except Exception as e:
                return jsonify({'error': 'Error processing uploaded file: ' + str(e)}), 500

    return jsonify({'error': 'Invalid file format'}), 400


@app.route('/submit-portfolio', methods=['POST'])
def submit_portfolio():
    """
    Endpoint to submit a user's portfolio data to the database.
    """
    logging.info("Endpoint /submit-portfolio hit with POST method.")
    logging.info("Received Data: %s", request.json)
    try:
        payload = request.json
        user_email = payload.get('user_email')
        user_uid = payload.get('user_uid')
        portfolio_data = payload.get('portfolio_data')

        invalid_tickers = []
        with ThreadPoolExecutor() as executor:
            invalid_tickers = list(
                filter(None, executor.map(check_ticker, portfolio_data)))

        if invalid_tickers:
            return jsonify({'error': 'Invalid stocks found', 'invalid_tickers': invalid_tickers}), 400

        encrypted_uid = aes_cipher.encrypt(user_uid)
        encrypted_portfolio_data = aes_cipher.encrypt(
            json.dumps(portfolio_data))

        new_entry = UserPortfolio(
            user_email=user_email,
            user_uid=encrypted_uid,
            portfolio_data=encrypted_portfolio_data
        )

        db.session.add(new_entry)
        db.session.commit()

        insert_portfolio_value(user_email, 0)

        logging.info(
            "Portfolio for user %s successfully submitted.", user_email)
        return jsonify({'message': 'Portfolio submitted successfully'}), 200

    except IntegrityError:
        logging.error(
            "IntegrityError occurred. Possible duplicate portfolio for user: %s", user_email)
        db.session.rollback()
        return jsonify({'error': 'A portfolio for this user already exists'}), 400
    except Exception as e:
        logging.error(
            "Error occurred while saving to the database: %s", str(e))
        db.session.rollback()
        return jsonify({'error': 'Error saving to database: ' + str(e)}), 500


@app.route('/get_portfolio', methods=['POST'])
def get_portfolio():
    """Returns a current users portfolio
    Ticker, Share count
    """
    user_email = request.json.get('user_email')
    portfolio_data = get_portfolio_data(user_email)

    if portfolio_data is None:
        portfolio_data = []

    return jsonify(portfolio_data)


@app.route('/get-portfolio-value', methods=['POST'])
def get_portfolio_value():
    """
    Endpoint to get the portfolio value for a given user.

    Returns:
        A JSON object containing the portfolio value for the user.
    """
    user_email = request.json.get('email')
    cache_key = f'portfolio_value_{user_email}'

    value = calculate_portfolio_value(user_email)
    cache.set(cache_key, value)
    insert_portfolio_value(user_email, value)

    return jsonify({'portfolio_value': value})


def calculate_portfolio_value(user_email):
    portfolio_data = get_portfolio_data(user_email)
    portfolio_dict = {stock['Ticker']: stock['Total Shares']
                      for stock in portfolio_data}
    tickers = list(portfolio_dict.keys())
    stock_prices = get_stock_prices(tickers)
    total_value = sum(stock_prices[ticker] *
                      portfolio_dict[ticker] for ticker in tickers)
    return total_value


@app.route('/get-user-stocks', methods=['POST'])
def get_user_stocks():
    """
    Retrieves a user's stock portfolio data and attaches current stock prices to it.

    Returns:
        A JSON object containing the user's stock portfolio data with current stock prices attached.
    """
    email = request.json.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400

    portfolio_data = get_portfolio_data(email)
    if not portfolio_data:
        return jsonify({"error": "User not found"}), 404

    tickers = [stock['Ticker'] for stock in portfolio_data]
    stock_prices = get_stock_prices(tickers)

    for stock in portfolio_data:
        stock['Current Price'] = stock_prices.get(stock['Ticker'], None)

    return jsonify(portfolio_data)


def check_ticker(stock):
    ticker = stock['Ticker']
    if not is_valid_ticker(ticker):
        return ticker
    return None


@app.route('/update-portfolio', methods=['POST'])
def update_portfolio():
    """
    Updates the portfolio data for a given user.

    Args:
        user_email (str): The email of the user whose portfolio is being updated.
        portfolio_data (dict): The updated portfolio data.

    Returns:
        A JSON response indicating whether the update was successful or not.
    """
    user_email = request.json.get('user_email')
    portfolio_data = request.json.get('portfolio_data')

    if not user_email:
        return jsonify({'error': 'Email is required'}), 400

    if not portfolio_data:
        return jsonify({'error': 'Portfolio data is required'}), 400

    invalid_tickers = []

    with ThreadPoolExecutor() as executor:
        invalid_tickers = list(
            filter(None, executor.map(check_ticker, portfolio_data)))

    if invalid_tickers:
        return jsonify({'error': 'Invalid stocks found', 'invalid_tickers': invalid_tickers}), 400

    user_portfolio = UserPortfolio.query.filter_by(
        user_email=user_email).first()
    if not user_portfolio:
        return jsonify({'error': 'User not found in db'}), 404

    encrypted_portfolio_data = aes_cipher.encrypt(
        json.dumps(portfolio_data))

    user_portfolio.portfolio_data = encrypted_portfolio_data
    db.session.commit()

    return jsonify({'message': 'Portfolio updated successfully'}), 200


@app.route('/rebalance-portfolio', methods=['POST'])
def rebalance_portfolio():
    """
    Rebalances the user's portfolio based on the target allocation model.

    Returns:
        A JSON response containing the status of the request, the target allocation model,
        and the results of the rebalancing process.
    """
    data = request.json

    user_email = data.get('user_email')
    target_model = data.get('target_model')
    bonds_value = data.get('bonds')
    cash_value = data.get('cash')
    model_name = target_model.get('name')

    user_portfolio = get_portfolio_data(user_email)

    if not user_portfolio:
        return jsonify({
            "status": "error",
            "message": "No portfolio found for the given user email."
        }), 404

    target_model = {
        "allocation": {
            "Stocks": target_model.get('stocks'),
            "Bonds": target_model.get('bonds'),
            "Cash": target_model.get('cash')
        }
    }

    rebalancing_results = rebalance(
        user_portfolio, target_model, bonds_value, cash_value)

    return jsonify({
        "status": "success",
        "target_model": target_model,
        "model_name": model_name,
        "rebalancing_results": rebalancing_results
    }), 200


@app.route('/get-portfolio-allocation', methods=['POST'])
def get_portfolio_allocation():
    """
    Retrieves a user's stock portfolio data, attaches current stock prices to it,
    and calculates the percentage of each stock in the portfolio.

    Returns:
        A JSON object containing the user's stock portfolio data with ticker and percentages attached.
    """
    email = request.json.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400

    portfolio_data = get_portfolio_data(email)
    if not portfolio_data:
        return jsonify({"error": "User not found"}), 404

    tickers = [stock['Ticker'] for stock in portfolio_data]
    stock_prices = get_stock_prices(tickers)

    total_portfolio_value = 0
    for stock in portfolio_data:
        current_price = stock_prices.get(stock['Ticker'], None)
        stock['Current Price'] = current_price
        stock_value = current_price * stock['Total Shares']
        total_portfolio_value += stock_value

    portfolio_allocation = []
    for stock in portfolio_data:
        stock_value = stock['Current Price'] * stock['Total Shares']
        percentage = round((stock_value / total_portfolio_value) * 100, 2)
        portfolio_allocation.append(
            {'Ticker': stock['Ticker'], 'Percentage': percentage})

    return jsonify(portfolio_allocation)


@app.route('/get-portfolio-history', methods=['POST'])
def get_portfolio_history():
    user_email = request.json.get('email')
    history = get_portfolio_history_from_db(user_email)
    return jsonify(history)


@app.route('/delete-account', methods=['POST'])
def delete_account():
    user_email = request.json.get('email')
    delete_account_from_db(user_email)
    return jsonify({'message': 'Account deleted successfully'})


@app.route('/update-user-email', methods=['POST'])
def edit_user_email():
    old_email = request.json.get('email')
    new_email = request.json.get('new_email')
    upsert_user_email_in_db(old_email, new_email)
    return jsonify({'message': 'Email updated successfully'})


@app.route('/dict-to-excel', methods=['POST'])
def dict_to_excel():
    """
    Converts a dictionary to an excel file and returns the file.
    """
    results = {
        "model_name": request.json.get('model_name'),
        "initial_allocations": request.json.get('initial_allocations'),
        "updated_allocations": request.json.get('updated_allocations'),
        "instructions": request.json.get('instructions')
    }

    file_name = f"Rebalancing_Results_{datetime.now().strftime('%Y-%m-%d')}.xlsx"
    file_path = os.path.join(app.config['DATA_FOLDER'], file_name)

    dict_to_xlsx(results, file_path)
    output_path = os.path.join('../', file_path)

    response = send_file(output_path, as_attachment=True,
                         download_name=file_name)
    os.remove(file_path)
    return response
