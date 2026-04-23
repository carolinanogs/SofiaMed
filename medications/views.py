from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from .models import Medication, MedicationLog
from .serializers import (
    MedicationReadSerializer,
    MedicationWriteSerializer,
    MedicationLogSerializer,
)


class MedicationViewSet(viewsets.ModelViewSet):
    """
    CRUD completo de remédios + ações customizadas:
      POST /medications/{id}/toggle_taken/  — marca ou desmarca como tomado hoje
      GET  /medications/today_summary/      — resumo do dia
      GET  /medications/{id}/history/       — últimos 30 registros
    """

    def get_queryset(self):
        show_all = self.request.query_params.get('all', 'false').lower() == 'true'
        qs = Medication.objects.prefetch_related('logs')
        return qs if show_all else qs.filter(active=True)

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return MedicationWriteSerializer
        return MedicationReadSerializer

    # ── Custom actions ────────────────────────────────────────────────────────

    @action(detail=True, methods=['post'], url_path='toggle_taken')
    def toggle_taken(self, request: Request, pk=None) -> Response:
        medication = self.get_object()
        today      = timezone.localdate()

        existing = medication.logs.filter(taken_at__date=today, taken=True).first()

        if existing:
            existing.delete()
            taken   = False
            message = f'{medication.name} desmarcado.'
        else:
            MedicationLog.objects.create(
                medication=medication,
                taken=True,
                taken_at=timezone.now(),
                notes=request.data.get('notes', ''),
            )
            taken   = True
            message = f'{medication.icon} {medication.name} marcado como tomado!'

        serializer = MedicationReadSerializer(medication, context={'request': request})
        return Response({'medication': serializer.data, 'taken': taken, 'message': message})

    @action(detail=False, methods=['get'], url_path='today_summary')
    def today_summary(self, request: Request) -> Response:
        today      = timezone.localdate()
        daily_meds = Medication.objects.filter(active=True, frequency='daily')
        total      = daily_meds.count()
        taken_ids  = (
            MedicationLog.objects
            .filter(taken_at__date=today, taken=True, medication__active=True)
            .values_list('medication_id', flat=True)
        )
        taken = daily_meds.filter(id__in=taken_ids).count()

        return Response({
            'date':       today.strftime('%d/%m/%Y'),
            'total':      total,
            'taken':      taken,
            'pending':    total - taken,
            'percentage': round(taken / total * 100) if total else 0,
        })

    @action(detail=True, methods=['get'], url_path='history')
    def history(self, request: Request, pk=None) -> Response:
        medication = self.get_object()
        logs       = medication.logs.order_by('-taken_at')[:30]
        return Response(MedicationLogSerializer(logs, many=True).data)


class MedicationLogViewSet(viewsets.ModelViewSet):
    """CRUD de registros individuais."""
    serializer_class = MedicationLogSerializer

    def get_queryset(self):
        qs       = MedicationLog.objects.select_related('medication').order_by('-taken_at')
        date_str = self.request.query_params.get('date')
        if date_str:
            from datetime import date
            try:
                qs = qs.filter(taken_at__date=date.fromisoformat(date_str))
            except ValueError:
                pass
        return qs
