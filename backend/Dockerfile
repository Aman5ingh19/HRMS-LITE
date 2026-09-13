# ==============================================================================
# HRMS Lite - Production Backend Dockerfile
# ==============================================================================

FROM python:3.11-slim AS base

# Prevent Python from writing .pyc files and enable unbuffered output for real-time logs
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/hrms/ /app/

# Create a non-privileged user for secure execution
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser \
    && mkdir -p /app/staticfiles /app/logs \
    && chown -R appuser:appgroup /app

USER appuser

# Expose Django port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health/ || exit 1

# Default startup: collect static files & launch Gunicorn WSGI server
CMD ["sh", "-c", "python manage.py collectstatic --noinput && gunicorn hrms.wsgi:application --bind 0.0.0.0:8000 --workers 3 --threads 2 --timeout 60 --access-logfile - --error-logfile -"]
