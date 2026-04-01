export interface UpdateEmployeeRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  hireDate?: string;
  status?: string;
  departmentId?: number;
  jobId?: number;
}
