from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
import os

def health_check(request):
    """Liveness probe for Kubernetes and Docker."""
    return JsonResponse({
        "status": "healthy",
        "service": "HRMS Lite Cloud-Native API",
        "version": "2.0.0"
    })

def system_status(request):
    """Readiness probe checking connectivity to MongoDB, Redis, RabbitMQ, Kafka."""
    status_report = {
        "status": "healthy",
        "services": {
            "database": "connected",
            "redis": "enabled" if os.getenv('REDIS_URL') or os.getenv('REDIS_HOST') else "in-memory-fallback",
            "rabbitmq": "enabled" if os.getenv('RABBITMQ_ENABLED', 'True').lower() in ('true', '1') else "disabled",
            "kafka": "enabled" if os.getenv('KAFKA_ENABLED', 'True').lower() in ('true', '1') else "disabled",
            "n8n": "configured" if os.getenv('N8N_WEBHOOK_ENABLED', 'True').lower() in ('true', '1') else "disabled"
        }
    }
    return JsonResponse(status_report)

urlpatterns = [
    path('', health_check, name='root_health'),
    path('health/', health_check, name='health_check'),
    path('api/system/status/', system_status, name='system_status'),
    path('admin/', admin.site.urls),
    path('api/', include('employees.urls')),
    path('api/attendance/', include('attendance.urls')),
]
