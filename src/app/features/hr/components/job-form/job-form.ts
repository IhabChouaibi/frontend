import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JobOffer } from '../../../../models/recruitment/job-offer';
import { JobOfferService } from '../../../../core/services/recruitment/job-offer';

@Component({
  selector: 'app-job-form',
  standalone: false,
  templateUrl: './job-form.html',
  styleUrl: './job-form.scss',
})
export class JobForm implements OnInit {
  @Input() job?: JobOffer;
  @Output() saved = new EventEmitter<void>();

  loading = false;

  private fb = inject(FormBuilder);
  private jobService = inject(JobOfferService);

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required]
  });

  ngOnInit(): void {
    if (this.job) {
      this.form.patchValue(this.job);
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;

    const request = this.job
      ? this.jobService.update(this.job.id!, this.form.value as JobOffer)
      : this.jobService.create(this.form.value as JobOffer);

    request.subscribe({
      next: () => { this.loading = false; this.saved.emit(); },
      error: () => this.loading = false
    });
  }
}
