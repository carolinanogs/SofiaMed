export interface Medication {
  id: number;
  name: string;
  description: string;
  dosage: string;
  frequency: 'daily' | 'weekly' | 'when_needed';
  reminder_time: string | null;
  color: string;
  icon: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  taken_today: boolean;
  last_taken: string | null;
  logs_count_today: number;
}

export interface MedicationPayload {
  name: string;
  description?: string;
  dosage?: string;
  frequency: 'daily' | 'weekly' | 'when_needed';
  reminder_time?: string | null;
  color?: string;
  icon?: string;
  active?: boolean;
}
