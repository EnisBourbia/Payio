from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import permissions
from rest_framework.parsers import FileUploadParser, MultiPartParser, JSONParser

from ..models import Company, CompanyArrangement
from ..serializers import CompanySerializer, ArrangementSerializer
from uuid import uuid4

class CompanyView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, JSONParser, FileUploadParser]

    def post(self, request, format=None):
        serializer = CompanySerializer(data=request.data, many=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        company = Company.objects.get(user=request.user)  
        try:      
            if request.data['logo'] == 'delete':
                company.logo = None
                company.save()
                return Response(status=status.HTTP_200_OK)
        except:    
            print('No logo patched')
        serializer = CompanySerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        try:
            company_data = Company.objects.get(user=request.user)        
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CompanySerializer(company_data)
        return Response(serializer.data, status=status.HTTP_200_OK)



