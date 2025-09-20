from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Sweet
from .serializers import SweetSerializer

class SweetViewSet(viewsets.ModelViewSet):
    queryset = Sweet.objects.all()
    serializer_class = SweetSerializer
    permission_classes = [IsAuthenticated]

    # ✅ search sweets by name, category, price range
    @action(detail=False, methods=['get'])
    def search(self, request):
        name = request.query_params.get('name')
        category = request.query_params.get('category')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')

        sweets = Sweet.objects.all()
        if name:
            sweets = sweets.filter(name__icontains=name)
        if category:
            sweets = sweets.filter(category__icontains=category)
        if min_price and max_price:
            sweets = sweets.filter(price__gte=min_price, price__lte=max_price)

        serializer = SweetSerializer(sweets, many=True)
        return Response(serializer.data)

    # ✅ purchase sweet (quantity -1)
    @action(detail=True, methods=['post'])
    def purchase(self, request, pk=None):
        sweet = self.get_object()
        if sweet.quantity > 0:
            sweet.quantity -= 1
            sweet.save()
            return Response({"message": f"Purchased {sweet.name}"})
        return Response({"error": "Out of stock"}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ restock sweet (admin only)
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def restock(self, request, pk=None):
        sweet = self.get_object()
        amount = int(request.data.get("amount", 1))
        sweet.quantity += amount
        sweet.save()
        return Response({"message": f"Restocked {sweet.name} by {amount}"})
