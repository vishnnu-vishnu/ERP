from rest_framework import serializers
from inventory.models import SalesStaff,SalesOrder,OrderItem,User,Product,Admin




    
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['products', 'quantity']



    
class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [ 'name', 'sku', 'price', 'stock_quantity']


class OrderItemSerializer(serializers.ModelSerializer):
    # products=ProductSerializer(read_only=True)
    class Meta:
        model = OrderItem
        fields = ['products', 'quantity']

class SalesOrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    items = OrderItemSerializer(many=True)

    class Meta:
        model = SalesOrder
        fields = ['id', 'user', 'created_at', 'items']
        read_only_fields = ['id', 'user', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        order = SalesOrder.objects.create(user=user, **validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order
    


class OrderSerializer(serializers.ModelSerializer):
    products = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['products', 'quantity']

class SalesSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    items = OrderSerializer(many=True)

    class Meta:
        model = SalesOrder
        fields = ['id', 'user', 'created_at', 'items']
        read_only_fields = ['id', 'user', 'created_at']