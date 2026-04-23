from django.contrib import admin
from .models import Medication, MedicationLog


@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display  = ['name', 'dosage', 'frequency', 'reminder_time', 'active', 'created_at']
    list_filter   = ['active', 'frequency']
    search_fields = ['name']
    ordering      = ['name']


@admin.register(MedicationLog)
class MedicationLogAdmin(admin.ModelAdmin):
    list_display   = ['medication', 'taken', 'taken_at', 'notes']
    list_filter    = ['taken', 'medication']
    date_hierarchy = 'taken_at'
    ordering       = ['-taken_at']
