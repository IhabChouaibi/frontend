import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LeaveRequestResponseDto } from '../../../models/leave-service/leave-request-response.dto';
import { RejectLeaveRequestDto } from '../../../models/leave-service/reject-leave-request.dto';
import { LeaveService } from './leave.service';

@Injectable({
  providedIn: 'root',
})
export class LeaveValidationService {
  constructor(private readonly leaveService: LeaveService) {}

  approveLeaveRequest(requestId: number, managerId: number): Observable<LeaveRequestResponseDto> {
    return this.leaveService.approveLeave(requestId, managerId);
  }

  rejectLeaveRequest(
    requestId: number,
    managerId: number,
    rejectReason: RejectLeaveRequestDto
  ): Observable<LeaveRequestResponseDto> {
    return this.leaveService.rejectLeave(requestId, managerId, rejectReason);
  }
}
