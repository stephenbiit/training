from django.conf.urls import url, include
from rest_framework import routers, serializers, viewsets
from .models import Customer

# Serializers define the API representation.
class CustomerSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Customer
        fields = ['name','mobile','email']