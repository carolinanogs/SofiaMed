from django.core.management.base import BaseCommand
from medications.models import Medication


INITIAL_MEDICATIONS = [
    {
        'name':          'Anticoncepcional',
        'description':   'Pílula anticoncepcional diária',
        'dosage':        '1 comprimido',
        'frequency':     'daily',
        'reminder_time': '08:00:00',
        'color':         '#E91E8C',
        'icon':          '💊',
    },
]


class Command(BaseCommand):
    help = 'Popula o banco com dados iniciais para a Sofia'

    def handle(self, *args, **kwargs):
        for data in INITIAL_MEDICATIONS:
            obj, created = Medication.objects.get_or_create(
                name=data['name'],
                defaults=data,
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✅ Criado: {obj.name}'))
            else:
                self.stdout.write(f'   Já existe: {obj.name}')

        self.stdout.write(self.style.SUCCESS('\nSeed concluído!'))
