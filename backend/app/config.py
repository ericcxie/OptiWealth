import os

from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI')
SQLALCHEMY_TRACK_MODIFICATIONS = False

CACHE_TYPE = "SimpleCache"
CACHE_DEFAULT_TIMEOUT = 300  # 5 minutes cache timeout

DATA_FOLDER = 'data/'
UPLOAD_FOLDER = 'data/uploads/'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'csv', 'xlsx'])
