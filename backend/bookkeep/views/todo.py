from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import permissions
from invoice.models import Company
from ..models import BusinessEvent
from ..serializers import *

class TodoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # def post(self, request, format=None):
    #     serializer = CustomerSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        todo_count = 0

        todo_count += BusinessEvent.objects.filter(company=Company.objects.get(user=request.user)).count()
        todo_needs_approval = BusinessEvent.objects.filter(company=Company.objects.get(user=request.user), status='Needs approval')
        todo_needs_approval_serializer = EventSerializer(todo_needs_approval, many=True)
        return Response({"todo_count": todo_count, "needs_approval": todo_needs_approval_serializer.data}, status=status.HTTP_200_OK)