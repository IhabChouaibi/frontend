import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { LeaveService } from '../../../../core/services/leave-service/leave.service';
import { LeaveValidationService } from '../../../../core/services/leave-service/leave-validation-service';
import { Leave } from '../../../../models/leave-service/leave';

@Component({
  selector: 'app-leave-validation',
  standalone: false,
  templateUrl: './leave-validation.html',
  styleUrl: './leave-validation.scss',
})
export class LeaveValidation implements OnInit, OnDestroy {
  readonly searchControl = new FormControl('', { nonNullable: true });

  requests: Leave[] = [];
  loading = false;
  error = '';
  page = 0;
  totalPages = 0;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly leaveService: LeaveService,
    private readonly validationService: LeaveValidationService
  ) {}

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
      ? this.leaveService.searchPending(keyword, this.page, 10)
      : this.leaveService.getPending(this.page, 10);

    request$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.requests = res.content;
          this.totalPages = res.totalPages;
          this.loading = false;
        },
        error: (error: Error) => {
          this.error = error.message;
          this.loading = false;
        },
      });
  }

  approve(id: number, event?: Event): void {
    event?.stopPropagation();

    this.validationService.approveLeaveRequest(id, 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.load());
  }

  reject(id: number, event?: Event): void {
    event?.stopPropagation();

    this.validationService.rejectLeaveRequest(id, 1, { reason: 'Rejected by HR' })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.load());
  }

  changePage(page: number): void {
    this.page = page;
    this.load();
  }
}
