from rest_framework import serializers
from django.utils import timezone

from .models import Medication, MedicationLog


class MedicationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MedicationLog
        fields = ['id', 'medication', 'taken_at', 'taken', 'notes', 'created_at']
        read_only_fields = ['created_at']


class MedicationReadSerializer(serializers.ModelSerializer):
    """Full read serializer — includes computed daily-status fields."""
    taken_today      = serializers.SerializerMethodField()
    last_taken       = serializers.SerializerMethodField()
    logs_count_today = serializers.SerializerMethodField()

    class Meta:
        model  = Medication
        fields = [
            'id', 'name', 'description', 'dosage', 'frequency',
            'reminder_time', 'color', 'icon', 'active',
            'created_at', 'updated_at',
            'taken_today', 'last_taken', 'logs_count_today',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_taken_today(self, obj) -> bool:
        return obj.logs.filter(
            taken_at__date=timezone.localdate(), taken=True
        ).exists()

    def get_last_taken(self, obj) -> str | None:
        log = obj.logs.filter(taken=True).first()
        return log.taken_at.strftime('%d/%m/%Y às %H:%M') if log else None

    def get_logs_count_today(self, obj) -> int:
        return obj.logs.filter(taken_at__date=timezone.localdate()).count()


class MedicationWriteSerializer(serializers.ModelSerializer):
    """Write serializer — simple fields only, no computed props."""
    class Meta:
        model  = Medication
        fields = ['id', 'name', 'description', 'dosage', 'frequency',
                  'reminder_time', 'color', 'icon', 'active']
