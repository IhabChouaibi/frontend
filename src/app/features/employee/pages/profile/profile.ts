import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AuthService } from '../../../../core/services/auth-service';
import { EmployeeService } from '../../../../core/services/employee-service/employee.service';
import { Employee } from '../../../../models/employee-service/employee';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  employee: Employee | null = null;
  loading = false;
  error = '';
  username: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getCurrentUser()?.username ?? null;
    this.loadProfile();
  }

  get departmentName(): string {
    return this.employee?.departmentCode || 'Not assigned';
  }

  get jobTitle(): string {
    return this.employee?.jobTitle || 'Not assigned';
  }

  private loadProfile(): void {
    const employeeId = this.authService.getCurrentUserId();
    const employee$: Observable<Employee | null> = employeeId
      ? this.employeeService.getById(employeeId)
      : of(null);

    this.loading = true;
    this.error = '';

    employee$.subscribe({
      next: (employee: Employee | null) => {
        this.employee = employee;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }
}
