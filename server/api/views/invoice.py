from copy import error
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers, status
from rest_framework.decorators import api_view
from rest_framework import permissions
from rest_framework import generics
from weasyprint import HTML
from django.template.loader import render_to_string
import json
from ..models import CompanyArrangement, Invoice, Company, InvoiceArticles, Customer, Product, InternalInvoice
from ..serializers import InvoiceSerializer, InvoiceArticlesSerializer, CustomerSerializer, CompanySerializer, InvoiceSaveSerializer, ProductSerializer, InvoiceArticlesSaveSerializer, InternalInvoiceSerializer
from random import randint
from django.http import HttpResponse
from django.core.files import File
from django.core.mail import EmailMultiAlternatives, send_mail
from django.utils.html import strip_tags
from ..tasks import *
from twilio.rest import Client 
import uuid
from django.db.models import Q

class InvoiceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        for row in request.data[1]:
            invoice = Invoice.objects.get(pk=row, company=Company.objects.get(user=request.user).pk)
            articles = InvoiceArticles.objects.filter(invoice=row)
            if Invoice.objects.filter(company=Company.objects.get(user=request.user).pk).exists():
                try: 
                    invoice_number = Invoice.objects.filter(company=Company.objects.get(user=request.user).pk).order_by('-invoice_number')[0].invoice_number +1
                except:
                    invoice_number = 1
            else:
                invoice_number = 1
            invoice.invoice_number = invoice_number
            invoice.status = request.data[0]            
            invoice_serializer = InvoiceSerializer(invoice, many=False)
            article_serializer = InvoiceArticlesSerializer(articles, many=True)

            pdf_data = {
                "id": invoice_serializer.data['id'],
                "company": invoice_serializer.data['company'],
                "customer": invoice_serializer.data['customer'],
                "invoice_number": invoice_serializer.data['invoice_number'],
                "ocr_number": invoice_serializer.data['ocr_number'],
                "date": invoice_serializer.data['date'],
                "expiry_date": invoice_serializer.data['expiry_date'],
                "netto": invoice_serializer.data['netto'],
                "moms": invoice_serializer.data['moms'],
                "total": invoice_serializer.data['total'],
                "currency": invoice_serializer.data['currency'],
                "message": "",
                "interest": invoice_serializer.data['interest'],
                "delivery": invoice_serializer.data['delivery'],
                "rows": article_serializer.data
            }
            rendered_string = render_to_string("invoice-{}.html".format(invoice_serializer.data['language']), pdf_data)
            HTML(string=rendered_string).write_pdf('api/pdfs/tmp/{}.pdf'.format(invoice_serializer.data['id']), stylesheets=[('api/templates/index.css')])
            invoice.save()
        return Response(status=status.HTTP_200_OK)


    def post(self, request, format=None):
        def ocr_generator():
            ocr_length = 9 # ocr length without controll number
            nums = []
            while len(nums) < ocr_length:
                nums = [randint(1,9)] + nums
            return ocr_controll(nums)

        def ocr_controll(nums):
            check_sum = 0 
            check_offset = (len(nums) + 1) % 2
            for i, n in enumerate(nums):
                if (i + check_offset) % 2 == 0:
                    n_ = n*2
                    check_sum += n_ -9 if n_ > 9 else n_
                else:
                    check_sum += n%10
            ocr_number_list = nums + [10 - (check_sum % 10) ]
            ocr_number_list_string = [str(int) for int in ocr_number_list]
            ocr_number = ''.join(ocr_number_list_string)
            if len(ocr_number) == 10:
                return ocr_number
            else:
                return ocr_generator()

        company_id = request.data[0]['company']
        customer_id = request.data[0]['customer']
        if not Company.objects.filter(user=request.user, pk=company_id).exists() or not Customer.objects.filter(pk=customer_id, belongs_to=company_id).exists():
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        ### FORMAT DATES
        request.data[0]['date'] = request.data[0]['date'][0:10]
        request.data[0]['expiry_date'] = request.data[0]['expiry_date'][0:10]

        try:
            request.data[0]['reminder_date'] = request.data[0]['reminder_date'][0:10]
            request.data[0]['next_invoice'] = request.data[0]['next_invoice'][0:10]
        except:
            pass
        request.data[0]['ocr_number'] = ocr_generator()
        request.data[0]['access_token'] = str(uuid.uuid4())
        invoice_serializer = InvoiceSaveSerializer(data=request.data[0], many=False)
        if invoice_serializer.is_valid():
            saved_invoice = invoice_serializer.save()
            for row in request.data[1]:
                row['invoice'] = saved_invoice.pk
                row['product'] = row['product']
                article_serializer = InvoiceArticlesSaveSerializer(data=row, many=False)
                if article_serializer.is_valid():
                    saved_article = article_serializer.save()
                else:
                    return Response(article_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            article_rows = InvoiceArticles.objects.filter(invoice=saved_invoice.pk)
            article_serialized = InvoiceArticlesSerializer(article_rows, many=True)
            combined_data = invoice_serializer.data, article_serialized.data           
            return Response(article_serialized.data, status=status.HTTP_201_CREATED)
        return Response(invoice_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, format=None):
        invoice_status = self.request.query_params.get('status')
        invoice_data = Invoice.objects.filter(company = Company.objects.get(user=request.user), status=invoice_status).order_by('-invoice_number', 'id')
        serializer = InvoiceSerializer(invoice_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, format=None):
        for invoice in request.data:
            invoice = Invoice.objects.get(company = Company.objects.get(user=request.user), pk=invoice, status='Created')
            invoice.delete()
        return Response({"message": "deleted"}, status=status.HTTP_200_OK)

    def put(self, request, format=None):
        request.data[0]['date'] = request.data[0]['date'][0:10]
        request.data[0]['expiry_date'] = request.data[0]['expiry_date'][0:10]
        try:
            request.data[0]['reminder_date'] = request.data[0]['reminder_date'][0:10]
            request.data[0]['next_invoice'] = request.data[0]['next_invoice'][0:10]
        except:
            pass

        invoice = Invoice.objects.get(pk=request.data[0]['id'], company=Company.objects.get(user=request.user))
        serializer = InvoiceSaveSerializer(invoice, data=request.data[0], partial=False, many=False)
        if serializer.is_valid():
            saved_invoice = serializer.save()
            InvoiceArticles.objects.filter(invoice=saved_invoice.pk).delete()
            for row in request.data[1]:
                row['invoice'] = saved_invoice.pk
                try:
                    row['product'] = row['product']['id']
                    invoice_row = InvoiceArticles.objects.get(pk=row['id'])
                    article_serializer = InvoiceArticlesSaveSerializer(invoice_row, data=row, many=False)
                except:
                    article_serializer = InvoiceArticlesSaveSerializer(data=row, many=False)

                if article_serializer.is_valid():
                    saved_article = article_serializer.save()
                else:
                    return Response(article_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            article_rows = InvoiceArticles.objects.filter(invoice=saved_invoice.pk)
            article_serialized = InvoiceArticlesSerializer(article_rows, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InvoiceByIdView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, id, access_token):
        try:
            invoice_data = Invoice.objects.get(access_token=access_token, pk=id)
        except Invoice.DoesNotExist:
            invoice_data = None
            return Response(status=status.HTTP_404_NOT_FOUND)

        invoice_serializer = InvoiceSerializer(invoice_data, many=False)

        articles = InvoiceArticles.objects.filter(invoice=invoice_serializer.data['id'])
        articles_serializer = InvoiceArticlesSerializer(articles, many=True)

        combined_serializer = invoice_serializer.data, articles_serializer.data
        return Response(combined_serializer)
        

class InvoicePdf(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, id, access_token):
        try:
            invoice_data = Invoice.objects.get(access_token=access_token, pk=id)
        except Invoice.DoesNotExist:
            invoice_data = None
            return HttpResponse(status=404)
        path_to_file =  'api/pdfs/tmp/{}.pdf'.format(id)
        f = open(path_to_file, 'rb')
        pdfFile = File(f)
        response = HttpResponse(pdfFile,content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename=faktura-{}.pdf'.format(id)
        response['Access-Control-Allow-Origin'] = '*'
        return response

class InvoiceByCustomerId(APIView):
    def get(self, request, customer_id):
        invoices = Invoice.objects.filter(customer=customer_id, company=Company.objects.get(user=request.user)).order_by('-invoice_number')
        invoice_serializer = InvoiceSerializer(invoices, many=True)
        return Response(invoice_serializer.data, status=status.HTTP_200_OK)


class InvoiceMass(APIView):
    def post(self, request, format=None):
        def ocr_generator():
            ocr_length = 9 # ocr length without controll number
            nums = []
            while len(nums) < ocr_length:
                nums = [randint(1,9)] + nums
            return ocr_controll(nums)

        def ocr_controll(nums):
            check_sum = 0 
            check_offset = (len(nums) + 1) % 2
            for i, n in enumerate(nums):
                if (i + check_offset) % 2 == 0:
                    n_ = n*2
                    check_sum += n_ -9 if n_ > 9 else n_
                else:
                    check_sum += n%10
            ocr_number_list = nums + [10 - (check_sum % 10) ]
            ocr_number_list_string = [str(int) for int in ocr_number_list]
            ocr_number = ''.join(ocr_number_list_string)
            if len(ocr_number) == 10:
                return ocr_number
            else:
                return ocr_generator()

        invoice_serializer = None
        for customer in request.data[0]['customers']:
            company_id = request.data[0]['company']
            customer_id = customer['id']
            request.data[0]['customer'] = customer_id
            if not Company.objects.filter(user=request.user, pk=company_id).exists() or not Customer.objects.filter(pk=customer_id, belongs_to=company_id).exists():
                return Response(status=status.HTTP_401_UNAUTHORIZED)

            ### FORMAT DATES
            request.data[0]['date'] = request.data[0]['date'][0:10]
            request.data[0]['expiry_date'] = request.data[0]['expiry_date'][0:10]
            try:
                request.data[0]['reminder_date'] = request.data[0]['reminder_date'][0:10]
            except:
                pass
            request.data[0]['ocr_number'] = ocr_generator()
            request.data[0]['access_token'] = str(uuid.uuid4())
            invoice_serializer = InvoiceSaveSerializer(data=request.data[0], many=False)
            if invoice_serializer.is_valid():
                saved_invoice = invoice_serializer.save()
            else:
                return Response(invoice_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            for row in request.data[1]:
                row['invoice'] = saved_invoice.pk
                row['product'] = row['product']
                article_serializer = InvoiceArticlesSaveSerializer(data=row, many=False)
                if article_serializer.is_valid():
                    saved_article = article_serializer.save()
                else:
                    return Response(article_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                article_rows = InvoiceArticles.objects.filter(invoice=saved_invoice.pk)
                article_serialized = InvoiceArticlesSerializer(article_rows, many=True)
                combined_data = invoice_serializer.data, article_serialized.data
      #  return Response(invoice_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(invoice_serializer.data, status=status.HTTP_201_CREATED)

class InvoiceFakturio(APIView):
    def get(self, request):
        invoices = InternalInvoice.objects.filter(customer = Company.objects.get(user=request.user)).order_by('-invoice_number') # CHANGE TO FAKTURIO ACCOUNT
        invoice_serializer = InternalInvoiceSerializer(invoices, many=True)
        return Response(invoice_serializer.data, status=status.HTTP_200_OK)