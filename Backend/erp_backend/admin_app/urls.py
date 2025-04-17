from django.urls import path,include
from admin_app import views
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.routers import DefaultRouter


router=DefaultRouter()
# router.register('products', views.ProductView, basename='product')
router.register('list_order',views.OrderItemListView,basename='list_order')

urlpatterns = [
    path("register/",views.UserCreationView.as_view(),name="signup"),
    path('token/',views.CustomAuthToken.as_view(), name='token'),
    path('sales_staff/', views.SalesStaffListView.as_view(), name='sales_staff'),
    path('warehouse_staff/', views.WarehouseStaffListView.as_view(), name='warehouse_staff'),



    
]+router.urls