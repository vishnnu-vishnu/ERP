from django.shortcuts import render
from rest_framework.views import APIView,Response,status
from admin_app.serializers import UserSerializer,SalesOrderSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework import permissions,viewsets
from rest_framework.permissions import BasePermission,IsAuthenticated
from inventory.models import User,SalesOrder







class UserCreationView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomAuthToken(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = get_user_model().objects.filter(username=username).first()
        if not user:
            return Response({'detail': 'User not found'}, status=404)
        
        if user and user.check_password(password):
            access_token = str(RefreshToken.for_user(user).access_token)
            user_type = user.role 
            return Response({
                'access': access_token,
                'user_type': user_type,
            })
        return Response({'detail': 'Invalid credentials'}, status=400)
    
class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Admin'
    



class SalesStaffListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]  

    def get(self, request):
        sales_staff = User.objects.filter(role='SalesStaff')
        serializer = UserSerializer(sales_staff, many=True)
        return Response(serializer.data)
    

class WarehouseStaffListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]  

    def get(self, request):
        sales_staff = User.objects.filter(role='WarehouseStaff')
        serializer = UserSerializer(sales_staff, many=True)
        return Response(serializer.data)




class OrderItemListView(viewsets.ModelViewSet):
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        return SalesOrder.objects.all()



