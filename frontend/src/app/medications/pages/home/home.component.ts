import { Component, OnInit } from '@angular/core';
import { MedicationService } from '../../../core/services/medication.service';
import { ToastService } from '../../../core/services/toast.service';
import { Medication, MedicationPayload } from '../../../core/models/medication';
import { DailySummary } from '../../../core/models/summary';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  medications: Medication[] = [];
  summary: DailySummary | null = null;
  loading = true;
  showForm = false;
  editingMedication: Medication | null = null;

  constructor(
    private medicationService: MedicationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void { this.loadData(); }

  loadData(): void {
    this.loading = true;
    forkJoin({
      medications: this.medicationService.getMedications(),
      summary: this.medicationService.getTodaySummary()
    }).subscribe({
      next: ({ medications, summary }) => {
        this.medications = medications;
        this.summary = summary;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.show('⚠️ Erro ao carregar dados', 'error');
      }
    });
  }

  onToggle(id: number): void {
    this.medicationService.toggleTaken(id).subscribe({
      next: ({ medication, taken, message }) => {
        const idx = this.medications.findIndex(m => m.id === id);
        if (idx !== -1) this.medications[idx] = medication;
        this.medicationService.getTodaySummary().subscribe(s => this.summary = s);
        this.toastService.show(message, taken ? 'success' : 'info');
      },
      error: () => this.toastService.show('Erro ao registrar', 'error')
    });
  }

  openForm(): void { this.editingMedication = null; this.showForm = true; }

  onSaved(payload: MedicationPayload): void {
    const req = this.editingMedication
      ? this.medicationService.updateMedication(this.editingMedication.id, payload)
      : this.medicationService.createMedication(payload);

    req.subscribe({
      next: () => {
        this.showForm = false;
        this.toastService.show('✅ Salvo com sucesso!', 'success');
        this.loadData();
      },
      error: () => this.toastService.show('Erro ao salvar', 'error')
    });
  }

  onCancelled(): void { this.showForm = false; }

  get greeting(): string {
    const h = new Date().getHours();
    return h < 12 ? 'Bom dia, Sofia! ☀️' : h < 18 ? 'Boa tarde, Sofia! 🌸' : 'Boa noite, Sofia! 🌙';
  }

  get progressPercent(): number {
    if (!this.summary || !this.summary.total) return 0;
    return Math.round((this.summary.taken / this.summary.total) * 100);
  }
}
