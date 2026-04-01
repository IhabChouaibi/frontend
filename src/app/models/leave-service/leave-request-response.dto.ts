export interface LeaveRequestResponseDto {
  id?: number;
  employeeId: number;
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  totalDays?: number;
  status?: string;
  reason?: string;
}
