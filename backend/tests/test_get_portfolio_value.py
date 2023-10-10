import pytest
from app import app, cache
from unittest.mock import patch

@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()
    with app.app_context():
        yield client

# def test_get_portfolio_value_not_cached(client):
#     user_email = 'test@example.com'
#     portfolio_data_mock = [{'Ticker': 'AAPL', 'Total Shares': 10}, {'Ticker': 'GOOGL', 'Total Shares': 5}]
#     stock_prices_mock = {'AAPL': 150.0, 'GOOGL': 2800.0}
    
#     with patch('app.views.get_portfolio_data', return_value=portfolio_data_mock), \
#          patch('app.views.get_stock_prices', return_value=stock_prices_mock):
        
#         response = client.post('/get-portfolio-value', json={'email': user_email})
        
#     assert response.status_code == 200
#     assert response.get_json() == {'portfolio_value': 150.0*10 + 2800.0*5}

# def test_get_portfolio_value_cached(client):
#     user_email = 'test@example.com'
#     cache_value = 2000.0  # Mocked cached value
#     cache_key = f'portfolio_value_{user_email}'
#     cache.set(cache_key, cache_value)
    
#     response = client.post('/get-portfolio-value', json={'email': user_email})
    
#     assert response.status_code == 200
#     assert response.get_json() == {'portfolio_value': cache_value}
    
#     # Clean up the cache after test
#     cache.delete(cache_key)

