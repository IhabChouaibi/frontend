import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { getControlErrorMessage } from '../../../shared/utils/form-error.utils';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  successMessage = '';

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.successMessage = 'Message pret a etre connecte au service de contact.';
    this.form.reset();
  }

  getError(controlName: string, label: string): string {
    return getControlErrorMessage(this.form.get(controlName), label);
  }
}
