import os
import re
import pytz
import requests
import psycopg2
import pytesseract
import yfinance as yf
from dotenv import load_dotenv
from forex_python.converter import CurrencyRates
from PIL import Image
from cachetools import cached, TTLCache
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta

from app.utils.yfinance3 import YFinance
# from yfinance3 import YFinance

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
    """
    Parses an image file and extracts data from a specific column.

    Args:
        image_path (str): The file path of the image to be parsed.

    Returns:
        list: A list of strings containing the data from the target column.
    """
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
    """
    Cleans target data by extracting ticker symbols and their corresponding quantities.

    Args:
        target_data (list): A list of strings containing raw stock data.

    Returns:
        dict: A dictionary containing ticker symbols as keys and their corresponding quantities as values.
    """
    stock_data = {}

    pattern = r'\b([A-Z]+)\s+(\d+\.\d+)\s+\d+\.\d+\s+\S+\s+\S+\b'

    for line in target_data:
        match = re.match(pattern, line)

        if match:
            ticker, quantity = match.groups()
            stock_data[ticker] = float(quantity)  # Convert quantity to float

    return stock_data


def is_valid_ticker(ticker):
    """
    Checks if a given ticker symbol is valid.

    Args:
        ticker (str): The ticker symbol to be checked.

    Returns:
        bool: True if the ticker symbol is valid, False otherwise.
    """
    yf_custom = YFinance(ticker)
    try:
        stock_info = yf_custom.info
        # If the ticker is valid, the following line will not raise an exception
        return 'currency' in stock_info
    except Exception:
        return False


def get_portfolio_data(user_email):
    """
    Retrieves portfolio data for a given user from the database.

    Args:
        user_email (str): The email address of the user.

    Returns:
        tuple: A tuple containing the portfolio data for the user.
    """
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


def delete_account_from_db(user_email):
    """
    Deletes a user's account and all associated portfolio history from the database.

    Args:
        user_email (str): The email address of the user.
    """
    connection = None
    cursor = None
    try:
        connection = psycopg2.connect(**DATABASE_CONFIG)
        cursor = connection.cursor()

        portfolio_history_query = """
            DELETE FROM portfolio_history
            WHERE user_email = %s
        """
        cursor.execute(portfolio_history_query, (user_email,))

        users_portfolio_query = """
            DELETE FROM users_portfolio
            WHERE user_email = %s
        """
        cursor.execute(users_portfolio_query, (user_email,))

        connection.commit()

    except Exception as error:
        print(
            f"Error deleting account and portfolio history from database: {error}")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def upsert_user_email_in_db(old_email, new_email):
    """
    Edits a user's email address in the database.

    Args:
        old_email (str): The old email address of the user.
        new_email (str): The new email address of the user.
    """
    try:
        with psycopg2.connect(**DATABASE_CONFIG) as conn:
            with conn.cursor() as cursor:
                # Step 1: Drop the foreign key constraint
                cursor.execute("""
                    ALTER TABLE portfolio_history DROP CONSTRAINT IF EXISTS portfolio_history_user_email_fkey;
                """)

                # Step 2: Update emails in users_portfolio
                cursor.execute("""
                    UPDATE users_portfolio
                    SET user_email = %s
                    WHERE user_email = %s
                """, (new_email, old_email))

                # Step 3: Update emails in portfolio_history
                cursor.execute("""
                    UPDATE portfolio_history
                    SET user_email = %s
                    WHERE user_email = %s
                """, (new_email, old_email))

                # Step 4: Re-add the foreign key constraint
                cursor.execute("""
                    ALTER TABLE portfolio_history
                    ADD CONSTRAINT portfolio_history_user_email_fkey FOREIGN KEY (user_email)
                    REFERENCES users_portfolio (user_email);
                """)

                conn.commit()
                print("Email updated successfully.")

    except Exception as error:
        print(f"Error updating email with foreign key drop/add: {error}")


def insert_portfolio_value(user_email, value):
    """
    Logs the portfolio value for a given user in the database.

    Args:
        user_email (str): The email address of the user.
        value (float): The value of the user's portfolio.
    """
    print(f"Inserting portfolio value for {user_email} of value {value}")
    try:
        conn = psycopg2.connect(**DATABASE_CONFIG)
        cur = conn.cursor()

        cur.execute(
            "SELECT portfolio_value, timestamp FROM portfolio_history WHERE user_email = %s ORDER BY timestamp DESC LIMIT 1", (user_email,))
        result = cur.fetchone()

        if result is not None:
            utc = pytz.timezone('UTC')
            eastern = pytz.timezone('US/Eastern')
            result_date = result[1].replace(
                tzinfo=utc).astimezone(eastern).date()

            if abs(float(result[0]) - value) > 5 and result_date != datetime.today().date():
                cur.execute(
                    "INSERT INTO portfolio_history (user_email, portfolio_value) VALUES (%s, %s)", (user_email, value))
            else:
                cur.execute(
                    "UPDATE portfolio_history SET portfolio_value = %s WHERE user_email = %s AND timestamp = %s", (value, user_email, result[1]))
        else:
            cur.execute(
                "INSERT INTO portfolio_history (user_email, portfolio_value) VALUES (%s, %s)", (user_email, value))

        conn.commit()
    except Exception as e:
        print(f"Database error: {e}")
    finally:
        cur.close()
        conn.close()


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
    """
    Returns the current price of a stock given its ticker symbol using the custom YFinance class.

    Args:
        ticker (str): The ticker symbol of the stock.

    Returns:
        tuple: A tuple containing the ticker symbol and the current price of the stock.
               If the stock price cannot be fetched, the price will be None.
    """
    try:
        yf_custom = YFinance(ticker)
        stock_info = yf_custom.info

        stock_price = stock_info.get(
            'currentPrice', stock_info.get('regularMarketPreviousClose'))

        if 'currency' in stock_info:
            converted_price = round(convert_usd_to_cad(stock_price), 2) if stock_info.get(
                'currency') == 'USD' else stock_price
            return (ticker, converted_price)
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


def get_portfolio_history_from_db(user_email):
    conn = psycopg2.connect(**DATABASE_CONFIG)
    cur = conn.cursor()

    cur.execute(
        "SELECT portfolio_value, timestamp FROM portfolio_history WHERE user_email = %s ORDER BY timestamp", (user_email,))
    result = cur.fetchall()

    utc = pytz.timezone('UTC')
    eastern = pytz.timezone('US/Eastern')

    data = [{"value": float(row[0]), "time": row[1].replace(
        tzinfo=utc).astimezone(eastern).strftime("%Y-%m-%d")} for row in result]

    cur.close()
    conn.close()

    return data


if __name__ == "__main__":
    # test_email = "ex.ericxie@gmail.com"
    # portfolio_data = get_portfolio_data(test_email)
    # print("Portfolio Data:", portfolio_data)

    # tickers = [stock['Ticker'] for stock in portfolio_data[0]]
    # print("Tickers:", tickers)

    # stock_prices = {ticker: get_stock_price(ticker)[1] for ticker in tickers}
    # print("Stock Prices:", stock_prices)
    print(is_valid_ticker("VFV.TO"))
