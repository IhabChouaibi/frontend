import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { JobOfferService } from '../../../../core/services/recruitment/job-offer';
import { JobOffer } from '../../../../models/recruitment/job-offer';

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

  private readonly fb = inject(FormBuilder);
  private readonly jobService = inject(JobOfferService);

  readonly form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    location: [''],
    employmentType: [''],
    experienceLevel: ['']
  });

  ngOnInit(): void {
    if (this.job) {
      this.form.patchValue(this.job);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const request = this.job?.id
      ? this.jobService.update(this.job.id, this.form.getRawValue() as JobOffer)
      : this.jobService.create(this.form.getRawValue() as JobOffer);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.saved.emit();
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
