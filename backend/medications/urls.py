from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import MedicationViewSet, MedicationLogViewSet

router = DefaultRouter()
router.register(r'medications', MedicationViewSet, basename='medication')
router.register(r'logs',        MedicationLogViewSet, basename='log')

urlpatterns = [
    path('', include(router.urls)),
]
