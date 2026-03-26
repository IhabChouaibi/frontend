import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { AuthService } from '../../../../core/services/auth-service';
import { LeaveService } from '../../../../core/services/leave-service/leave.service';
import { LeaveValidationService } from '../../../../core/services/leave-service/leave-validation-service';
import { Leave } from '../../../../models/leave-service/leave';

@Component({
  selector: 'app-leave-validation',
  standalone: false,
  templateUrl: './leave-validation.html',
  styleUrl: './leave-validation.scss',
})
export class LeaveValidation {
  readonly searchControl = new FormControl('', { nonNullable: true });
  requests: Leave[] = [];
  loading = false;
  error = '';
  page = 0;
  totalPages = 0;

  constructor(
    private readonly authService: AuthService,
    private readonly leaveService: LeaveService,
    private readonly validationService: LeaveValidationService
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.subscribe(() => {
      this.page = 0;
      this.load();
    });

    this.load();
  }

  approve(id?: number): void {
    const managerId = this.authService.getCurrentUserId() ?? 1;

    if (!id) {
      return;
    }

    this.validationService.approveLeaveRequest(id, managerId).subscribe({
      next: () => this.load(),
      error: (error: Error) => this.error = error.message
    });
  }

  reject(id?: number): void {
    const managerId = this.authService.getCurrentUserId() ?? 1;

    if (!id) {
      return;
    }

    this.validationService.rejectLeaveRequest(id, managerId, { reason: 'Rejected by HR' }).subscribe({
      next: () => this.load(),
      error: (error: Error) => this.error = error.message
    });
  }

  changePage(step: number): void {
    const nextPage = this.page + step;

    if (nextPage < 0 || nextPage >= this.totalPages) {
      return;
    }

    this.page = nextPage;
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.error = '';

    const keyword = this.searchControl.getRawValue().trim();
    const request$ = keyword
      ? this.leaveService.searchPending(keyword, this.page, 10)
      : this.leaveService.getPending(this.page, 10);

    request$.subscribe({
      next: (res) => {
        this.requests = res.content;
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
