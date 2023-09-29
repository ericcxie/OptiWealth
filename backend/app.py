from flask import Flask, request, jsonify, redirect, url_for
from image_processing import parse_image, clean_data
from PIL import Image
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os


app = Flask(__name__)

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


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        print("Request data", request.data)
        print("Request files", request.files)

        if 'file' not in request.files:
            return 'bad request!', 400
        file = request.files['file']

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            # Process the uploaded image with OCR
            extracted_text = parse_image(os.path.join(
                app.config['UPLOAD_FOLDER'], filename))
            stock_data = clean_data(extracted_text)

            return jsonify(stock_data)
        else:
            return jsonify({'error': 'Invalid file format'})


if __name__ == "__main__":
    app.run(debug=True)
