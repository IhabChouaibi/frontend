import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { EmployeeService } from '../../../../core/services/employee-service/employee.service';
import { EmployeeListItem } from '../../../../models/employee-service/employee-list-item';

@Component({
  selector: 'app-employees',
  standalone: false,
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class Employees implements OnInit, OnDestroy {
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly tableColumns = ['ID', 'First Name', 'Last Name', 'Email', 'Department', 'Job', 'Actions'];

  employees: EmployeeListItem[] = [];
  loading = false;
  error = '';

  page = 0;
  readonly size = 10;
  totalPages = 0;
  totalElements = 0;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.page = 0;
        this.loadEmployees();
      });

    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = '';

    const keyword = this.searchControl.getRawValue().trim();
    const request$ = keyword
      ? this.employeeService.search(keyword, this.page, this.size)
      : this.employeeService.getPaginated(this.page, this.size);

    request$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.employees = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (error: Error) => {
          this.error = error.message;
          this.loading = false;
        },
      });
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page -= 1;
      this.loadEmployees();
    }
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page += 1;
      this.loadEmployees();
    }
  }

  onEdit(employee: EmployeeListItem, event?: Event): void {
    event?.stopPropagation();
    console.log('Edit employee', employee);
  }

  onDelete(employee: EmployeeListItem, event?: Event): void {
    event?.stopPropagation();

    if (!employee.id) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.employeeService.delete(employee.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.employees.length === 1 && this.page > 0) {
            this.page -= 1;
          }

          this.loadEmployees();
        },
        error: (error: Error) => {
          this.error = error.message;
          this.loading = false;
        },
      });
  }
}
