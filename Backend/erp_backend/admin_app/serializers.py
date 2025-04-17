from rest_framework import serializers
from inventory.models import Admin,User,SalesOrder,OrderItem,Product






class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)

    class Meta:
        model = Admin  
        fields = ["id", "username", "password", "email", "role"]

    def create(self, validated_data):
        return Admin.objects.create_user(**validated_data)



class UserSerializerfn(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']



# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'role']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'sku', 'price', 'stock_quantity']



class OrderItemSerializer(serializers.ModelSerializer):
    products = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['products', 'quantity']

class SalesOrderSerializer(serializers.ModelSerializer):
    user = UserSerializerfn(read_only=True)
    items = OrderItemSerializer(many=True)

    class Meta:
        model = SalesOrder
        fields = ['id', 'user', 'created_at', 'items']
        read_only_fields = ['id', 'user', 'created_at']