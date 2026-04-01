export interface EmployeeResponseDto {
  id: number;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  hireDate?: string;
  status?: string;
  jobTitle?: string;
  departmentCode?: string;
}
