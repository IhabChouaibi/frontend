export interface Leave {
      id?: number;
  employeeId: number;
  leaveTypeId: number;
  startDate: string;  // ISO string
  endDate: string;    // ISO string
  totalDays?: number;
  status?: string;    // PENDING, APPROVED, REJECTED
  reason?: string;
}
