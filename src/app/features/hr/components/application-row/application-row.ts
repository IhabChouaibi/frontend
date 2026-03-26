import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ApplicationService } from '../../../../core/services/recruitment/application';
import { Application } from '../../../../models/recruitment/application';

@Component({
  selector: 'app-application-row',
  standalone: false,
  templateUrl: './application-row.html',
  styleUrl: './application-row.scss',
})
export class ApplicationRow {
  @Input() application!: Application;
  @Output() refresh = new EventEmitter<void>();
  @Output() schedule = new EventEmitter<number>();

  loadingApprove = false;
  loadingReject = false;

  constructor(private readonly applicationService: ApplicationService) {}

  approve(): void {
    if (!this.application.id) {
      return;
    }

    this.loadingApprove = true;
    this.applicationService.approve(this.application.id).subscribe({
      next: () => {
        this.loadingApprove = false;
        this.refresh.emit();
      },
      error: () => {
        this.loadingApprove = false;
      }
    });
  }

  reject(): void {
    if (!this.application.id) {
      return;
    }

    this.loadingReject = true;
    this.applicationService.reject(this.application.id).subscribe({
      next: () => {
        this.loadingReject = false;
        this.refresh.emit();
      },
      error: () => {
        this.loadingReject = false;
      }
    });
  }
}
