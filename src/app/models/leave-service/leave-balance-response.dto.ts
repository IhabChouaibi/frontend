export interface LeaveBalanceResponseDto {
  id?: number;
  employeeId: number;
  leaveTypeId: number;
  remainingDays?: number;
  usedDays?: number;
}
