from rest_framework import serializers
from ..models import InternalInvoice
from .company import CompanySerializer


class InternalInvoiceSerializer(serializers.ModelSerializer):
    customer = CompanySerializer(read_only=True)

    class Meta:
        model = InternalInvoice
        fields = '__all__'
        
    def create(self, validated_data):
        invoice = InternalInvoice.objects.create(**validated_data)
        return invoice



class InternalInvoiceSaveSerializer(serializers.ModelSerializer):

    class Meta:
        model = InternalInvoice
        fields = '__all__'
        
    def create(self, validated_data):
        invoice = InternalInvoice.objects.create(**validated_data)
        return invoice