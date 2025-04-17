from django.shortcuts import render
from rest_framework.views import APIView,Response,status
from sales.serializers import SalesOrderSerializer,SalesSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework import permissions,viewsets
from rest_framework.permissions import BasePermission,IsAuthenticated
from inventory.models import SalesOrder,Product
from inventory.serializers import ProductSerializer
from inventory.utils import get_cached, set_cache, invalidate_cache
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from rest_framework.decorators import api_view,permission_classes
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.platypus import Table, TableStyle
from reportlab.lib import colors
from io import BytesIO











    

class IsSaleStaff(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'SalesStaff'


class ProductView(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes=[permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        cached_data = get_cached("product_list")
        if cached_data:
            return Response(cached_data)

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        set_cache("product_list", data)
        return Response(data)

class SalesOrderViewSet(viewsets.ModelViewSet):
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer
    permission_classes = [IsAuthenticated, IsSaleStaff]

    def perform_create(self, serializer):
        order = serializer.save()
        for item in order.items.all():
            product = item.products
            product.stock_quantity -= item.quantity
            product.save()
        invalidate_cache("product_list")

    

    

class MyOrdersAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user  
        orders = SalesOrder.objects.filter(user=user).order_by('-created_at')
        serializer = SalesSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)





    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_invoice(request, order_id):
    try:
        order = SalesOrder.objects.get(id=order_id, user=request.user)
    except SalesOrder.DoesNotExist:
        return Response({"error": "Order not found or access denied"}, status=status.HTTP_404_NOT_FOUND)

    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    p.setFont("Helvetica-Bold", 20)
    p.drawString(200, 800, "INVOICE")

    p.setFont("Helvetica", 12)
    p.drawString(50, 770, f"Order ID: {order.id}")
    p.drawString(50, 755, f"Date: {order.created_at.strftime('%Y-%m-%d')}")
    p.drawString(50, 740, f"Customer: {request.user.get_full_name()} ({request.user.email})")

    data = [["Product", "Quantity", "Unit Price", "Total Price"]]
    total = 0

    for item in order.items.all():
        name = item.products.name
        qty = item.quantity
        price = item.products.price
        line_total = qty * price
        total += line_total
        data.append([name, str(qty), f"₹{price}", f"₹{line_total}"])

    data.append(["", "", "Total", f"₹{total}"])

    table = Table(data, colWidths=[200, 100, 100, 100])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
    ]))

    table.wrapOn(p, width, height)
    table.drawOn(p, 50, 550 - 20 * len(data))  

    p.setFont("Helvetica-Oblique", 10)
    p.drawString(50, 100, "Thank you for your purchase!")

    p.save()

    buffer.seek(0)
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename=invoice_{order.id}.pdf'
    return response