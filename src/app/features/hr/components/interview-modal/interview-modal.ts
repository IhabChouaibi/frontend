import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { InterviewService } from '../../../../core/services/recruitment/interview';

@Component({
  selector: 'app-interview-modal',
  standalone: false,
  templateUrl: './interview-modal.html',
  styleUrl: './interview-modal.scss',
})
export class InterviewModal {
  @Input() visible = false;
  @Input() applicationId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() scheduled = new EventEmitter<void>();

  loading = false;

  private readonly fb = inject(FormBuilder);
  private readonly interviewService = inject(InterviewService);

  readonly form = this.fb.group({
    date: ['', Validators.required],
    type: ['Video interview', Validators.required]
  });

  submit(): void {
    if (this.form.invalid || !this.applicationId) {
      return;
    }

    this.loading = true;

    this.interviewService.schedule({
      applicationId: this.applicationId,
      date: this.form.getRawValue().date || '',
      type: this.form.getRawValue().type || 'Video interview'
    }).subscribe({
      next: () => {
        this.loading = false;
        this.scheduled.emit();
        this.close.emit();
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
