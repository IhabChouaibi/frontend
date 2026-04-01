import { DepartmentResponseDto } from './department-response.dto';
import { JobResponseDto } from './job-response.dto';

export interface OrganizationOverview {
  departments: DepartmentResponseDto[];
  jobs: JobResponseDto[];
}
