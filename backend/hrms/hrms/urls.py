from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        "status": "online",
        "service": "HRMS Lite Backend API",
        "database": "MongoDB Atlas",
        "version": "1.0.0"
    })

urlpatterns = [
    path('', health_check, name='root_health'),
    path('health/', health_check, name='health_check'),
    path('admin/', admin.site.urls),
    path('api/', include('employees.urls')),
    path('api/attendance/', include('attendance.urls')),
]
