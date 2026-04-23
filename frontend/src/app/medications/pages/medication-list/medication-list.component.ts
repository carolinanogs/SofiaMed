import { Component, OnInit } from '@angular/core';
import { MedicationService } from '../../../core/services/medication.service';
import { ToastService } from '../../../core/services/toast.service';
import { Medication, MedicationPayload } from '../../../core/models/medication';

@Component({
  selector: 'app-medication-list',
  templateUrl: './medication-list.component.html',
  styleUrls: ['./medication-list.component.scss']
})
export class MedicationListComponent implements OnInit {
  medications: Medication[] = [];
  loading = true;
  showForm = false;
  editingMedication: Medication | null = null;

  constructor(
    private medicationService: MedicationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void { this.loadMedications(); }

  loadMedications(): void {
    this.loading = true;
    this.medicationService.getMedications(true).subscribe({
      next: meds => { this.medications = meds; this.loading = false; },
      error: () => { this.loading = false; this.toastService.show('Erro ao carregar', 'error'); }
    });
  }

  openAdd(): void { this.editingMedication = null; this.showForm = true; }

  onEdit(med: Medication): void { this.editingMedication = med; this.showForm = true; }

  onDelete(id: number): void {
    const med = this.medications.find(m => m.id === id);
    if (!confirm(`Remover "${med?.name}"?`)) return;
    this.medicationService.deleteMedication(id).subscribe({
      next: () => {
        this.medications = this.medications.filter(m => m.id !== id);
        this.toastService.show('🗑️ Remédio removido', 'info');
      },
      error: () => this.toastService.show('Erro ao remover', 'error')
    });
  }

  onSaved(payload: MedicationPayload): void {
    const req = this.editingMedication
      ? this.medicationService.updateMedication(this.editingMedication.id, payload)
      : this.medicationService.createMedication(payload);

    req.subscribe({
      next: () => {
        this.showForm = false;
        this.toastService.show('✅ Salvo!', 'success');
        this.loadMedications();
      },
      error: () => this.toastService.show('Erro ao salvar', 'error')
    });
  }

  onCancelled(): void { this.showForm = false; }
}
