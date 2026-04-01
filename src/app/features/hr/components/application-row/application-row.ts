import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ApplicationService } from '../../../../core/services/recruitment/application';
import { ApplicationResponseDto } from '../../../../models/recruitment/application-response.dto';

@Component({
  selector: 'app-application-row',
  standalone: false,
  templateUrl: './application-row.html',
  styleUrl: './application-row.scss',
})
export class ApplicationRow {
  @Input() application!: ApplicationResponseDto;
  @Output() refresh = new EventEmitter<void>();
  @Output() schedule = new EventEmitter<number>();

  loadingApprove = false;
  loadingReject = false;
  errorMessage = '';

  constructor(private readonly applicationService: ApplicationService) {}

  approve(): void {
    if (!this.application.id) {
      return;
    }

    this.loadingApprove = true;
    this.errorMessage = '';
    this.applicationService.approve(this.application.id).subscribe({
      next: () => {
        this.loadingApprove = false;
        this.refresh.emit();
      },
      error: (error: Error) => {
        this.loadingApprove = false;
        this.errorMessage = error.message;
      }
    });
  }

  reject(): void {
    if (!this.application.id) {
      return;
    }

    this.loadingReject = true;
    this.errorMessage = '';
    this.applicationService.reject(this.application.id).subscribe({
      next: () => {
        this.loadingReject = false;
        this.refresh.emit();
      },
      error: (error: Error) => {
        this.loadingReject = false;
        this.errorMessage = error.message;
      }
    });
  }
}
