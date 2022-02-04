from celery import shared_task, Celery
from time import sleep
from celery.schedules import crontab
from .models import Invoice, Company, Customer
from .serializers import InvoiceSerializer, CustomerSerializer, CompanySerializer
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string, get_template
from django.utils.html import strip_tags
from twilio.rest import Client 
from django.conf import settings
import environ
env = environ.Env()
environ.Env.read_env()

app = Celery()


@app.task
def send_invoice_by_email():
        invoices_to_send = Invoice.objects.filter(status='Attested', delivery='Email')
        if not invoices_to_send.exists():
            return None
        for invoices in invoices_to_send:
            serialized_invoice = InvoiceSerializer(invoices, many=False)

            html_context = {
                "invoice": serialized_invoice.data,
                "FRONTEND_HOST": settings.FRONTEND_HOST
            }

            subject = 'Faktura från {}'.format(html_context['invoice']['company']['name'])

            html_message = render_to_string("emails/invoice.html", html_context)
            plain_message = strip_tags(html_message)
            from_email = 'noreply@fakturio.se'
            to = html_context['invoice']['customer']['email_invoice']

            email = EmailMultiAlternatives(
                subject,
                plain_message,
                from_email,
                [to])
            email.attach_file('invoice/pdfs/tmp/{}.pdf'.format(html_context['invoice']['id']))
            email.attach_alternative(html_message, "text/html")
            email.send()
            invoices.status = 'Sent'
            invoices.save()    
        return True

@app.task
def send_invoice_by_sms():
        invoices_to_send = Invoice.objects.filter(status='Attested', delivery='SMS')
        if not invoices_to_send.exists():
            return None
        for invoices in invoices_to_send:
            serializer = InvoiceSerializer(invoices, many=False)
            serialized_invoice = serializer.data
            account_sid = env('ACCOUNT_SID_TWILIO')
            auth_token = env('AUTH_TOKEN_TWILIO')
            client = Client(account_sid, auth_token) 
            
            message = client.messages.create(  
                messaging_service_sid='MG65d6372d447d00e28d042814244bdab6',   
                body='Hej!\nDu har fått en faktura från\n{}.\nFakturan hittar du på {}/faktura/{}/{}/.\n\nVänliga hälsningar\n {}'.format(serialized_invoice['company']['name'], settings.FRONTEND_HOST ,serialized_invoice['id'], serialized_invoice['access_token'], serialized_invoice['company']['name']),
                to=serialized_invoice['customer']['phone_number']
            ) 

            invoices.status = 'Sent'
            invoices.save()    
        return True