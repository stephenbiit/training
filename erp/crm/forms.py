from django.forms import ModelForm
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

from .models import Customer

class CustomerForm(ModelForm):
    
    class Meta:
        model = Customer
        fields = ['name','mobile','email']

