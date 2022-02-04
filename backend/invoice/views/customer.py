from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import permissions
from ..models import Customer, Company
from ..serializers import CustomerSerializer

class CustomerView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        company_data = Customer.objects.filter(
            belongs_to = Company.objects.get(user=request.user)
        )
        serializer = CustomerSerializer(company_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, format=None):
        customer = Customer.objects.get(pk=request.data['id'], belongs_to=Company.objects.get(user=request.user))
        serializer = CustomerSerializer(customer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerByIdView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, id):
        customer = Customer.objects.get(pk=id, belongs_to=Company.objects.get(user=request.user))
        customer.delete()
        return Response({"message": "deleted"}, status=status.HTTP_200_OK)