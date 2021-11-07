from rest_framework import serializers
from ..models import Invoice, InvoiceArticles
from .customer import CustomerSerializer
from .invoice_articles import InvoiceArticlesSerializer
from .company import CompanySerializer


class InvoiceSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    company = CompanySerializer(read_only=True)

    class Meta:
        model = Invoice
        fields = '__all__'
        
    def create(self, validated_data):
        invoice = Invoice.objects.create(**validated_data)
        return invoice



class InvoiceSaveSerializer(serializers.ModelSerializer):

    class Meta:
        model = Invoice
        fields = '__all__'
        
    def create(self, validated_data):
        invoice = Invoice.objects.create(**validated_data)
        return invoice