import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Medication, MedicationPayload } from '../../../core/models/medication';

@Component({
  selector: 'app-medication-form',
  templateUrl: './medication-form.component.html',
  styleUrls: ['./medication-form.component.scss']
})
export class MedicationFormComponent implements OnInit, OnChanges {
  @Input() medication: Medication | null = null;
  @Input() isOpen = false;
  @Output() saved = new EventEmitter<MedicationPayload>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;
  saving = false;

  colors = ['#E91E8C','#c084fc','#7c3aed','#4ade80','#f59e0b','#3b82f6','#ef4444','#14b8a6'];
  icons  = ['💊','💉','🌿','❤️','⭐','🔵','🟣','⚪','🫀','🧬'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(): void {
    if (this.form) this.patchForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      name:          ['', [Validators.required, Validators.maxLength(200)]],
      dosage:        [''],
      frequency:     ['daily', Validators.required],
      reminder_time: [''],
      description:   [''],
      color:         [this.colors[0]],
      icon:          [this.icons[0]],
    });
    this.patchForm();
  }

  patchForm(): void {
    if (!this.form) return;
    if (this.medication) {
      this.form.patchValue({
        name:          this.medication.name,
        dosage:        this.medication.dosage,
        frequency:     this.medication.frequency,
        reminder_time: this.medication.reminder_time?.slice(0, 5) ?? '',
        description:   this.medication.description,
        color:         this.medication.color,
        icon:          this.medication.icon,
      });
    } else {
      this.form.reset({ frequency: 'daily', color: this.colors[0], icon: this.icons[0] });
    }
  }

  selectColor(c: string): void { this.form.patchValue({ color: c }); }
  selectIcon(ic: string): void  { this.form.patchValue({ icon: ic }); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const val = this.form.value;
    const payload: MedicationPayload = {
      name:          val.name.trim(),
      dosage:        val.dosage?.trim() || '',
      frequency:     val.frequency,
      reminder_time: val.reminder_time || null,
      description:   val.description?.trim() || '',
      color:         val.color,
      icon:          val.icon,
      active:        true,
    };
    this.saved.emit(payload);
    this.saving = false;
  }

  cancel(): void { this.cancelled.emit(); }

  hexAlpha(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  get title(): string { return this.medication ? 'Editar Remédio' : 'Novo Remédio'; }
  get currentColor(): string { return this.form?.value?.color || this.colors[0]; }
  get currentIcon(): string  { return this.form?.value?.icon  || this.icons[0]; }
}
