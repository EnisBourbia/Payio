from rest_framework import serializers
from ..models import Company
from .arrangement import ArrangementSerializer
from .user import UserSerializer

class CompanySerializer(serializers.ModelSerializer):
    arrangement = ArrangementSerializer(source='companyarrangement', read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Company
        fields = '__all__'

    def create(self, validated_data):
        company = Company.objects.create(**validated_data)
        return company
    

    