from flask import Flask, request, jsonify, redirect, url_for
from image_processing import parse_image, clean_data
from PIL import Image
from flask_cors import CORS
from werkzeug.utils import secure_filename
import pandas as pd


app = Flask(__name__)
CORS(app)

# Path for uploaded images
UPLOAD_FOLDER = 'data/uploads/'

# Allowed file extransions
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/')
def hello_world():
    return 'Hello World!'


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# @app.route('/upload', methods=['POST'])
# def upload_file():
#     if 'file' not in request.files:
#         app.logger.error('No file part in the request')
#         return jsonify({'error': 'No file part in the request'}), 400

#     file = request.files['file']

#     if not allowed_file(file.filename):
#         app.logger.error('Invalid file format: %s', file.filename)
#         return jsonify({'error': 'Invalid file format'}), 400

#     filename = secure_filename(file.filename)
#     file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

#     try:
#         file.save(file_path)

#         # Process the uploaded image with OCR
#         extracted_text = parse_image(file_path)
#         stock_data = clean_data(extracted_text)

#         app.logger.info(
#             'Image uploaded and processed successfully! %s', filename)

#         os.remove(file_path)
#         app.logger.info('Image deleted! %s', filename)

#         return jsonify(stock_data)

#     except Exception as e:
#         app.logger.error('Error processing uploaded image: %s', str(e))
#         return jsonify({'error': 'Error processing uploaded image'}), 500

@app.route('/upload', methods=['POST'])
def upload_file():
    print("Upload endpoint hit!")  # Logs when the endpoint is hit

    if 'file' not in request.files:
        print("No file provided")  # Logs if no file is provided
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        print("No selected file")  # Logs if no file is selected
        return jsonify({'error': 'No selected file'}), 400

    if file:
        try:
            # Logs the received filename
            print(f"Received file: {file.filename}")

            # Read the file using pandas
            df = pd.read_excel(file) if file.filename.endswith(
                '.xlsx') else pd.read_csv(file)

            # Log the first few rows of the DataFrame
            print("First few rows of the received file:")
            print(df.head())

            # Extract required columns and convert to dictionary
            data = df[['Ticker', 'Total Shares']].to_dict(orient='records')

            print("Extracted Data:")
            print(data)  # Logs the extracted data

            return jsonify(data)
        except Exception as e:
            # Logs if any error occurs during file processing
            print(f"Error occurred: {str(e)}")
            return jsonify({'error': str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
