import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Medication } from '../../../core/models/medication';

@Component({
  selector: 'app-medication-card',
  templateUrl: './medication-card.component.html',
  styleUrls: ['./medication-card.component.scss']
})
export class MedicationCardComponent {
  @Input() medication!: Medication;
  @Input() showActions = false;
  @Output() toggled = new EventEmitter<number>();
  @Output() editClicked = new EventEmitter<Medication>();
  @Output() deleteClicked = new EventEmitter<number>();

  readonly freqLabels: Record<string, string> = {
    daily: 'Diário',
    weekly: 'Semanal',
    when_needed: 'Quando necessário',
  };

  hexAlpha(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  onToggle(event: Event): void {
    event.stopPropagation();
    this.toggled.emit(this.medication.id);
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.editClicked.emit(this.medication);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.deleteClicked.emit(this.medication.id);
  }
}
