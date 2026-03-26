import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subject, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { DepartmentService } from '../../../../core/services/organisation-service/department-service';
import { EmployeeService } from '../../../../core/services/employee-service/employee.service';
import { OrganizationService } from '../../../../core/services/organisation-service/organization.service';
import { Employee } from '../../../../models/employee-service/employee';
import { EmployeeListItem } from '../../../../models/employee-service/employee-list-item';
import { Department } from '../../../../models/organisation-service/department';
import { Job } from '../../../../models/organisation-service/job';

@Component({
  selector: 'app-employees',
  standalone: false,
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class Employees implements OnDestroy {
  private readonly fb = inject(FormBuilder);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    hireDate: [''],
    status: ['ACTIVE'],
    departmentId: [''],
    jobId: ['']
  });

  employees: EmployeeListItem[] = [];
  departments: Department[] = [];
  jobs: Job[] = [];
  loading = false;
  saving = false;
  error = '';
  totalElements = 0;
  page = 0;
  totalPages = 0;
  selectedId: number | null = null;
  showModal = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly departmentService: DepartmentService,
    private readonly organizationService: OrganizationService
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.page = 0;
        this.loadEmployees();
      });

    forkJoin({
      departments: this.departmentService.getAllDepartmentsPaged(0, 100),
      jobs: this.organizationService.getAllJobs({ page: 0, size: 100 })
    }).subscribe({
      next: ({ departments, jobs }) => {
        this.departments = departments.content;
        this.jobs = jobs.content;
      }
    });

    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openCreate(): void {
    this.selectedId = null;
    this.form.reset({ status: 'ACTIVE' });
    this.showModal = true;
  }

  openEdit(item: EmployeeListItem): void {
    if (!item.id) {
      return;
    }

    this.employeeService.getById(item.id).subscribe({
      next: (employee) => {
        this.selectedId = employee.id || null;
        this.form.patchValue({
          ...employee,
          departmentId: employee.departmentId ? String(employee.departmentId) : '',
          jobId: employee.jobId ? String(employee.jobId) : ''
        });
        this.showModal = true;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const payload: Employee = {
      ...this.form.getRawValue(),
      departmentId: this.form.getRawValue().departmentId ? Number(this.form.getRawValue().departmentId) : undefined,
      jobId: this.form.getRawValue().jobId ? Number(this.form.getRawValue().jobId) : undefined
    } as Employee;

    this.saving = true;

    const request$ = this.selectedId
      ? this.employeeService.update(this.selectedId, payload)
      : this.employeeService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.loadEmployees();
      },
      error: (error: Error) => {
        this.error = error.message;
        this.saving = false;
      }
    });
  }

  delete(item: EmployeeListItem): void {
    if (!item.id) {
      return;
    }

    this.employeeService.delete(item.id).subscribe({
      next: () => this.loadEmployees(),
      error: (error: Error) => this.error = error.message
    });
  }

  changePage(step: number): void {
    const nextPage = this.page + step;

    if (nextPage < 0 || nextPage >= this.totalPages) {
      return;
    }

    this.page = nextPage;
    this.loadEmployees();
  }

  private loadEmployees(): void {
    this.loading = true;
    this.error = '';

    const keyword = this.searchControl.getRawValue().trim();
    const request$ = keyword
      ? this.employeeService.search(keyword, this.page, 10)
      : this.employeeService.getPaginated(this.page, 10);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.employees = res.content;
        this.totalElements = res.totalElements;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }
}
