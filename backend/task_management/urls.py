from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views


urlpatterns = [
    path("register/", views.RegisterView.as_view()),
    path("login/", TokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("tasks/", views.TaskListCreateView.as_view()),
    path('statistics/', views.TaskStatisticsView.as_view()),
    path('tasks/<int:pk>/', views.TaskDetailView.as_view()),
]
