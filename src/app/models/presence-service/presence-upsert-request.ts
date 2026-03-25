import { Presence } from './presence';

export interface PresenceUpsertRequest {
  employeeId: number;
  date?: string;
  checkIn?: string;
  checkOut?: string;
  status?: Presence['status'];
  validated?: boolean;
}
