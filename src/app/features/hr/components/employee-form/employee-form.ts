import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DepartmentResponseDto } from '../../../../models/organisation-service/department-response.dto';
import { JobResponseDto } from '../../../../models/organisation-service/job-response.dto';
import { getControlErrorMessage } from '../../../../shared/utils/form-error.utils';

@Component({
  selector: 'app-employee-form',
  standalone: false,
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss',
})
export class EmployeeFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() departments: DepartmentResponseDto[] = [];
  @Input() jobs: JobResponseDto[] = [];
  @Input() isCreateMode = false;
  @Input() usernamePreview = '';
  @Input() loading = false;
  @Output() submitted = new EventEmitter<void>();

  getError(controlName: string, label: string): string {
    return getControlErrorMessage(this.form.get(controlName), label);
  }
}
