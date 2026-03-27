import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CandidateService } from '../../../core/services/recruitment/candidate';
import { getControlErrorMessage } from '../../../shared/utils/form-error.utils';
import { fileExtensionValidator, fileMaxSizeValidator } from '../../../shared/utils/file-validators';

@Component({
  selector: 'app-apply',
  standalone: false,
  templateUrl: './apply.html',
  styleUrl: './apply.scss',
})
export class Apply {
  private readonly fb = inject(FormBuilder);
  private readonly candidateService = inject(CandidateService);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s()-]{8,20}$/)]],
    cv: [null as File | null, [Validators.required, fileExtensionValidator(['pdf', 'doc', 'docx']), fileMaxSizeValidator(5 * 1024 * 1024)]]
  });

  loading = false;
  successMessage = '';
  errorMessage = '';
  selectedFile: File | null = null;
  jobId = 0;

  ngOnInit(): void {
    this.jobId = Number(this.route.snapshot.paramMap.get('id') ?? 0);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedFile = file;
    this.form.patchValue({ cv: file });
    this.form.get('cv')?.markAsTouched();
    this.form.get('cv')?.updateValueAndValidity();
  }

  submit(): void {
    if (this.form.invalid || !this.selectedFile || !this.jobId) {
      this.form.markAllAsTouched();
      this.errorMessage = !this.jobId ? 'Job offer id is missing from the route.' : '';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('firstName', this.form.getRawValue().firstName ?? '');
    formData.append('lastName', this.form.getRawValue().lastName ?? '');
    formData.append('email', this.form.getRawValue().email ?? '');
    formData.append('phone', this.form.getRawValue().phone ?? '');
    formData.append('cv', this.selectedFile);

    this.candidateService.apply(this.jobId, formData).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Application submitted successfully.';
        this.form.reset();
        this.selectedFile = null;
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
