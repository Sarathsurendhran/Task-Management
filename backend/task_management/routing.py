# task_management/routing.py
from django.urls import re_path
from .consumers import TaskConsumer

websocket_urlpatterns = [
    re_path(r'ws/tasks/$', TaskConsumer.as_asgi()),  
]
