export interface UpdateLeaveRequestDto {
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  reason?: string;
}
