from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Sweet

class SweetTests(APITestCase):

    def setUp(self):
        # Create some sample data for testing
        self.chocolate = Sweet.objects.create(name='Chocolate', category='Chocolate', price=30, quantity=5)
        self.gulab_jamun = Sweet.objects.create(name='Gulab Jamun', category='Indian Sweet', price=50, quantity=10)
        self.lollipop = Sweet.objects.create(name='Lollipop', category='Candy', price=10, quantity=2)

    def test_search_by_name(self):
        """
        Ensure we can search for a sweet by its name.
        """
        url = reverse('sweet-list')  # Assuming your list view is named 'sweet-list'
        response = self.client.get(f'{url}?search=Gulab')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Gulab Jamun')

    # Add more tests here for other search criteria (e.g., category, price range)
