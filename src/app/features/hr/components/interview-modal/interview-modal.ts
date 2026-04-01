import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { InterviewService } from '../../../../core/services/recruitment/interview';
import { AuthService } from '../../../../core/services/auth-service';
import { InterviewRequestDto } from '../../../../models/recruitment/interview-request.dto';
import { futureDateValidator } from '../../../../shared/utils/form-validators';
import { getControlErrorMessage } from '../../../../shared/utils/form-error.utils';
import {
  toOptionalLocalDateTime,
  toOptionalNumber,
  toRequiredTrimmedString,
} from '../../../../shared/utils/payload.utils';

@Component({
  selector: 'app-interview-modal',
  standalone: false,
  templateUrl: './interview-modal.html',
  styleUrl: './interview-modal.scss',
})
export class InterviewModal {
  @Input() visible = false;
  @Input() applicationId: number | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() scheduled = new EventEmitter<void>();

  loading = false;
  errorMessage = '';

  private readonly fb = inject(FormBuilder);
  private readonly interviewService = inject(InterviewService);
  private readonly authService = inject(AuthService);

  readonly form = this.fb.group({
    applicationId: ['', Validators.required],
    interviewerId: ['', Validators.required],
    interviewDate: ['', [Validators.required, futureDateValidator()]],
    type: ['Video interview', [Validators.required, Validators.minLength(3)]]
  });

  ngOnChanges(): void {
    const interviewerId = this.authService.getEmployeeId();

    this.form.patchValue({
      applicationId: this.applicationId ? String(this.applicationId) : '',
      interviewerId: interviewerId ? String(interviewerId) : this.form.getRawValue().interviewerId
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const applicationId = toOptionalNumber(this.form.getRawValue().applicationId);
    const interviewerId = toOptionalNumber(this.form.getRawValue().interviewerId);
    const interviewDate = toOptionalLocalDateTime(this.form.getRawValue().interviewDate);

    if (applicationId === undefined || interviewerId === undefined || !interviewDate) {
      this.loading = false;
      this.errorMessage = 'Application, interviewer and interview date are required.';
      return;
    }

    const payload: InterviewRequestDto = {
      applicationId,
      interviewerId,
      interviewDate,
      type: toRequiredTrimmedString(this.form.getRawValue().type || 'Video interview'),
    };

    this.interviewService.schedule(payload).subscribe({
      next: () => {
        this.loading = false;
        this.form.reset({
          applicationId: this.applicationId ? String(this.applicationId) : '',
          interviewerId: '',
          interviewDate: '',
          type: 'Video interview'
        });
        this.scheduled.emit();
        this.close.emit();
      },
      error: (error: Error) => {
        this.loading = false;
        this.errorMessage = error.message;
      }
    });
  }

  getError(controlName: string, label: string): string {
    return getControlErrorMessage(this.form.get(controlName), label);
  }
}
