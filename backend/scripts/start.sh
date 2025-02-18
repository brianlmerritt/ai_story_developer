#!/bin/bash
set -e

# Wait for database to be ready
echo "Waiting for database..."
python scripts/wait_for_db.py

# Run migrations from the correct location
echo "Running migrations..."
echo "Current directory: $(pwd)"
echo "Listing alembic versions directory:"
ls -la /app/alembic/versions/
echo "Listing migrations versions directory:"
ls -la /app/migrations/versions/

echo "Checking alembic config..."
cd /app && alembic current
echo "Alembic version locations:"
cd /app && alembic show current

cd /app && alembic upgrade head

# Start the application
echo "Starting application..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload 