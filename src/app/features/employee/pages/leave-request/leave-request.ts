import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../../../core/services/auth-service';
import { LeaveRequestService } from '../../../../core/services/leave-service/leave-request-service';
import { LeaveTypeService } from '../../../../core/services/leave-service/leave-type-service';
import { CreateLeaveRequestDto } from '../../../../models/leave-service/create-leave-request.dto';
import { LeaveTypeDto } from '../../../../models/leave-service/leave-type.dto';
import { dateRangeValidator } from '../../../../shared/utils/form-validators';
import {
  toOptionalLocalDate,
  toOptionalNumber,
  toOptionalTrimmedString,
} from '../../../../shared/utils/payload.utils';

@Component({
  selector: 'app-leave-request',
  standalone: false,
  templateUrl: './leave-request.html',
  styleUrl: './leave-request.scss',
})
export class LeaveRequest {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    leaveTypeId: ['', Validators.required],
    reason: ['', [Validators.required, Validators.minLength(5)]]
  }, {
    validators: dateRangeValidator('startDate', 'endDate')
  });

  leaveTypes: LeaveTypeDto[] = [];
  loading = false;
  success = '';
  error = '';

  constructor(
    private readonly authService: AuthService,
    private readonly leaveService: LeaveRequestService,
    private readonly leaveTypeService: LeaveTypeService
  ) {}

  ngOnInit(): void {
    this.leaveTypeService.findByPage(0, 50).subscribe({
      next: (res) => {
        this.leaveTypes = res.content;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.leaveTypes = [];
      }
    });
  }

  submit(): void {
    const employeeId = this.authService.getEmployeeId();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!employeeId) {
      this.error = 'Unable to submit leave request. Employee id is missing.';
      return;
    }

    this.loading = true;
    this.success = '';
    this.error = '';

    const leaveTypeId = toOptionalNumber(this.form.getRawValue().leaveTypeId);

    if (leaveTypeId === undefined) {
      this.error = 'Leave type is required.';
      this.loading = false;
      return;
    }

    const payload: CreateLeaveRequestDto = {
      employeeId,
      startDate: toOptionalLocalDate(this.form.getRawValue().startDate) ?? '',
      endDate: toOptionalLocalDate(this.form.getRawValue().endDate) ?? '',
      reason: toOptionalTrimmedString(this.form.getRawValue().reason),
      leaveTypeId,
    };

    this.leaveService.submitLeaveRequest(payload).subscribe({
      next: () => {
        this.success = 'Leave request submitted successfully.';
        this.form.reset();
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }
}
