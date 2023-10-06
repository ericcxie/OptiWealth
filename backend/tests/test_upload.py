# import pytest
# from unittest.mock import patch, MagicMock
# from werkzeug.datastructures import FileStorage
# from app import app
# import os


# SAMPLE_IMAGE_PATH = os.path.join(os.path.dirname(
#     __file__), '..', 'data', 'uploads', 'test_image.jpg')
# SAMPLE_CSV_PATH = os.path.join(os.path.dirname(
#     __file__), '..', 'data', 'uploads', 'test_portfolio.xlsx')


# @pytest.fixture
# def client():
#     app.config['TESTING'] = True
#     with app.test_client() as client:
#         yield client


# def test_upload_no_file(client):
#     response = client.post('/upload', data={})
#     assert response.status_code == 400
#     assert response.json == {'error': 'No file part'}


# def test_upload_no_file_selected(client):
#     data = {'file': (None, '')}
#     response = client.post('/upload', data=data)
#     assert response.status_code == 400
#     assert response.json == {'error': 'No selected file'}


# @patch('app.allowed_file', return_value=True)
# @patch('app.secure_filename', return_value='sample.jpg')
# @patch('app.os.path.join', return_value='/temp/sample.jpg')
# @patch('app.parse_image', return_value='parsed data')
# @patch('app.clean_data', return_value='cleaned data')
# @patch('app.os.remove')
# def test_upload_image(mock_os_remove, mock_clean_data, mock_parse_image, mock_os_path_join, mock_secure_filename, mock_allowed_file, client):
#     with open(SAMPLE_IMAGE_PATH, 'rb') as f:  # Ensure the file path is correct
#         response = client.post('/upload', data={'file': f})
#     assert response.json == 'cleaned data'


# @patch('app.allowed_file', return_value=True)
# @patch('app.secure_filename', return_value='sample.csv')
# @patch('app.os.path.join', return_value='/temp/sample.csv')
# @patch('app.pd.read_csv', return_value=MagicMock(to_dict=MagicMock(return_value='csv data')))
# @patch('app.os.remove')
# def test_upload_csv(mock_os_remove, mock_pd_read_csv, mock_os_path_join, mock_secure_filename, mock_allowed_file, client):
#     with open(SAMPLE_CSV_PATH, 'rb') as f:  # Ensure the file path is correct
#         response = client.post('/upload', data={'file': f})
#     assert response.json == 'csv data'

# # TODO: More tests can be written for other scenarios, like handling errors and other file formats.
