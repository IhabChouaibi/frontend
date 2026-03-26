import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { LeaveType } from '../../../../models/leave-service/leave-type';

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
}
