#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

cd backend/hrms
python manage.py collectstatic --no-input
