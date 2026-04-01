export interface PresenceResponseDto {
  id?: number;
  employeeId: number;
  date?: string;
  checkIn?: string;
  checkOut?: string;
  workedMinutes?: number;
  lateMinutes?: number;
  status?: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'REMOTE';
  validated?: boolean;
}
