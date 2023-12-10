import app.utils.app_functions as app_functions
import app.utils.rebalance as rebalance
import utils.common as common


def test_get_stock_price_stocks():
    ticker = 'AAPL'
    response = app_functions.get_stock_price(ticker)

    assert response is not None
    assert response[0] == ticker
    assert isinstance(response[1], float)


def test_get_stock_price_etfs():
    ticker = 'VFV.TO'
    response = app_functions.get_stock_price(ticker)

    assert response is not None
    assert response[0] == ticker
    assert isinstance(response[1], float)


def test_is_valid_ticker_valid():
    ticker = 'XEQT.TO'
    response = app_functions.is_valid_ticker(ticker)

    assert response == True


def test_is_valid_ticker_invalid():
    # Yahoo Finance requires ETFs to have a suffix
    ticker = 'XEQT'
    response = app_functions.is_valid_ticker(ticker)

    assert response == False


def test_fetch_price_and_pe_valid():
    ticker = 'AAPL'
    current_price, pe_ratio = rebalance.fetch_price_and_pe(ticker)

    assert current_price is not None
    assert pe_ratio is not None
    assert isinstance(current_price, float)
    assert isinstance(pe_ratio, float)


def test_fetch_stock_prices_time():
    ticker = 'AAPL'
    time_threshold = 0.5

    elapsed_time = common.time_function(app_functions.get_stock_price, ticker)

    assert elapsed_time < time_threshold, f"fetch_stock_prices took too long: {elapsed_time} seconds"


def test_fetch_pe_time():
    ticker = 'AAPL'
    time_threshold = 0.5

    elapsed_time = common.time_function(rebalance.fetch_price_and_pe, ticker)

    assert elapsed_time < time_threshold, f"fetch_pe took too long: {elapsed_time} seconds"
