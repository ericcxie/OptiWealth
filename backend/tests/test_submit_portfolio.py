import pytest
from app import app, db
from app.models import UserPortfolio
from unittest.mock import patch, Mock
from sqlalchemy.exc import IntegrityError


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_submit_portfolio_success(client):
    with patch.object(db.session, 'add', return_value=None) as mock_add, \
            patch.object(db.session, 'commit', return_value=None) as mock_commit:

        payload = {
            'user_email': 'test@example.com',
            'user_uid': '123456',
            'portfolio_data': [{'Ticker': 'AAPL', 'Total Shares': 10}]
        }

        response = client.post('/submit-portfolio', json=payload)
        assert response.status_code == 200
        assert response.get_json(
        )['message'] == 'Portfolio submitted successfully'

        mock_add.assert_called_once()
        mock_commit.assert_called_once()


def test_submit_portfolio_duplicate(client):
    with patch.object(db.session, 'add', return_value=None) as mock_add, \
            patch.object(db.session, 'commit', side_effect=IntegrityError('mocked error', None, None)) as mock_commit, \
            patch.object(db.session, 'rollback', return_value=None) as mock_rollback:

        payload = {
            'user_email': 'test@example.com',
            'user_uid': '123456',
            'portfolio_data': [{'Ticker': 'AAPL', 'Total Shares': 10}]
        }

        response = client.post('/submit-portfolio', json=payload)
        assert response.status_code == 400
        assert response.get_json(
        )['error'] == 'A portfolio for this user already exists'

        mock_add.assert_called_once()
        mock_commit.assert_called_once()
        mock_rollback.assert_called_once()
