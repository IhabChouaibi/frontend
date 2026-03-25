export interface LeaveType {
      id?: number;
  name: string;
  paid?: string;                  // ex: "YES" ou "NO"
  requiresApproval?: string;      // ex: "YES" ou "NO"
  requiresDocument?: string;      // ex: "YES" ou "NO"
  maxDaysPerYear?: number;
  deductFromBalance?: boolean;
}
