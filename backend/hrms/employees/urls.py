from django.urls import path
from . import views

urlpatterns = [
    path('employees/', views.get_employees, name='get_employees'),
    path('employees/add/', views.add_employee, name='add_employee'),
    path('employees/delete/<str:emp_id>/', views.delete_employee, name='delete_employee'),
    path('employees/upload-photo/', views.upload_employee_photo, name='upload_employee_photo'),
    path('profile/upload-avatar/', views.upload_admin_avatar, name='upload_admin_avatar'),
]

