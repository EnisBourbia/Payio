import json
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
#from rest_framework_simplejwt import
from rest_framework.test import APITestCase
from django.test import TestCase
from rest_framework.test import APIClient
from user.tests import UserTestCase

class InvoiceTestCase(APITestCase):

    def test_company(self):
        UserTestCase.test_authenticate(self)
        data = {
            "name": "Dfdsevler ABs",
            "org_number": "411s2743432",
            "moms_number": "SE8947236432",
            "adress": "Västra hamntgatan 33",
            "country": "Sverige",
            "zip_code": "42434",
            "city": "Gothenburg",
            "residence": "",
            "reference": "Johan Petterson",
            "phone_number": "0735868462",
            "email_contact": "",
            "email_invoice": "support@bolag.se",
            "bankgiro": "5503912",
            "f_skatt": False
        }
        response = self.client.post("/api/invoice/company/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_company(self):
        self.test_company()
        response = self.client.get("/api/invoice/company/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_product(self):
        self.test_company()
        data = {
        "product_number": "321",
        "description": "fdsfds",
        "unit": "st",
        "price": "1321.00",
        "type": "Vara",
        "moms": 12,
        "external_id": "",
        "income_account": 3001,
        "outgoing_moms": 0,
        "sales_account": 3000,
        "sales_account_eu": 3003,
        "sales_account_eu_moms_free": 3002,
        "active": False,
        "company": 1
    }
        
        response = self.client.post("/api/invoice/products/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_product(self):
        self.test_product()
        response = self.client.get("/api/invoice/products/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        
# class ProductTestCase(APITestCase):

#     def test_product(self):
#         client = APIClient()

#         data = {"price": "100", "moms": "25", "active": "true", "company": 1}
#         response = self.client.post(reverse('product'), data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         #response.context['id']
