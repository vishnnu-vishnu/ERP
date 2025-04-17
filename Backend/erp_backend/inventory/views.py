from rest_framework.views import Response,status
from inventory.serializers import ProductSerializer
from rest_framework import  viewsets
from rest_framework.permissions import BasePermission,IsAuthenticated
from inventory.models import Product
from rest_framework.decorators import  action
from inventory.utils import get_cached, set_cache, invalidate_cache








    

class IsWarehouseStaff(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role in ['WarehouseStaff', 'Admin']
        )


#product CRUD
class ProductView(viewsets.ModelViewSet):

    queryset = Product.objects.all()
    serializer_class =ProductSerializer
    permission_classes=[IsAuthenticated,IsWarehouseStaff]


    def create(self, request, *args, **kwargs):
        serializer=self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            invalidate_cache("product_list")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        cached_data = get_cached("product_list")
        if cached_data:
            return Response(cached_data)

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        set_cache("product_list", data)
        return Response(data)
    
    def retrieve(self, request, pk=None):
        try:
            product = self.get_queryset().get(pk=pk)
            serializer = self.get_serializer(product)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def update(self, request, pk=None, partial=False):
        try:
           product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(product, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            invalidate_cache("product_list")
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        product.delete()
        invalidate_cache("product_list")
        return Response({'detail': 'Product deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'], url_path='low-stock')
    def low_stock_alert(self, request):
        threshold = int(request.query_params.get('threshold', 5))
        low_stock_products = Product.objects.filter(stock_quantity__lt=threshold)
        serializer = self.get_serializer(low_stock_products, many=True)
        return Response(serializer.data)

