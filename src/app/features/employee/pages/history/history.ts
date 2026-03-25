import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { LeaveService } from '../../../../core/services/leave-service/leave.service';
import { Leave } from '../../../../models/leave-service/leave';

@Component({
  selector: 'app-history',
  standalone: false,
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History implements OnInit, OnDestroy {
  readonly searchControl = new FormControl('', { nonNullable: true });

  leaves: Leave[] = [];
  page = 0;
  totalPages = 0;
  loading = false;
  error = '';

  private readonly employeeId = 1;
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly leaveService: LeaveService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.page = 0;
        this.load();
      });

    this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    const keyword = this.searchControl.getRawValue().trim();
    const request$ = keyword
      ? this.leaveService.searchEmployeeHistory(this.employeeId, keyword, this.page, 10)
      : this.leaveService.getByEmployee(this.employeeId, { page: this.page, size: 10 });

    request$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.leaves = res.content;
          this.totalPages = res.totalPages;
          this.loading = false;
        },
        error: (error: Error) => {
          this.error = error.message;
          this.loading = false;
        },
      });
  }

  changePage(page: number): void {
    this.page = page;
    this.load();
  }
}
