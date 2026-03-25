export interface UpdateLeaveRequest {
      startDate: string;   // ISO string
  endDate: string;     // ISO string
  leaveTypeId: number;
  reason?: string;
}
