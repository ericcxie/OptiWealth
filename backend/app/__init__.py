from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_caching import Cache

from .config import *

app = Flask(__name__)
app.config.from_object('app.config')

db = SQLAlchemy(app)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
CORS(app)
cache = Cache(app)

# Only import views and models after db and app have been created to avoid circular imports.
from . import views, models