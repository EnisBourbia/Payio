from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import permissions
from ..models import Company, CompanyArrangement
from ..serializers import ArrangementSerializer

class ArrangementView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # def post(self, request, format=None):
    #     serializer = CustomerSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        arrangement_data = CompanyArrangement.objects.get(company=
        Company.objects.get(user=request.user).pk
        )

        serializer = ArrangementSerializer(arrangement_data, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)



