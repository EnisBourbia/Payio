from rest_framework import serializers
from ..models import CompanyArrangement

class ArrangementSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyArrangement
        fields = '__all__'

    def create(self, validated_data):
        arrangement = CompanyArrangement.objects.create(**validated_data)
        return arrangement