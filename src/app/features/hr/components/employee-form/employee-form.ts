import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Department } from '../../../../models/organisation-service/department';
import { Job } from '../../../../models/organisation-service/job';

@Component({
  selector: 'app-employee-form',
  standalone: false,
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss',
})
export class EmployeeFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() departments: Department[] = [];
  @Input() jobs: Job[] = [];
  @Input() loading = false;
  @Output() submitted = new EventEmitter<void>();
}
