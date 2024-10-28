from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from .serializers import UserSerializer, TaskSerializer
from .models import Task
from django.db.models import Count, Q
from django.utils import timezone


class RegisterView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "User registered successfully"}, status=status.HTTP_201_CREATED
        )


class TaskListCreateView(generics.ListCreateAPIView):

    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)


class TaskStatisticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        total_tasks = Task.objects.filter(user=request.user).count()

        completed_tasks = Task.objects.filter(user=request.user, completed=True).count()

        pending_tasks = total_tasks - completed_tasks

        one_week_ago = timezone.now() - timezone.timedelta(days=7)
        tasks_last_7_days = Task.objects.filter(
            user=request.user, created_at__gte=one_week_ago
        ).count()

        tasks_by_day = (
            Task.objects.filter(user=request.user)
            .values("created_at__week_day")
            .annotate(count=Count("id"))
            .order_by("created_at__week_day")
        )
        tasks_by_day_data = {
            day["created_at__week_day"]: day["count"] for day in tasks_by_day
        }

        data = {
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "tasks_last_7_days": tasks_last_7_days,
            "tasks_by_day": tasks_by_day_data,
        }

        return Response(data)
