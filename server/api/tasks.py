from celery import shared_task, Celery
from time import sleep
from celery.schedules import crontab
from api.models import Invoice, Company, Customer
from api.serializers import InvoiceSerializer, CustomerSerializer, CompanySerializer
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string, get_template
from django.utils.html import strip_tags
from twilio.rest import Client 


app = Celery()


@app.task
def send_invoice_by_email():
        invoices_to_send = Invoice.objects.filter(format='Email', status=0)
        if not invoices_to_send.exists():
            return None
        for invoices in invoices_to_send:
            serialized_invoice = InvoiceSerializer(invoices, many=False)

            company_data = Company.objects.get(pk=serialized_invoice.data['company'])
            customer_data = Customer.objects.get(pk=serialized_invoice.data['customer'])

            company_serializer = CompanySerializer(company_data, many=False)
            customer_serializer = CustomerSerializer(customer_data, many=False)

            html_context = {
                "invoice": serialized_invoice.data,
                "company": company_serializer.data,
                "customer": customer_serializer.data
            }

            subject = 'Faktura från {}'.format(html_context['company']['name'])

            html_message = render_to_string("emails/invoice.html", html_context)
            plain_message = strip_tags(html_message)
            from_email = 'noreply@fakturio.se'
            to = html_context['customer']['email']

            email = EmailMultiAlternatives(
                subject,
                plain_message,
                from_email,
                [to])
            email.attach_file('api/pdfs/tmp/{}.pdf'.format(html_context['invoice']['id']))
            email.attach_alternative(html_message, "text/html")
            email.send()
            invoices.status = 1
            invoices.save()    
        return True

@app.task
def send_invoice_by_sms():
        invoices_to_send = Invoice.objects.filter(format=1, status=0)
        if not invoices_to_send.exists():
            return None
        for invoices in invoices_to_send:
            serializer = InvoiceSerializer(invoices, many=False)
            serialized_invoice = serializer.data

            account_sid = 'ACab165bde4fe49baa98729402e60cf6d1' 
            auth_token = '15e0332eb9b4c36bc79895a7e700897f' 
            client = Client(account_sid, auth_token) 
            
            message = client.messages.create(  
                messaging_service_sid='MG65d6372d447d00e28d042814244bdab6',   
                body='Hej!\nDu har fått en faktura från\n{}.\nFakturan hittar du på http://localhost:3000/faktura/{}/{}/.\n\nVänliga hälsningar\n {}'.format(serialized_invoice['company']['name'], serialized_invoice['id'], serialized_invoice['access_token'], serialized_invoice['company']['name']),
                to='+46735868462' 
            ) 

            invoices.status = 1
            invoices.save()    
        return True