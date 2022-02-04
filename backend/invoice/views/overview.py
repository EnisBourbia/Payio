from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView


class Overview(APIView):
    def get(self, request, format=None):
        api_urls = {
            'Invoice': 'api/invoice/',
        }

        return Response(api_urls)