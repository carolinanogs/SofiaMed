export interface MedicationLog {
  id: number;
  medication: number;
  taken_at: string;
  taken: boolean;
  notes: string;
  created_at: string;
}
