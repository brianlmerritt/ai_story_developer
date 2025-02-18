# docker/backend/Dockerfile
FROM python:3.11-slim

# Install development tools and dependencies
RUN apt-get update && apt-get install -y \
    git \
    vim \
    curl \
    build-essential \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements
COPY backend/requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Install development packages
RUN pip install --no-cache-dir \
    black \
    flake8 \
    pytest \
    ipython

# Create migrations directory
RUN mkdir -p migrations/versions

# Start development server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]