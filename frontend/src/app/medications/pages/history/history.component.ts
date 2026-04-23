import { Component, OnInit } from '@angular/core';
import { MedicationService } from '../../../core/services/medication.service';
import { ToastService } from '../../../core/services/toast.service';
import { MedicationLog } from '../../../core/models/medication-log';

interface GroupedLog {
  date: string;
  logs: MedicationLog[];
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  groupedLogs: GroupedLog[] = [];
  loading = true;

  constructor(
    private medicationService: MedicationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void { this.loadHistory(); }

  loadHistory(): void {
    this.loading = true;
    this.medicationService.getLogs().subscribe({
      next: logs => {
        this.groupedLogs = this.groupByDate(logs);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.show('Erro ao carregar histórico', 'error');
      }
    });
  }

  private groupByDate(logs: MedicationLog[]): GroupedLog[] {
    const map = new Map<string, MedicationLog[]>();
    for (const log of logs) {
      const dateKey = new Date(log.taken_at).toLocaleDateString('pt-BR', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
      });
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(log);
    }
    return Array.from(map.entries()).map(([date, logs]) => ({ date, logs }));
  }

  formatTime(dt: string): string {
    return new Date(dt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}
