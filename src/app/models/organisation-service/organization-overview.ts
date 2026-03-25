import { Department } from './department';
import { Job } from './job';

export interface OrganizationOverview {
  departments: Department[];
  jobs: Job[];
}
