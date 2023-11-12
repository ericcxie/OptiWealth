# test_rebalance.py
import pytest
from unittest.mock import patch
from app.utils.rebalance import rebalance


@pytest.fixture
def mock_fetch_price_and_pe():
    with patch('app.utils.rebalance.fetch_price_and_pe') as mock:
        mock.side_effect = lambda ticker: {
            'AAPL': (150, 25),
            'META': (200, 30),
            'TSLA': (600, 50)
        }[ticker]
        yield mock


def test_rebalance_logic(mock_fetch_price_and_pe):
    user_portfolio = [
        {"Ticker": "AAPL", "Total Shares": 4},
        {"Ticker": "META", "Total Shares": 50},
        {"Ticker": "TSLA", "Total Shares": 10.5}
    ]
    conservative_model = {
        "allocation": {
            "Stocks": 30,
            "Bonds": 50,
            "Cash": 20
        }
    }
    bonds_value = 1000
    cash_value = 1000

    result = rebalance(user_portfolio, conservative_model,
                       bonds_value, cash_value)

    tolerance = 0.01

    total_value = sum(
        value for value in result['initial_allocations'].values())
    for category, percentage in conservative_model['allocation'].items():
        allocated_value = result['updated_allocations'][category]
        # Check if the allocated value is within a certain percentage of the total value
        assert abs(allocated_value - (total_value *
                   (percentage / 100))) < tolerance

    # Ensure the fetch_price_and_pe function was called the correct number of times
    assert mock_fetch_price_and_pe.call_count == len(user_portfolio)
