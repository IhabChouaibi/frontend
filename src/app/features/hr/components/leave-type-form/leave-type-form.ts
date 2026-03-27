import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { getControlErrorMessage } from '../../../../shared/utils/form-error.utils';

@Component({
  selector: 'app-leave-type-form',
  standalone: false,
  templateUrl: './leave-type-form.html',
  styleUrl: './leave-type-form.scss',
})
export class LeaveTypeFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() loading = false;
  @Output() submitted = new EventEmitter<void>();

  getError(controlName: string, label: string): string {
    return getControlErrorMessage(this.form.get(controlName), label);
  }
}
