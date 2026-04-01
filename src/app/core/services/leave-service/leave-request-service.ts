import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateLeaveRequestDto } from '../../../models/leave-service/create-leave-request.dto';
import { LeaveRequestResponseDto } from '../../../models/leave-service/leave-request-response.dto';
import { UpdateLeaveRequestDto } from '../../../models/leave-service/update-leave-request.dto';
import { PagedResponse } from '../../../models/shared/paged-response';
import { LeaveService } from './leave.service';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestService {
  constructor(private readonly leaveService: LeaveService) {}

  submitLeaveRequest(leave: CreateLeaveRequestDto): Observable<LeaveRequestResponseDto> {
    return this.leaveService.requestLeave(leave);
  }

  updateLeaveRequest(id: number, leaveUpdate: UpdateLeaveRequestDto): Observable<LeaveRequestResponseDto> {
    return this.leaveService.update(id, leaveUpdate);
  }

  cancelLeaveRequest(id: number, employeeId: number): Observable<void> {
    return this.leaveService.cancelLeave(id, employeeId);
  }

  getPendingLeaveRequests(page: number = 0, size: number = 10): Observable<PagedResponse<LeaveRequestResponseDto>> {
    return this.leaveService.getPending(page, size);
  }
}
