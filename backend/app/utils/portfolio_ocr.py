from PIL import Image
import pytesseract
import re
import pdf2image
import fitz


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


def convert_and_crop_pdf(pdf_path, output_path, page_number=0, crop_area=(50, 50, 600, 400)):
    """
    Converts a specific page of a PDF file to a JPG image and crops a specified area from it.

    Args:
        pdf_path (str): The file path of the PDF.
        output_path (str): The file path to save the cropped JPG image.
        page_number (int, optional): The page number to be converted and cropped. Defaults to 0.
        crop_area (tuple, optional): A tuple specifying the crop area in the format (left, upper, right, lower). Defaults to (50, 50, 600, 400).
    """
    # Convert the specified page of the PDF to an image
    images = pdf2image.convert_from_path(
        pdf_path, first_page=page_number+1, last_page=page_number+1)

    if images:
        # Crop the image
        # cropped_img = images[0].crop(crop_area)

        # Save the cropped image
        images[0].save(output_path, 'JPEG')


def parse_pdf_stocks(pdf_path):
    """
    Extracts ticker symbols and their respective quantities from a financial statement PDF, focusing on columns.

    Args:
    pdf_path (str): Path to the PDF file.

    Returns:
    dict: Dictionary with tickers as keys and quantities as values, extracted based on columnar data.
    """
    doc = fitz.open(pdf_path)
    text = ''
    for page in doc:
        text += page.get_text()

    doc.close()
    ticker_quantity_pattern_columnar = r'\b([A-Z]{2,5})\s+(\d+\.\d{4})'
    matches = re.findall(ticker_quantity_pattern_columnar, text)

    ticker_quantity_dict = {ticker: quantity for ticker, quantity in matches}

    return ticker_quantity_dict


if __name__ == '__main__':
    pdf_path = '../../data/uploads/financial_statement.pdf'
    # output_path = '../../data/uploads/financial_statement.jpg'

    # convert_and_crop_pdf(pdf_path, output_path,
    #                      page_number=0, crop_area=(50, 50, 600, 400))
    ticker_quantities = parse_pdf_stocks(pdf_path)
    print(ticker_quantities)
