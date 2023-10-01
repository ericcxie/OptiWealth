# OptiWealth

A simple portfolio rebalancer based on the Efficient Frontier methodology

### Starting the server
*(127.0.0.1:5000 by default)*

```
cd backend
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```

### Starting the app 
*(localhost:3000 by default)*

```
cd client
npm install
npm start
```

### Running unit tests

```
cd backend/tests && pip install -r test-requirements.txt
python -m pytest
```
