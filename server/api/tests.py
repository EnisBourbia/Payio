import json
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
#from rest_framework_simplejwt import
from rest_framework.test import APITestCase
from django.test import TestCase
from rest_framework.test import APIClient

# Create your tests here.
class UserTestCase(APITestCase):

    def test_authenticate(self):
        data = {"email": "test@gmail.com", "first_name": "Test_name", "last_name": "test_last", "password": "password_test123"}
        self.client.post("/api/register/", data)
        
        data = {"email": "test@gmail.com", "password": "password_test123"}
        response = self.client.post("/api/authenticate/", data)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer {}'.format(response.data["access"]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_company(self):
        self.test_authenticate()
        response = self.client.get("/api/company/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        

        
# class ProductTestCase(APITestCase):

#     def test_product(self):
#         client = APIClient()

#         data = {"price": "100", "moms": "25", "active": "true", "company": 1}
#         response = self.client.post(reverse('product'), data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         #response.context['id']
