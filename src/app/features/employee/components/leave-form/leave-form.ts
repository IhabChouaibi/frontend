import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { LeaveType } from '../../../../models/leave-service/leave-type';
import { getControlErrorMessage } from '../../../../shared/utils/form-error.utils';

@Component({
  selector: 'app-leave-form',
  standalone: false,
  templateUrl: './leave-form.html',
  styleUrl: './leave-form.scss',
})
export class LeaveForm {
  @Input({ required: true }) form!: FormGroup;
  @Input() leaveTypes: LeaveType[] = [];
  @Input() loading = false;
  @Output() submitted = new EventEmitter<void>();

  getError(controlName: string, label: string): string {
    return getControlErrorMessage(this.form.get(controlName), label);
  }

  get dateRangeError(): string {
    return this.form.errors?.['dateRange'] && (this.form.touched || this.form.dirty)
      ? 'End date must be after start date.'
      : '';
  }
}
