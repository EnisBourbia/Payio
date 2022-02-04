from ..models import BusinessEvent
from rest_framework import serializers

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessEvent
        fields = '__all__'

    def create(self, validated_data):
        event = BusinessEvent.objects.create(**validated_data)
        return event