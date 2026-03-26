import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { DepartmentService } from '../../../../core/services/organisation-service/department-service';
import { JobService } from '../../../../core/services/organisation-service/job-service';
import { OrganizationService } from '../../../../core/services/organisation-service/organization.service';
import { Department } from '../../../../models/organisation-service/department';
import { Job } from '../../../../models/organisation-service/job';

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

  jobs: Job[] = [];
  departments: Department[] = [];
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
      return;
    }

    this.jobService.addJob({
      title: this.form.getRawValue().title || '',
      level: this.form.getRawValue().level || ''
    }, Number(this.form.getRawValue().departmentId)).subscribe({
      next: () => {
        this.showModal = false;
        this.load();
      },
      error: (error: Error) => this.error = error.message
    });
  }

  delete(job: Job): void {
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
