from django.urls import path,include
from sales import views
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.routers import DefaultRouter


router=DefaultRouter()
router.register('order', views.SalesOrderViewSet, basename='order')
router.register('products', views.ProductView, basename='product')


urlpatterns = [
    path('invoice/<int:order_id>/', views.generate_invoice, name='generate-invoice'),
    path('listorders/', views.MyOrdersAPIView.as_view(), name='orders'),


    
]+router.urls