echo "npm installing" && npm install

cd client
npm start

cd ../backend
pip install -r requirements.txt

# Run tests
python -m pytest

# Start server
python3 app.py

