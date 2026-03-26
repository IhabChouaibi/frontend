import { Component } from '@angular/core';
import { forkJoin, of } from 'rxjs';

import { AuthService } from '../../../../core/services/auth-service';
import { EmployeeService } from '../../../../core/services/employee-service/employee.service';
import { OrganizationService } from '../../../../core/services/organisation-service/organization.service';
import { Employee } from '../../../../models/employee-service/employee';
import { OrganizationOverview } from '../../../../models/organisation-service/organization-overview';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  employee: Employee | null = null;
  organization: OrganizationOverview | null = null;
  loading = false;
  error = '';
  username: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly employeeService: EmployeeService,
    private readonly organizationService: OrganizationService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getCurrentUser().username;
    this.loadProfile();
  }

  get departmentName(): string {
    if (!this.employee?.departmentId || !this.organization) {
      return 'Not assigned';
    }

    return this.organization.departments.find((item) => item.id === this.employee?.departmentId)?.name || 'Not assigned';
  }

  get jobTitle(): string {
    if (!this.employee?.jobId || !this.organization) {
      return 'Not assigned';
    }

    return this.organization.jobs.find((item) => item.id === this.employee?.jobId)?.title || 'Not assigned';
  }

  private loadProfile(): void {
    const employeeId = this.authService.getCurrentUserId();

    this.loading = true;
    this.error = '';

    forkJoin({
      employee: employeeId ? this.employeeService.getById(employeeId) : of(null),
      organization: this.organizationService.getOrganizationOverview()
    }).subscribe({
      next: ({ employee, organization }) => {
        this.employee = employee;
        this.organization = organization;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }
}
