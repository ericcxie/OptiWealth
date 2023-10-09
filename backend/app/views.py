# /app/views.py

from flask import request, jsonify
from werkzeug.utils import secure_filename
import os
import pandas as pd
from sqlalchemy.exc import IntegrityError
import logging
from threading import Thread

from . import app, db, cache
from .utils.app_functions import parse_image, clean_data, get_portfolio_data, get_stock_prices
from .models import UserPortfolio
from .config import ALLOWED_EXTENSIONS


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/upload', methods=['POST'])
def upload_file():
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


@app.route('/get-portfolio-value', methods=['POST'])
def get_portfolio_value():
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