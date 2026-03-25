export interface LeaveBalance {
  id?: number;
  employeeId: number;
  leaveTypeId: number;
  remainingDays?: number;
  usedDays?: number;
}