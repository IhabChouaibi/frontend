import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { DepartmentService } from '../../../../core/services/organisation-service/department-service';
import { JobService } from '../../../../core/services/organisation-service/job-service';
import { OrganizationService } from '../../../../core/services/organisation-service/organization.service';
import { DepartmentResponseDto } from '../../../../models/organisation-service/department-response.dto';
import { JobRequestDto } from '../../../../models/organisation-service/job-request.dto';
import { JobResponseDto } from '../../../../models/organisation-service/job-response.dto';
import { toOptionalNumber, toOptionalTrimmedString, toRequiredTrimmedString } from '../../../../shared/utils/payload.utils';

@Component({
  selector: 'app-jobs',
  standalone: false,
  templateUrl: './jobs.html',
  styleUrl: './jobs.scss',
})
export class Jobs {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    title: ['', Validators.required],
    level: [''],
    departmentId: ['', Validators.required]
  });

  jobs: JobResponseDto[] = [];
  departments: DepartmentResponseDto[] = [];
  showModal = false;
  error = '';

  constructor(
    private readonly jobService: JobService,
    private readonly departmentService: DepartmentService,
    private readonly organizationService: OrganizationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  openCreate(): void {
    this.form.reset();
    this.showModal = true;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const departmentId = toOptionalNumber(this.form.getRawValue().departmentId);

    if (departmentId === undefined) {
      this.error = 'Department is required.';
      return;
    }

    const payload: JobRequestDto = {
      title: toRequiredTrimmedString(this.form.getRawValue().title),
      level: toOptionalTrimmedString(this.form.getRawValue().level),
    };

    this.jobService.addJob(payload, departmentId).subscribe({
      next: () => {
        this.showModal = false;
        this.load();
      },
      error: (error: Error) => this.error = error.message
    });
  }

  delete(job: JobResponseDto): void {
    if (!job.id) {
      return;
    }

    this.jobService.deleteJob(job.id).subscribe({
      next: () => this.load(),
      error: (error: Error) => this.error = error.message
    });
  }

  private load(): void {
    this.organizationService.getAllJobs({ page: 0, size: 100 }).subscribe({
      next: (res) => this.jobs = res.content
    });

    this.departmentService.getAllDepartmentsPaged(0, 100).subscribe({
      next: (res) => this.departments = res.content
    });
  }
}
