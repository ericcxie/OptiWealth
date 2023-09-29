from PIL import Image
import pytesseract
import re

def parse_image(image_path):
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
    stock_data = {}

    pattern = r'\b([A-Z]+)\s+(\d+\.\d+)\s+\d+\.\d+\s+\S+\s+\S+\b'

    for line in target_data:
        match = re.match(pattern, line)
        
        if match:
            ticker, quantity = match.groups()
            stock_data[ticker] = float(quantity)  # Convert quantity to float
    
    return stock_data

