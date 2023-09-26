echo "npm installing" && npm install

cd client
npm start

cd ../backend
pip install -r requirements.txt
run flask

