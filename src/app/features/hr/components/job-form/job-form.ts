import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { JobOfferService } from '../../../../core/services/recruitment/job-offer';
import { JobOffer } from '../../../../models/recruitment/job-offer';
import { getControlErrorMessage } from '../../../../shared/utils/form-error.utils';

@Component({
  selector: 'app-job-form',
  standalone: false,
  templateUrl: './job-form.html',
  styleUrl: './job-form.scss',
})
export class JobForm {
  @Input() job?: JobOffer;
  @Output() saved = new EventEmitter<void>();

  loading = false;
  errorMessage = '';

  private readonly fb = inject(FormBuilder);
  private readonly jobService = inject(JobOfferService);

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    location: [''],
    employmentType: ['', Validators.required],
    experienceLevel: ['', Validators.required]
  });

  ngOnInit(): void {
    if (this.job) {
      this.form.patchValue(this.job);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const request = this.job?.id
      ? this.jobService.update(this.job.id, this.form.getRawValue() as JobOffer)
      : this.jobService.create(this.form.getRawValue() as JobOffer);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.saved.emit();
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
