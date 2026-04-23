from django.db import models
from django.utils import timezone


class Medication(models.Model):
    FREQUENCY_CHOICES = [
        ('daily',       'Diário'),
        ('weekly',      'Semanal'),
        ('when_needed', 'Quando necessário'),
    ]

    name          = models.CharField(max_length=200, verbose_name='Nome')
    description   = models.TextField(blank=True, verbose_name='Descrição')
    dosage        = models.CharField(max_length=100, blank=True, verbose_name='Dosagem')
    frequency     = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='daily', verbose_name='Frequência')
    reminder_time = models.TimeField(null=True, blank=True, verbose_name='Horário de lembrete')
    color         = models.CharField(max_length=7, default='#E91E8C', verbose_name='Cor')
    icon          = models.CharField(max_length=10, default='💊', verbose_name='Ícone')
    active        = models.BooleanField(default=True, verbose_name='Ativo')
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = 'Remédio'
        verbose_name_plural = 'Remédios'
        ordering            = ['name']

    def __str__(self):
        return self.name

    def taken_today(self) -> bool:
        return self.logs.filter(
            taken_at__date=timezone.localdate(),
            taken=True
        ).exists()

    def last_taken_display(self) -> str | None:
        log = self.logs.filter(taken=True).first()
        if log:
            return log.taken_at.strftime('%d/%m/%Y às %H:%M')
        return None

    def logs_count_today(self) -> int:
        return self.logs.filter(taken_at__date=timezone.localdate()).count()


class MedicationLog(models.Model):
    medication = models.ForeignKey(
        Medication,
        on_delete=models.CASCADE,
        related_name='logs',
        verbose_name='Remédio'
    )
    taken_at   = models.DateTimeField(default=timezone.now, verbose_name='Data/hora')
    taken      = models.BooleanField(default=True, verbose_name='Tomado')
    notes      = models.TextField(blank=True, verbose_name='Observações')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = 'Registro'
        verbose_name_plural = 'Registros'
        ordering            = ['-taken_at']

    def __str__(self):
        status = 'tomado' if self.taken else 'não tomado'
        return f'{self.medication.name} — {status} em {self.taken_at:%d/%m/%Y %H:%M}'
