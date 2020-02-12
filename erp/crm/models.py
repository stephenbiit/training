from django.db import models

# Create your models here.
class Customer(models.Model):
    name = models.CharField(max_length=200)
    mobile = models.CharField(max_length=10)
    email = models.CharField(max_length=50)

    class Meta:
        db_table = 'tbl_customer'
        app_label = 'crm'

    def __str__(self):
        return self.name
