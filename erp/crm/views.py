from django.shortcuts import render
from django.views.generic import TemplateView,ListView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy


from .models import Customer
from .forms import CustomerForm
# Create your views here.

class CustomerTemplateView(TemplateView):
    template_name = 'customers/list.html'
    
class CustomerCreateView(CreateView):
    model = Customer
    form_class = CustomerForm
    context_object_name = 'customer'
    template_name = 'customers/form.html'
    success_url = reverse_lazy('customer_list')    
