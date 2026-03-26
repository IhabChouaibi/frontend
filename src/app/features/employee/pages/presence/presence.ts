import { Component } from '@angular/core';

import { AuthService } from '../../../../core/services/auth-service';
import { PresenceService } from '../../../../core/services/presence-service/presence.service';
import { Presence } from '../../../../models/presence-service/presence';

@Component({
  selector: 'app-presence',
  standalone: false,
  templateUrl: './presence.html',
  styleUrl: './presence.scss',
})
export class PresenceComponent {
  loading = false;
  message = '';
  error = '';
  presences: Presence[] = [];
  page = 0;
  totalPages = 0;

  constructor(
    private readonly authService: AuthService,
    private readonly presenceService: PresenceService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  checkIn(): void {
    const employeeId = this.authService.getCurrentUserId();

    if (!employeeId) {
      this.error = 'Employee id is missing.';
      return;
    }

    this.loading = true;
    this.message = '';
    this.error = '';

    this.presenceService.checkIn({ employeeId }).subscribe({
      next: () => {
        this.message = 'Check-in successful.';
        this.loading = false;
        this.loadHistory();
      },
      error: (error: Error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  checkOut(): void {
    const employeeId = this.authService.getCurrentUserId();

    if (!employeeId) {
      this.error = 'Employee id is missing.';
      return;
    }

    this.loading = true;
    this.message = '';
    this.error = '';

    this.presenceService.checkOut({ employeeId }).subscribe({
      next: () => {
        this.message = 'Check-out successful.';
        this.loading = false;
        this.loadHistory();
      },
      error: (error: Error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  changePage(step: number): void {
    const nextPage = this.page + step;

    if (nextPage < 0 || nextPage >= this.totalPages) {
      return;
    }

    this.page = nextPage;
    this.loadHistory();
  }

  private loadHistory(): void {
    const employeeId = this.authService.getCurrentUserId();

    if (!employeeId) {
      this.error = 'Employee id is missing.';
      return;
    }

    this.presenceService.getEmployeeHistoryPaged(employeeId, this.page, 10).subscribe({
      next: (res) => {
        this.presences = res.content;
        this.totalPages = res.totalPages;
      },
      error: (error: Error) => {
        this.error = error.message;
      }
    });
  }
}
