from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from ..serializers.user import UserSerializer, UserGetSerializer
from ..models import User
from rest_framework import status
from rest_framework import permissions

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, format=None):
        user = User.objects.get(email=request.user)
        serializer = UserGetSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
