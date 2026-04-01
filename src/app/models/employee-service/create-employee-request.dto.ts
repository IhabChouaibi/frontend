export interface CreateEmployeeRequestDto {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  hireDate?: string;
  status?: string;
  departmentId: number;
  jobId: number;
}
