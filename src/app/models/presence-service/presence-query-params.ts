import { Presence } from './presence';

export interface PresenceQueryParams {
  page?: number;
  size?: number;
  employeeId?: number;
  status?: Presence['status'];
  validated?: boolean;
  startDate?: string;
  endDate?: string;
}
