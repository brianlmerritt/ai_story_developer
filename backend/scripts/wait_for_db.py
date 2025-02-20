import time
import psycopg2
import os

def wait_for_db():
    while True:
        try:
            conn = psycopg2.connect(
                dbname=os.getenv("POSTGRES_DB"),
                user=os.getenv("POSTGRES_USER"),
                password=os.getenv("POSTGRES_PASSWORD"),
                host=os.getenv("POSTGRES_HOST")
            )
            conn.close()
            return
        except psycopg2.OperationalError:
            print("Database not ready, waiting...")
            time.sleep(1)

if __name__ == "__main__":
    wait_for_db() 