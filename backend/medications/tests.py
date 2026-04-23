from django.test import TestCase
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from .models import Medication, MedicationLog


class MedicationModelTest(TestCase):
    def setUp(self):
        self.med = Medication.objects.create(
            name='Anticoncepcional',
            dosage='1 comprimido',
            frequency='daily',
            color='#E91E8C',
            icon='💊',
        )

    def test_str(self):
        self.assertEqual(str(self.med), 'Anticoncepcional')

    def test_not_taken_today_by_default(self):
        self.assertFalse(self.med.taken_today())

    def test_taken_today_after_log(self):
        MedicationLog.objects.create(medication=self.med, taken=True)
        self.assertTrue(self.med.taken_today())


class MedicationAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.med = Medication.objects.create(
            name='Vitamina D',
            dosage='2000 UI',
            frequency='daily',
            color='#f59e0b',
            icon='☀️',
        )

    def test_list_medications(self):
        response = self.client.get('/api/medications/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_medication(self):
        data = {'name': 'Ômega 3', 'frequency': 'daily', 'color': '#3b82f6', 'icon': '🔵'}
        response = self.client.post('/api/medications/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Medication.objects.count(), 2)

    def test_toggle_taken(self):
        url = f'/api/medications/{self.med.id}/toggle_taken/'
        # Mark as taken
        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['taken'])
        # Toggle off
        response = self.client.post(url, {}, format='json')
        self.assertFalse(response.data['taken'])

    def test_today_summary(self):
        response = self.client.get('/api/medications/today_summary/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total', response.data)
        self.assertIn('taken', response.data)
        self.assertEqual(response.data['total'], 1)
        self.assertEqual(response.data['taken'], 0)

    def test_delete_medication(self):
        response = self.client.delete(f'/api/medications/{self.med.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Medication.objects.filter(active=True).count(), 0)
