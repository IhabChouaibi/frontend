import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateLeaveRequest } from '../../../models/leave-service/create-leave-request';
import { Leave } from '../../../models/leave-service/leave';
import { UpdateLeaveRequest } from '../../../models/leave-service/update-leave-request';
import { Page } from '../../../models/recruitment/page';
import { LeaveService } from './leave.service';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestService {
  constructor(private readonly leaveService: LeaveService) {}

  submitLeaveRequest(leave: CreateLeaveRequest): Observable<Leave> {
    return this.leaveService.requestLeave(leave);
  }

  updateLeaveRequest(id: number, leaveUpdate: UpdateLeaveRequest): Observable<Leave> {
    return this.leaveService.update(id, leaveUpdate);
  }

  cancelLeaveRequest(id: number, employeeId: number): Observable<void> {
    return this.leaveService.cancelLeave(id, employeeId);
  }

  getPendingLeaveRequests(page: number = 0, size: number = 10): Observable<Page<Leave>> {
    return this.leaveService.getPending(page, size);
  }
}
