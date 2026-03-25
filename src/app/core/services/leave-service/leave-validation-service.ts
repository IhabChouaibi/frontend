import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Leave } from '../../../models/leave-service/leave';
import { RejectLeaveRequest } from '../../../models/leave-service/reject-leave-request';
import { LeaveService } from './leave.service';

@Injectable({
  providedIn: 'root',
})
export class LeaveValidationService {
  constructor(private readonly leaveService: LeaveService) {}

  approveLeaveRequest(requestId: number, managerId: number): Observable<Leave> {
    return this.leaveService.approveLeave(requestId, managerId);
  }

  rejectLeaveRequest(requestId: number, managerId: number, rejectReason: RejectLeaveRequest): Observable<Leave> {
    return this.leaveService.rejectLeave(requestId, managerId, rejectReason);
  }
}
