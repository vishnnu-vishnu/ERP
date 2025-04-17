from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = (
        ('Admin', 'Admin'),
        ('SalesStaff', 'SalesStaff'),
        ('WarehouseStaff', 'WarehouseStaff'),
    )
    role=models.CharField(max_length=20, choices=ROLE_CHOICES, default='Admin')
    


class Admin(User):
    email_address=models.EmailField(unique=True)

class SalesStaff(User):
    email_address=models.EmailField(unique=True)

class WarehouseStaff(User):
    email_address=models.EmailField(unique=True)

class Product(models.Model):
    name=models.CharField(max_length=100)
    sku=models.CharField(max_length=50,unique=True)
    category=models.CharField(max_length=50)
    price=models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity=models.IntegerField()

class SalesOrder(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    created_at=models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order=models.ForeignKey(SalesOrder, related_name='items',on_delete=models.CASCADE)
    products=models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity=models.PositiveIntegerField()