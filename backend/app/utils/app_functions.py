import json
import os
import re
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from itertools import islice

import pandas as pd
import psycopg2
import pytesseract
import pytz
import requests
import yfinance as yf
from cachetools import TTLCache, cached
from dotenv import load_dotenv
from forex_python.converter import CurrencyRates
from PIL import Image

from .encryption import aes_cipher

EXCHANGE_RATE_CACHE = {}

load_dotenv()

DATABASE_NAME = os.getenv('DATABASE_NAME')
DATABASE_USER = os.getenv('DATABASE_USER')
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')
DATABASE_HOST = os.getenv('DATABASE_HOST')
DATABASE_PORT = os.getenv('DATABASE_PORT')

DATABASE_CONFIG = {
    'dbname': DATABASE_NAME,
    'user': DATABASE_USER,
    'password': DATABASE_PASSWORD,
    'host': DATABASE_HOST,
    'port': DATABASE_PORT
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
    Checks if a given ticker symbol is valid using the official YFinance API.

    Args:
        ticker (str): The ticker symbol to be checked.

    Returns:
        bool: True if the ticker symbol is valid, False otherwise.
    """
    stock = yf.Ticker(ticker)
    try:
        # Fetch info and check if the ticker has data
        return 'regularMarketOpen' in stock.info
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

        decrypted_portfolio_data = json.loads(
            aes_cipher.decrypt(portfolio_data[0]))

        return decrypted_portfolio_data

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
                cursor.execute("""
                    ALTER TABLE portfolio_history DROP CONSTRAINT IF EXISTS portfolio_history_user_email_fkey;
                """)

                cursor.execute("""
                    UPDATE users_portfolio
                    SET user_email = %s
                    WHERE user_email = %s
                """, (new_email, old_email))

                cursor.execute("""
                    UPDATE portfolio_history
                    SET user_email = %s
                    WHERE user_email = %s
                """, (new_email, old_email))

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
    encrypted_value = aes_cipher.encrypt(str(value))

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

            decrypted_portfolio_value = aes_cipher.decrypt(result[0])

            if abs(float(decrypted_portfolio_value) - value) > 5 and result_date != datetime.today().date():
                cur.execute(
                    "INSERT INTO portfolio_history (user_email, portfolio_value) VALUES (%s, %s)", (user_email, encrypted_value))
            else:
                cur.execute(
                    "UPDATE portfolio_history SET portfolio_value = %s WHERE user_email = %s AND timestamp = %s", (encrypted_value, user_email, result[1]))
        else:
            cur.execute(
                "INSERT INTO portfolio_history (user_email, portfolio_value) VALUES (%s, %s)", (user_email, encrypted_value))

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
    Returns the current price of a stock given its ticker symbol using the official YFinance API.

    Args:
        ticker (str): The ticker symbol of the stock.

    Returns:
        tuple: A tuple containing the ticker symbol and the current price of the stock.
               If the stock price cannot be fetched, the price will be None.
    """
    try:
        stock = yf.Ticker(ticker)
        stock_info = stock.info

        stock_price = stock_info.get(
            'currentPrice', stock_info.get('regularMarketOpen', None))

        if stock_price and 'currency' in stock_info:
            converted_price = round(convert_usd_to_cad(
                stock_price), 2) if stock_info['currency'] == 'USD' else stock_price
            return (ticker, converted_price)
        else:
            print(f"No valid price or currency info for {ticker}")
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

    data = [{"value": float(aes_cipher.decrypt(row[0])), "time": row[1].replace(
        tzinfo=utc).astimezone(eastern).strftime("%Y-%m-%d")} for row in result]

    cur.close()
    conn.close()

    return data


def parse_amount(amount_str):
    """
    Parse the amount string to a numeric value.
    """
    # Remove currency symbols and commas
    amount_str = amount_str.replace('$', '').replace(',', '')
    # Convert to negative number if enclosed in parentheses
    if '(' in amount_str and ')' in amount_str:
        return -float(amount_str.strip('()'))
    return float(amount_str)


def dict_to_xlsx(data, file_path):
    """
    Converts a dictionary to an Excel file and returns the file path.

    Args:
        data (dict): The dictionary to be converted.

    Returns:
        str: The file path of the Excel file.
    """
    initial_allocations = pd.DataFrame(list(data['initial_allocations'].items()), columns=[
                                       'Category', 'Initial Allocation'])
    updated_allocations = pd.DataFrame(list(data['updated_allocations'].items()), columns=[
                                       'Category', 'Rebalanced Allocation'])
    instructions = pd.DataFrame(data['instructions'])

    with pd.ExcelWriter(file_path, engine='xlsxwriter', engine_kwargs={'options': {'strings_to_numbers': True}}) as writer:
        workbook = writer.book
        worksheet_name = f"{data['model_name']} Portfolio"
        worksheet = workbook.add_worksheet(worksheet_name)
        writer.sheets[worksheet_name] = worksheet

        header_format = workbook.add_format({
            'bold': True,
            'bg_color': '#0B2C77',
            'border': 1,
            'font_color': 'white',
            'font_size': 12,
            'text_wrap': True,
            'valign': 'vcenter',
            'align': 'center',
            'num_format': '@'
        })
        data_format = workbook.add_format({'border': 1, 'font_size': 12})
        amount_format = workbook.add_format({
            'num_format': '$#,##0.00_);[Red]($#,##0.00)',
            'border': 1,
            'font_size': 12
        })
        percentage_format = workbook.add_format({
            'num_format': '0.00\%;[Red](0.00##\%)',
            'border': 1,
            'font_size': 12
        })

        start_row = 0
        allocations = pd.merge(initial_allocations,
                               updated_allocations, on='Category')

        allocations.to_excel(writer, sheet_name=worksheet_name,
                             startrow=start_row + 1, header=False, index=False)

        for col_num, value in enumerate(allocations.columns.values):
            worksheet.write(start_row, col_num, value, header_format)

        for row in range(len(allocations)):
            for col in range(len(allocations.columns)):
                cell_value = allocations.iloc[row, col]
                if col > 0:
                    worksheet.write_number(
                        row + start_row + 1, col, cell_value, percentage_format)
                else:
                    worksheet.write(row + start_row + 1, col,
                                    cell_value, data_format)

        instructions_start_row = start_row + len(allocations) + 2
        instructions.to_excel(writer, sheet_name=worksheet_name,
                              startrow=instructions_start_row + 1, header=False, index=False)

        for col_num, value in enumerate(instructions.columns.values):
            capitalized_header = value.title()
            worksheet.write(instructions_start_row,
                            col_num, capitalized_header, header_format)

        for row in range(len(instructions)):
            for col in range(len(instructions.columns)):
                cell_value = instructions.iloc[row, col]
                if instructions.columns[col].lower() == 'amount':
                    cell_value = parse_amount(cell_value)
                    worksheet.write_number(
                        row + instructions_start_row + 1, col, cell_value, amount_format)
                else:
                    worksheet.write(row + instructions_start_row +
                                    1, col, cell_value, data_format)

        worksheet.autofit()

    return file_path
