export interface LeaveTypeDto {
  id?: number;
  name: string;
  paid?: string;
  requiresApproval?: string;
  requiresDocument?: string;
  maxDaysPerYear?: number;
  deductFromBalance?: boolean;
}
