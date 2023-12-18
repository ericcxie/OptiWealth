<div align="center">
    <div id="user-content-toc">
      <ul>
          <summary><h1 style="display: inline-block; margin-bottom:0px">OptiWealth</h1></summary>
      </ul>
    </div>
    <h3>An All-in-One Investment Management Platform</h3>
    <h4><i>Monitor, Analyze, and Rebalance Your Portfolio to Align with Your Financial Goals</i></h4>
    <br>
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
    <img src="https://img.shields.io/badge/Typescript-%2320232a.svg?style=for-the-badge&logo=typescript&logoColor=blue"/>
    <img src="https://img.shields.io/badge/Flask-%23404d59.svg?style=for-the-badge&logo=flask&logoColor=white"/>
    <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white"/>
    <img src="https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white"/>
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
    <img src="https://img.shields.io/badge/Vercel-000000.svg?style=for-the-badge&logo=Vercel&logoColor=white"/>
    <img src="https://img.shields.io/badge/Railway-0B0D0E.svg?style=for-the-badge&logo=Railway&logoColor=white"/>
    <br><br>
</div>

![preview](https://github.com/ericcxie/OptiWealth/assets/66566975/48d51d8e-acb3-4f0b-9a98-78c450f2ea14)

## What is OptiWealth?

_OptiWealth is a modern investment management platform designed to assist users in optimizing their portfolio allocations. It helps users maintain an ideal asset allocation that aligns with their risk tolerance and financial goals._

## Getting Started

### Starting the server

_(127.0.0.1:5000 by default)_

1. `cd backend`
1. `python3 -m venv venv`
1. `source venv/bin/activate` (MacOS)
1. `venv/Scripts/activate` (Powershell)
1. `pip install -r requirements.txt`
1. `python3 run.py`

### Starting the app

_(localhost:3000 by default)_

1. `cd client`
1. `npm install`
1. `npm start`

### Setting up database

_To get started, please create a new database in PostgreSQL and give it a name (eg. `OptiWealth`)_

1. `cd backend`
1. `touch .env`

Add the following in the `.env` file and replace with your own db credentials

```
DATABASE_URI=postgresql://[YourUsername]:[YourPassword]@localhost/[YourDatabaseName]
DATABASE_PASSWORD=[YourPassword]
DATABASE_USER=[YourUsername]
DATABASE_NAME=[YourDatabaseName]
DATABASE_HOST=[YourHost]
DATABASE_PORT=[YourPort]
AES_ENCRYPTION_KEY=[Your32ByteBase64EncodedKey]
```

To create the tables, run the `setup_db.py` file (located in `/backend` directory)

### Setting up Firebase Auth Environment Variables

_OptiWealth uses Firebase for authentication, please create a Firebase account before running the application_

1. `cd client`
1. `touch .env.local`

Add the following in the `.env.local` file and replace with your own Firebase provided credentials

```
REACT_APP_apiKey=[FirebaseAPIKey]
REACT_APP_authDomain=[FirebaseAuthDomain]
REACT_APP_projectId=[FirebaseProjectID]
REACT_APP_storageBucket=[FirebaseBucket]
REACT_APP_messagingSenderId=[FirebaseSenderID]
REACT_APP_appId=[FirebaseAppID]
REACT_APP_measurementId=[FirebaseMeasurementID]
REACT_APP_API_BASE_URL=http://127.0.0.1:5000
```

### Encryption

AES symmetric key encryption is employed in the database to ensure the security of sensitive data like user portfolio and portfolio value.

The AES key is 32 bytes long and base64-encoded, stored in the `.env` file. The key can be generated using the following script:

```
from Crypto.Random import get_random_bytes
import base64

AES_ENCRYPTION_KEY = base64.b64encode(get_random_bytes(32)).decode()
```

The methods for encryption/decryption can be found in `backend/app/utils/encryption.py`

### Running unit tests

1. `cd backend/tests`
1. `pip install -r test-requirements.txt`
1. `python3 -m pytest`

## Architecture Overview

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/ericcxie/OptiWealth/assets/66566975/7af25ed5-41a8-43b2-a674-aae10d32d98c">  
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/ericcxie/OptiWealth/assets/66566975/6093f3a0-806b-4c87-afca-a10300b5b9d6">
  <img alt="OptiWealth Architecture" src="https://github.com/ericcxie/OptiWealth/assets/66566975/7af25ed5-41a8-43b2-a674-aae10d32d98c">
</picture>

_(As of Oct. 8, 2023)_

## Demo Account

You can sign into a demo account at [OptiWealth.app](https://www.optiwealth.app) using the following account credentials:

```
Email address: johnsmith@gmail.com
Password: password
```

_Please note that this is a demo account, and the data you see is not real._

## Video Demo

https://github.com/ericcxie/OptiWealth/assets/66566975/63693f29-5a5a-4182-914f-73765cc9aa88
