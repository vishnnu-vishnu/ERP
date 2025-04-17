from django.urls import path,include
from inventory import views
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.routers import DefaultRouter


router=DefaultRouter()
router.register('products', views.ProductView, basename='product')


urlpatterns = [
    
]+router.urls