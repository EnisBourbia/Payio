
from django.urls import path
from rest_framework.authtoken import views
from . import views

urlpatterns = [
    path('todo/', views.TodoView.as_view(), name='count_of_todos'),
]