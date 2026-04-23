import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Medication, MedicationPayload } from '../models/medication';
import { MedicationLog } from '../models/medication-log';
import { DailySummary } from '../models/summary';

export interface ToggleResponse {
  medication: Medication;
  taken: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class MedicationService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMedications(showAll = false): Observable<Medication[]> {
    const params = showAll ? new HttpParams().set('all', 'true') : new HttpParams();
    return this.http.get<Medication[]>(`${this.base}/medications/`, { params });
  }

  getMedication(id: number): Observable<Medication> {
    return this.http.get<Medication>(`${this.base}/medications/${id}/`);
  }

  createMedication(payload: MedicationPayload): Observable<Medication> {
    return this.http.post<Medication>(`${this.base}/medications/`, payload);
  }

  updateMedication(id: number, payload: Partial<MedicationPayload>): Observable<Medication> {
    return this.http.patch<Medication>(`${this.base}/medications/${id}/`, payload);
  }

  deleteMedication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/medications/${id}/`);
  }

  toggleTaken(id: number): Observable<ToggleResponse> {
    return this.http.post<ToggleResponse>(`${this.base}/medications/${id}/toggle_taken/`, {});
  }

  getTodaySummary(): Observable<DailySummary> {
    return this.http.get<DailySummary>(`${this.base}/medications/today_summary/`);
  }

  getMedicationHistory(id: number): Observable<MedicationLog[]> {
    return this.http.get<MedicationLog[]>(`${this.base}/medications/${id}/history/`);
  }

  getLogs(date?: string): Observable<MedicationLog[]> {
    const params = date ? new HttpParams().set('date', date) : new HttpParams();
    return this.http.get<MedicationLog[]>(`${this.base}/logs/`, { params });
  }
}
