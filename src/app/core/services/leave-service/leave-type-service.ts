import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LeaveTypeDto } from '../../../models/leave-service/leave-type.dto';
import { PagedResponse } from '../../../models/shared/paged-response';
import { LeaveService } from './leave.service';

@Injectable({
  providedIn: 'root',
})
export class LeaveTypeService {
  constructor(private readonly leaveService: LeaveService) {}

  create(leaveType: LeaveTypeDto): Observable<LeaveTypeDto> {
    return this.leaveService.createLeaveType(leaveType);
  }

  update(id: number, leaveType: LeaveTypeDto): Observable<LeaveTypeDto> {
    return this.leaveService.updateLeaveType(id, leaveType);
  }

  findById(id: number): Observable<LeaveTypeDto> {
    return this.leaveService.getLeaveTypeById(id);
  }

  findByPage(page: number = 0, size: number = 10): Observable<PagedResponse<LeaveTypeDto>> {
    return this.leaveService.getLeaveTypes(page, size);
  }

  deleteById(id: number): Observable<void> {
    return this.leaveService.deleteLeaveType(id);
  }
}
