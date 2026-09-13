#!/usr/bin/env bash
# Shell script to start HRMS-Lite distributed cloud-native stack
set -e

echo -e "\033[0;36m==========================================================\033[0m"
echo -e "\033[0;32m🚀 Launching HRMS-Lite Cloud-Native Distributed Platform\033[0m"
echo -e "\033[0;36m==========================================================\033[0m"

if ! docker info > /dev/null 2>&1; then
    echo -e "\033[0;31m❌ Docker daemon is not running. Please start Docker and retry.\033[0m"
    exit 1
fi

echo -e "\033[0;33m📦 Building and starting containers with Docker Compose...\033[0m"
docker compose up -d --build

echo ""
echo -e "\033[0;32m✅ Full Stack Successfully Initialized!\033[0m"
echo -e "\033[0;36m----------------------------------------------------------\033[0m"
echo "🖥️  Frontend Application:       http://localhost:3000"
echo "⚡ Django Backend API:          http://localhost:8000"
echo "🐰 RabbitMQ Management UI:      http://localhost:15672 (guest/guest)"
echo "🤖 n8n Automation Engine:       http://localhost:5678"
echo "📊 Kafka UI Stream Dashboard:   http://localhost:8080"
echo "🏥 System Health Diagnostics:   http://localhost:8000/api/system/status/"
echo -e "\033[0;36m----------------------------------------------------------\033[0m"
echo "To view live streaming logs, run: docker compose logs -f"
