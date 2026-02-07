from django.urls import path
from . import views

urlpatterns = [
    path('employees/', views.get_employees),
    path('employees/add/', views.add_employee),
    path('employees/delete/<str:emp_id>/', views.delete_employee),
]
