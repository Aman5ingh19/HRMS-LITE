from django.urls import path
from . import views

urlpatterns = [
    path('checkin/', views.check_in, name='check_in'),
    path('checkout/', views.check_out, name='check_out'),
    path('', views.get_all_attendance, name='get_all_attendance'),
    path('<str:employee_id>/', views.get_employee_attendance, name='get_employee_attendance'),
]
