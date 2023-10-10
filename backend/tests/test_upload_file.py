import pytest
from app import app
from werkzeug.datastructures import FileStorage
from io import BytesIO
from unittest.mock import patch


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_upload_image_file_success(client):
    content = b"fake_image_content"
    file = FileStorage(stream=BytesIO(content),
                       filename='test.png', content_type='image/png')

    with patch('app.views.parse_image', return_value={"Ticker": "AAPL", "Total Shares": 10}), \
            patch('app.views.clean_data', return_value={"Ticker": "AAPL", "Total Shares": 10}):

        response = client.post('/upload', data={'file': file})
        assert response.status_code == 200
        assert response.get_json() == {"Ticker": "AAPL", "Total Shares": 10}


def test_upload_csv_file_success(client):
    content = b"Ticker,Total Shares\nAAPL,10\n"
    file = FileStorage(stream=BytesIO(content),
                       filename='test.csv', content_type='text/csv')

    response = client.post('/upload', data={'file': file})
    assert response.status_code == 200
    assert response.get_json() == [{"Ticker": "AAPL", "Total Shares": 10}]


def test_upload_invalid_file_format(client):
    content = b"some content"
    file = FileStorage(stream=BytesIO(content),
                       filename='test.txt', content_type='text/plain')

    response = client.post('/upload', data={'file': file})
    assert response.status_code == 400
    assert response.get_json() == {'error': 'Invalid file format'}


def test_upload_no_file_sent(client):
    response = client.post('/upload')
    assert response.status_code == 400
    assert response.get_json() == {'error': 'No file part'}


def test_upload_empty_filename(client):
    file = FileStorage(filename='')
    response = client.post('/upload', data={'file': file})
    assert response.status_code == 400
    assert response.get_json() == {'error': 'No selected file'}
