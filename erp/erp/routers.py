from django.conf.urls import url
from rest_framework import routers
from crm.api import CustomerViewSet


common_router = routers.DefaultRouter()
common_router.register(r'customers', CustomerViewSet)
