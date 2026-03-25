import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Leave } from '../../../models/leave-service/leave';
import { Page } from '../../../models/recruitment/page';
import { LeaveService } from './leave.service';

@Injectable({
  providedIn: 'root',
})
export class LeaveHistoryService {
  constructor(private readonly leaveService: LeaveService) {}

  getByEmployeePaged(employeeId: number, page: number = 0, size: number = 10): Observable<Page<Leave>> {
    return this.leaveService.getByEmployee(employeeId, { page, size });
  }

  getByTypePaged(employeeId: number, leaveTypeId: number, page: number = 0, size: number = 10): Observable<Page<Leave>> {
    return this.leaveService.getByEmployee(employeeId, {
      page,
      size,
      leaveTypeId,
    });
  }

  getTotalLeaveTaken(employeeId: number, leaveTypeId: number): Observable<number> {
    return this.leaveService.getTakenLeaveDays(employeeId, leaveTypeId);
  }
}
