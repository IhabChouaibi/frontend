import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { JobOfferService } from '../../../../core/services/recruitment/job-offer';
import { JobOfferRequestDto } from '../../../../models/recruitment/job-offer-request.dto';
import { JobOfferResponseDto } from '../../../../models/recruitment/job-offer-response.dto';
import { getControlErrorMessage } from '../../../../shared/utils/form-error.utils';
import {
  toOptionalNumber,
  toOptionalTrimmedString,
  toRequiredTrimmedString,
} from '../../../../shared/utils/payload.utils';

@Component({
  selector: 'app-job-form',
  standalone: false,
  templateUrl: './job-form.html',
  styleUrl: './job-form.scss',
})
export class JobForm {
  @Input() job?: JobOfferResponseDto;
  @Output() saved = new EventEmitter<void>();

  loading = false;
  errorMessage = '';

  private readonly fb = inject(FormBuilder);
  private readonly jobService = inject(JobOfferService);

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    requiredSkills: [''],
    location: [''],
    employmentType: ['', Validators.required],
    experienceLevel: ['', Validators.required],
    salaryMin: [''],
    salaryMax: [''],
    organisationId: ['']
  });

  ngOnInit(): void {
    if (this.job) {
      this.form.patchValue({
        title: this.job.title,
        description: this.job.description,
        requiredSkills: this.job.requiredSkills ?? '',
        location: this.job.location ?? '',
        employmentType: this.job.employmentType ?? '',
        experienceLevel: this.job.experienceLevel ?? '',
        salaryMin: this.job.salaryMin !== undefined ? String(this.job.salaryMin) : '',
        salaryMax: this.job.salaryMax !== undefined ? String(this.job.salaryMax) : '',
        organisationId: '',
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload: JobOfferRequestDto = {
      title: toRequiredTrimmedString(this.form.getRawValue().title),
      description: toRequiredTrimmedString(this.form.getRawValue().description),
      requiredSkills: toOptionalTrimmedString(this.form.getRawValue().requiredSkills),
      location: toOptionalTrimmedString(this.form.getRawValue().location),
      employmentType: toOptionalTrimmedString(this.form.getRawValue().employmentType),
      experienceLevel: toOptionalTrimmedString(this.form.getRawValue().experienceLevel),
      salaryMin: toOptionalNumber(this.form.getRawValue().salaryMin),
      salaryMax: toOptionalNumber(this.form.getRawValue().salaryMax),
      organisationId: toOptionalNumber(this.form.getRawValue().organisationId),
    };

    const request = this.job?.id
      ? this.jobService.update(this.job.id, payload)
      : this.jobService.create(payload);

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
