# PowerShell script to bring up the full HRMS-Lite distributed cloud-native stack
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Launching HRMS-Lite Cloud-Native Distributed Platform" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# Check if Docker is running
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Building and starting containers with Docker Compose..." -ForegroundColor Yellow
docker compose up -d --build

Write-Host "`n✅ Full Stack Successfully Initialized!" -ForegroundColor Green
Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
Write-Host "🖥️  Frontend Application:       http://localhost:3000" -ForegroundColor White
Write-Host "⚡ Django Backend API:          http://localhost:8000" -ForegroundColor White
Write-Host "🐰 RabbitMQ Management UI:      http://localhost:15672 (guest/guest)" -ForegroundColor White
Write-Host "🤖 n8n Automation Engine:       http://localhost:5678" -ForegroundColor White
Write-Host "📊 Kafka UI Stream Dashboard:   http://localhost:8080" -ForegroundColor White
Write-Host "🏥 System Health Diagnostics:   http://localhost:8000/api/system/status/" -ForegroundColor White
Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
Write-Host "To view live streaming logs, run: docker compose logs -f" -ForegroundColor DarkGray
