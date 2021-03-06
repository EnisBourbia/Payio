from rest_framework import serializers
from user.models import User
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password']

    def create(self, validated_data):
        user = User.objects.create(first_name=validated_data['first_name'], last_name=validated_data['last_name'], email=validated_data['email'], password=make_password(validated_data['password']))
        return user

class UserGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']

