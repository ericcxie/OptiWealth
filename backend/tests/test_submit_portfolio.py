import pytest
from flask import Flask, json
from unittest.mock import patch, Mock
from app import app, db, UserPortfolio
from sqlalchemy.exc import IntegrityError


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


@patch.object(db.session, 'add')
@patch.object(db.session, 'commit')
def test_submit_portfolio_success(mock_commit, mock_add, client):
    payload = {
        'user_email': 'test@example.com',
        'user_uid': '123456',
        'portfolio_data': 'sample portfolio data'
    }

    response = client.post(
        '/submit-portfolio', data=json.dumps(payload), content_type='application/json')

    assert response.status_code == 200
    assert response.json == {'message': 'Portfolio submitted successfully'}
    mock_add.assert_called_once()
    mock_commit.assert_called_once()


@patch.object(db.session, 'add')
@patch.object(db.session, 'commit')
@patch.object(db.session, 'rollback')
def test_submit_portfolio_integrity_error(mock_rollback, mock_commit, mock_add, client):
    mock_commit.side_effect = IntegrityError(
        None, None, None)  # Simulating the IntegrityError

    payload = {
        'user_email': 'test@example.com',
        'user_uid': '123456',
        'portfolio_data': 'sample portfolio data'
    }

    response = client.post(
        '/submit-portfolio', data=json.dumps(payload), content_type='application/json')

    assert response.status_code == 400
    assert response.json == {
        'error': 'A portfolio for this user already exists'}
    mock_rollback.assert_called_once()


@patch.object(db.session, 'add')
@patch.object(db.session, 'commit')
@patch.object(db.session, 'rollback')
def test_submit_portfolio_generic_error(mock_rollback, mock_commit, mock_add, client):
    mock_commit.side_effect = Exception(
        "Sample Exception")  # Simulating a generic exception

    payload = {
        'user_email': 'test@example.com',
        'user_uid': '123456',
        'portfolio_data': 'sample portfolio data'
    }

    response = client.post(
        '/submit-portfolio', data=json.dumps(payload), content_type='application/json')

    assert response.status_code == 500
    assert response.json == {
        'error': 'Error saving to database: Sample Exception'}
    mock_rollback.assert_called_once()
