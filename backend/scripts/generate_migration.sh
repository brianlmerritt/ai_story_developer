#!/bin/bash
set -e

echo "Generating migrations..."
alembic revision --autogenerate -m "auto_generated_migration" 