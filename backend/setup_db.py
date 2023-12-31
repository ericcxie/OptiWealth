import os

import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_CONFIG = {
    'dbname': os.getenv('DATABASE_NAME'),
    'user': os.getenv('DATABASE_USER'),
    'password': os.getenv('DATABASE_PASSWORD'),
    'host': 'monorail.proxy.rlwy.net',
    'port': '32065'
}


def create_tables():
    create_portfolio_history_sql = """
    CREATE TABLE IF NOT EXISTS portfolio_history
    (
        id              SERIAL PRIMARY KEY,
        user_email      VARCHAR(255) REFERENCES users_portfolio (user_email),
        portfolio_value TEXT,
        timestamp       TIMESTAMP DEFAULT (now() AT TIME ZONE 'utc')
    );
    """

    create_users_portfolio_sql = """
    CREATE TABLE IF NOT EXISTS users_portfolio
    (
        id             SERIAL PRIMARY KEY,
        user_email     VARCHAR(255) NOT NULL UNIQUE,
        user_uid       TEXT NOT NULL UNIQUE,
        portfolio_data TEXT NOT NULL
    );
    """

    try:
        with psycopg2.connect(**DATABASE_CONFIG) as conn:
            with conn.cursor() as cursor:
                cursor.execute(create_users_portfolio_sql)
                cursor.execute(create_portfolio_history_sql)
                conn.commit()
                print("Tables created successfully.")

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error while creating PostgreSQL table: {error}")


if __name__ == "__main__":
    create_tables()
