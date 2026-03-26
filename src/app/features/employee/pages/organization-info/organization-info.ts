import { Component } from '@angular/core';

import { OrganizationService } from '../../../../core/services/organisation-service/organization.service';
import { Department } from '../../../../models/organisation-service/department';
import { Job } from '../../../../models/organisation-service/job';

@Component({
  selector: 'app-organization-info',
  standalone: false,
  templateUrl: './organization-info.html',
  styleUrl: './organization-info.scss',
})
export class OrganizationInfoComponent {
  departments: Department[] = [];
  jobs: Job[] = [];
  loading = false;
  error = '';

  constructor(private readonly organizationService: OrganizationService) {}

  ngOnInit(): void {
    this.loading = true;

    this.organizationService.getOrganizationOverview().subscribe({
      next: (overview) => {
        this.departments = overview.departments;
        this.jobs = overview.jobs;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }
}
