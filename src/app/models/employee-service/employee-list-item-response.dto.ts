export interface EmployeeListItemResponseDto {
  id: number;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string;
  departmentCode?: string;
}
