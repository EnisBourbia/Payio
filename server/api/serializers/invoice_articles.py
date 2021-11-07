from rest_framework import serializers
from ..models import InvoiceArticles
from .product import ProductSerializer

class InvoiceArticlesSaveSerializer(serializers.ModelSerializer):

    class Meta:
        model = InvoiceArticles
        fields = '__all__'

    def create(self, validated_data):
        invoice = InvoiceArticles.objects.create(**validated_data)
        return invoice

class InvoiceArticlesSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = InvoiceArticles
        fields = '__all__'

    def create(self, validated_data):
        invoice = InvoiceArticles.objects.create(**validated_data)
        return invoice