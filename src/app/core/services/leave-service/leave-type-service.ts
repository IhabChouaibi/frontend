import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LeaveType } from '../../../models/leave-service/leave-type';
import { Page } from '../../../models/recruitment/page';
import { LeaveService } from './leave.service';

@Injectable({
  providedIn: 'root',
})
export class LeaveTypeService {
  constructor(private readonly leaveService: LeaveService) {}

  create(leaveType: LeaveType): Observable<LeaveType> {
    return this.leaveService.createLeaveType(leaveType);
  }

  update(id: number, leaveType: LeaveType): Observable<LeaveType> {
    return this.leaveService.updateLeaveType(id, leaveType);
  }

  findById(id: number): Observable<LeaveType> {
    return this.leaveService.getLeaveTypeById(id);
  }

  findByPage(page: number = 0, size: number = 10): Observable<Page<LeaveType>> {
    return this.leaveService.getLeaveTypes(page, size);
  }

  deleteById(id: number): Observable<void> {
    return this.leaveService.deleteLeaveType(id);
  }
}
