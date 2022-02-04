from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import permissions
from ..models import Product, Company
from ..serializers import ProductSerializer

class ProductView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        # request.data._mutable = True
        request.data['company'] = Company.objects.get(user=request.user).pk
        # request.data._mutable = False
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        products = Product.objects.filter(
            company = Company.objects.get(user=request.user)
        )
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, format=None):
        print(request.data)
        product = Product.objects.get(pk=request.data['id'], company=Company.objects.get(user=request.user))
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        product = Product.objects.get(pk=request.data, company=Company.objects.get(user=request.user))
        product.delete()
        return Response({"message": "deleted"}, status=status.HTTP_200_OK)


class ProductByIdView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, id):
        customer = Product.objects.get(pk=id, company=Company.objects.get(user=request.user))
        customer.delete()
        return Response({"message": "deleted"}, status=status.HTTP_200_OK)
