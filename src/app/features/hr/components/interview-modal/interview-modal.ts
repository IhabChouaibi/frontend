import {Component, Input, Output, EventEmitter, inject} from '@angular/core';
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

  private fb = inject(FormBuilder);                    // ← inject()
  private interviewService = inject(InterviewService); // ← inject()

  form = this.fb.group({
    date: ['', Validators.required],
    location: ['', Validators.required]
  });



  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    const interview = {
      applicationId: this.applicationId,
      ...this.form.value
    };

    this.interviewService.schedule(interview as any).subscribe({
      next: () => {
        this.loading = false;
        this.scheduled.emit();
        this.close.emit();
      },
      error: () => this.loading = false
    });
  }

}
