import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subject, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { DepartmentService } from '../../../../core/services/organisation-service/department-service';
import { EmployeeService } from '../../../../core/services/employee-service/employee.service';
import { OrganizationService } from '../../../../core/services/organisation-service/organization.service';
import { CreateEmployeeRequestDto } from '../../../../models/employee-service/create-employee-request.dto';
import { EmployeeListItemResponseDto } from '../../../../models/employee-service/employee-list-item-response.dto';
import { EmployeeResponseDto } from '../../../../models/employee-service/employee-response.dto';
import { UpdateEmployeeRequestDto } from '../../../../models/employee-service/update-employee-request.dto';
import { DepartmentResponseDto } from '../../../../models/organisation-service/department-response.dto';
import { JobResponseDto } from '../../../../models/organisation-service/job-response.dto';
import {
  buildUsernameFromName,
  toOptionalLocalDate,
  toOptionalNumber,
  toOptionalTrimmedString,
  toRequiredTrimmedString,
} from '../../../../shared/utils/payload.utils';

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
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(8)]],
    phone: ['', Validators.pattern(/^[0-9+\s()-]{8,20}$/)],
    hireDate: ['', Validators.required],
    status: ['ACTIVE', Validators.required],
    departmentId: ['', Validators.required],
    jobId: ['', Validators.required]
  });

  employees: EmployeeListItemResponseDto[] = [];
  departments: DepartmentResponseDto[] = [];
  jobs: JobResponseDto[] = [];
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
      },
      error: (error: Error) => {
        this.error = error.message;
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
    this.form.reset({ status: 'ACTIVE', password: '' });
    this.showModal = true;
  }

  openEdit(item: EmployeeListItemResponseDto): void {
    if (!item.id) {
      return;
    }

    this.employeeService.getById(item.id).subscribe({
      next: (employee) => {
        this.selectedId = employee.id || null;
        this.form.patchValue({
          firstName: employee.firstName ?? '',
          lastName: employee.lastName ?? '',
          email: employee.email ?? '',
          password: '',
          phone: employee.phone ?? '',
          hireDate: employee.hireDate ?? '',
          status: employee.status ?? 'ACTIVE',
          departmentId: this.resolveDepartmentId(employee.departmentCode),
          jobId: this.resolveJobId(employee.jobTitle)
        });
        this.showModal = true;
      },
      error: (error: Error) => {
        this.error = error.message;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.getRawValue();
    const createPayload = this.buildCreatePayload(rawValue);
    const updatePayload = this.buildUpdatePayload(rawValue);

    if (!this.selectedId && !createPayload) {
      this.error = 'Password is required to create an employee.';
      return;
    }

    this.saving = true;
    this.error = '';

    const request$ = this.selectedId
      ? this.employeeService.update(this.selectedId, updatePayload)
      : this.employeeService.create(createPayload as CreateEmployeeRequestDto);

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

  delete(item: EmployeeListItemResponseDto): void {
    if (!item.id) {
      return;
    }

    this.employeeService.delete(item.id).subscribe({
      next: () => this.loadEmployees(),
      error: (error: Error) => {
        this.error = error.message;
      }
    });
  }

  get usernamePreview(): string {
    const rawValue = this.form.getRawValue();
    return buildUsernameFromName(
      toRequiredTrimmedString(rawValue.firstName),
      toRequiredTrimmedString(rawValue.lastName)
    );
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

  private buildCreatePayload(rawValue: ReturnType<typeof this.form.getRawValue>): CreateEmployeeRequestDto | null {
    const password = toOptionalTrimmedString(rawValue.password);
    const departmentId = toOptionalNumber(rawValue.departmentId);
    const jobId = toOptionalNumber(rawValue.jobId);

    if (!password || departmentId === undefined || jobId === undefined) {
      return null;
    }

    return {
      username: this.usernamePreview,
      password,
      email: toRequiredTrimmedString(rawValue.email),
      firstName: toRequiredTrimmedString(rawValue.firstName),
      lastName: toRequiredTrimmedString(rawValue.lastName),
      phone: toOptionalTrimmedString(rawValue.phone),
      hireDate: toOptionalLocalDate(rawValue.hireDate),
      status: toOptionalTrimmedString(rawValue.status),
      departmentId,
      jobId,
    };
  }

  private buildUpdatePayload(rawValue: ReturnType<typeof this.form.getRawValue>): UpdateEmployeeRequestDto {
    return {
      email: toRequiredTrimmedString(rawValue.email),
      firstName: toRequiredTrimmedString(rawValue.firstName),
      lastName: toRequiredTrimmedString(rawValue.lastName),
      phone: toOptionalTrimmedString(rawValue.phone),
      hireDate: toOptionalLocalDate(rawValue.hireDate),
      status: toOptionalTrimmedString(rawValue.status),
      departmentId: toOptionalNumber(rawValue.departmentId),
      jobId: toOptionalNumber(rawValue.jobId),
    };
  }

  private resolveDepartmentId(departmentCode?: string): string {
    if (!departmentCode) {
      return '';
    }

    const department = this.departments.find((item) => item.code === departmentCode);
    return department?.id ? String(department.id) : '';
  }

  private resolveJobId(jobTitle?: string): string {
    if (!jobTitle) {
      return '';
    }

    const job = this.jobs.find((item) => item.title === jobTitle);
    return job?.id ? String(job.id) : '';
  }
}
