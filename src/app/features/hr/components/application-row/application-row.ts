import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApplicationService } from '../../../../core/services/recruitment/application';

@Component({
  selector: 'app-application-row',
  standalone: false,
  templateUrl: './application-row.html',
  styleUrl: './application-row.scss',
})
export class ApplicationRow {
   @Input() application: any;
  @Output() refresh = new EventEmitter<void>();

  loadingApprove = false;
  loadingReject = false;

  constructor(private applicationService: ApplicationService) {}

  approve() {
    this.loadingApprove = true;
    this.applicationService.approve(this.application.id).subscribe(() => {
      this.loadingApprove = false;
      this.refresh.emit();
    });
  }

  reject() {
    this.loadingReject = true;
    this.applicationService.reject(this.application.id).subscribe(() => {
      this.loadingReject = false;
      this.refresh.emit();
    });
  }

}
