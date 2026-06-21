from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Document

# User registration serializer
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm password", style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords must match.")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

# Profile serializer
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

# Document serializer
# backend/api/serializers.py
class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ['user', 'upload_time', 'file_name', 'keywords']  # Add this
