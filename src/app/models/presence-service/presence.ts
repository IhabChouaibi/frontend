export interface Presence {
      id?: number;
  employeeId: number;
  date?: string;              // ISO date
  checkIn?: string;           // ISO datetime
  checkOut?: string;          // ISO datetime
  workedMinutes?: number;
  lateMinutes?: number;
  status?: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'REMOTE';
  validated?: boolean;
}
