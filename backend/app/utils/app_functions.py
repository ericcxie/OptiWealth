import psycopg2
import yfinance as yf
from dotenv import load_dotenv
import os
from forex_python.converter import CurrencyRates
from PIL import Image
import pytesseract
import re
import requests
from cachetools import cached, TTLCache
from concurrent.futures import ThreadPoolExecutor

EXCHANGE_RATE_CACHE = {}

load_dotenv()

DATABASE_NAME = os.getenv('DATABASE_NAME')
DATABASE_USER = os.getenv('DATABASE_USER')
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')

DATABASE_CONFIG = {
    'dbname': DATABASE_NAME,
    'user': DATABASE_USER,
    'password': DATABASE_PASSWORD,
    'host': 'localhost',
    'port': '5432'
}

c = CurrencyRates()


def parse_image(image_path):
    image = Image.open(image_path)
    text = pytesseract.image_to_string(image)

    lines = text.split('\n')
    target_column_header = "Symbol"
    target_data = []

    in_target_column = False

    for line in lines:
        if target_column_header in line:
            in_target_column = True
            continue
        if in_target_column and line.strip():
            target_data.append(line.strip())

    return target_data


def clean_data(target_data):
    stock_data = {}

    pattern = r'\b([A-Z]+)\s+(\d+\.\d+)\s+\d+\.\d+\s+\S+\s+\S+\b'

    for line in target_data:
        match = re.match(pattern, line)

        if match:
            ticker, quantity = match.groups()
            stock_data[ticker] = float(quantity)  # Convert quantity to float

    return stock_data


def get_portfolio_data(user_email):
    connection = None
    cursor = None
    try:
        connection = psycopg2.connect(**DATABASE_CONFIG)
        cursor = connection.cursor()

        query = """
            SELECT portfolio_data FROM users_portfolio
            WHERE user_email = %s
        """
        cursor.execute(query, (user_email,))
        portfolio_data = cursor.fetchone()

        return portfolio_data

    except Exception as error:
        print(f"Error retrieving data from database: {error}")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# def convert_usd_to_cad(amount):
#     print("Converting USD to CAD", amount)
#     try:
#         return c.convert('USD', 'CAD', amount)
#     except:
#         print("Error converting USD to CAD.")
#         return amount

@cached(cache=TTLCache(maxsize=1, ttl=3600))
def get_exchange_rate():
    response = requests.get(
        'https://api.exchangeratesapi.io/latest?base=USD&symbols=CAD')
    if response.status_code == 200:
        data = response.json()
        return data['rates']['CAD']
    else:
        raise Exception("Error fetching exchange rate data.")


def convert_usd_to_cad(amount):
    try:
        exchange_rate = get_exchange_rate()
        return amount * exchange_rate
    except:
        return amount


def get_stock_price(ticker):
    try:
        data = yf.Ticker(ticker)
        stock_info = data.info
        stock_price = stock_info.get(
            'currentPrice', stock_info.get('regularMarketPreviousClose'))

        if 'currency' in stock_info:
            return (ticker, round(convert_usd_to_cad(stock_price), 2) if stock_info.get(
                'currency') == 'USD' else stock_price)
        else:
            print(f"No currency info for {ticker}")
            return (ticker, None)
    except Exception as e:
        print(f"Error fetching price for {ticker}: {e}")
        return (ticker, None)


def get_stock_prices(tickers):
    with ThreadPoolExecutor() as executor:
        results = executor.map(get_stock_price, tickers)
    return dict(result for result in results if result[1] is not None)


if __name__ == "__main__":
    # Test the database function
    # Replace with an actual email in your database
    test_email = "nikita@gmail.com"
    portfolio_data = get_portfolio_data(test_email)
    print("Portfolio Data:", portfolio_data)

    # Extract tickers
    tickers = [stock['Ticker'] for stock in portfolio_data[0]]
    print("Tickers:", tickers)

    # Test the stock price function
    prices = get_stock_prices(tickers)
    print("Stock Prices:", prices)
