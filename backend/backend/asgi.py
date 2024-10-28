import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack 
from task_management.routing import websocket_urlpatterns

application = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": application,
        "websocket": AuthMiddlewareStack(  
            URLRouter(websocket_urlpatterns)
        ),
    }
)
