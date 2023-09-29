# test_image_processing.py
import os
import pytest
from PIL import Image
from image_processing import parse_image, clean_data

# Define the path to the test image
TEST_IMAGE_PATH = os.path.join(os.path.dirname(
    __file__), '..', 'data', 'uploads', 'test_image.jpg')

# Define expected results for testing
EXPECTED_TEXT = ['Shares Shares Price ($) Value ($)', 'XGRO 2.0000 2.0000 $24.96 CAD $49.92', 'VEQT 2.0000 2.0000 $35.31 CAD $70.62', 'VGRO 3.0000 3.0000 $31.12 CAD $93.36', 'VFV 4.0000 4.0000 $100.50 CAD $402.00',
                 '(The conversion rate used to convert your month-end Market Value to CAD is: $1USD = 1.2505 CAD)', 'AAPL 1.0000 1.0000 $174.61 USD $218.35', 'Total $834.25', 'Book', 'Cost* ($)', '$49.76', '$69.67', '$93.05', '$387.14', '$195.98', '$795.60']

EXPECTED_STOCK_DATA = {'XGRO': 2.0, 'VEQT': 2.0,
                       'VGRO': 3.0, 'VFV': 4.0, 'AAPL': 1.0}


def test_parse_image():
    # Test parsing text from the test image
    extracted_text = parse_image(TEST_IMAGE_PATH)
    assert extracted_text == EXPECTED_TEXT


def test_clean_data():
    # Test cleaning and extracting stock data from the extracted text
    stock_data = clean_data(EXPECTED_TEXT)
    assert stock_data == EXPECTED_STOCK_DATA


if __name__ == "__main__":
    pytest.main()
