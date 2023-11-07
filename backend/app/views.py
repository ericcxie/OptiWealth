from flask import request, jsonify
from werkzeug.utils import secure_filename
import os
import pandas as pd
from sqlalchemy.exc import IntegrityError
import logging
from threading import Thread

from . import app, db, cache
from .utils.app_functions import parse_image, clean_data, get_portfolio_data, get_stock_prices
from .utils.rebalance import rebalance
from .models import UserPortfolio
from .config import ALLOWED_EXTENSIONS


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
            print("Image received!")
            try:
                target_data = parse_image(filepath)
                stock_data = clean_data(target_data)
                print(stock_data)
                os.remove(filepath)  # Deleting the file after processing
                return jsonify(stock_data)

            except Exception as e:
                return jsonify({'error': 'Error processing uploaded image: ' + str(e)}), 500

        # Check if the uploaded file is a csv or xlsx
        elif filename.rsplit('.', 1)[1].lower() in {'csv', 'xlsx'}:
            print("CSV/XLSX received!")
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

    Returns:
        A JSON response with a success message and status code 200 if the portfolio was successfully submitted.
        A JSON response with an error message and status code 400 if a portfolio for the user already exists.
        A JSON response with an error message and status code 500 if an error occurred while saving to the database.
    """
    logging.info("Endpoint /submit-portfolio hit with POST method.")
    logging.info("Received Data: %s", request.json)
    try:
        payload = request.json
        user_email = payload.get('user_email')
        user_uid = payload.get('user_uid')
        portfolio_data = payload.get('portfolio_data')

        new_entry = UserPortfolio(
            user_email=user_email,
            user_uid=user_uid,
            portfolio_data=portfolio_data
        )

        db.session.add(new_entry)
        db.session.commit()

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

    if portfolio_data and len(portfolio_data) > 0:
        portfolio_list = portfolio_data[0]
    else:
        portfolio_data = []

    return jsonify(portfolio_list)


@app.route('/get-portfolio-value', methods=['POST'])
def get_portfolio_value():
    """
    Endpoint to get the portfolio value for a given user.

    Returns:
        A JSON object containing the portfolio value for the user.
    """
    user_email = request.json.get('email')
    cache_key = f'portfolio_value_{user_email}'

    cached_value = cache.get(cache_key)

    if cached_value:
        Thread(target=update_portfolio_cache,
               args=(user_email, cache_key)).start()
        return jsonify({'portfolio_value': cached_value})
    else:
        value = calculate_portfolio_value(user_email)
        cache.set(cache_key, value)
        return jsonify({'portfolio_value': value})


def calculate_portfolio_value(user_email):
    portfolio_data = get_portfolio_data(user_email)
    portfolio_dict = {stock['Ticker']: stock['Total Shares']
                      for stock in portfolio_data[0]}
    tickers = list(portfolio_dict.keys())
    stock_prices = get_stock_prices(tickers)
    total_value = sum(stock_prices[ticker] *
                      portfolio_dict[ticker] for ticker in tickers)
    return total_value


def update_portfolio_cache(user_email, cache_key):
    value = calculate_portfolio_value(user_email)
    cache.set(cache_key, value)


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

    # Fetch the user's stocks using the existing function
    portfolio_data = get_portfolio_data(email)
    if not portfolio_data:
        return jsonify({"error": "User not found"}), 404

    # Extract tickers and fetch current stock prices using existing functions
    tickers = [stock['Ticker'] for stock in portfolio_data[0]]
    stock_prices = get_stock_prices(tickers)

    # Attach the current prices to the portfolio data
    for stock in portfolio_data[0]:
        stock['Current Price'] = stock_prices.get(stock['Ticker'], None)

    return jsonify(portfolio_data[0])


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

    user_portfolio = UserPortfolio.query.filter_by(
        user_email=user_email).first()
    if not user_portfolio:
        return jsonify({'error': 'User not found in db'}), 404

    user_portfolio.portfolio_data = portfolio_data
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

    user_portfolio = user_portfolio[0]

    rebalancing_results = rebalance(
        user_portfolio, target_model, bonds_value, cash_value)

    return jsonify({
        "status": "success",
        "target_model": target_model,
        "rebalancing_results": rebalancing_results
    }), 200
