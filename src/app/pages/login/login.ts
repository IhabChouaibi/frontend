import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../core/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  errorMessage: string | null = null;

  readonly loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.authService.login({
      username: this.loginForm.getRawValue().username ?? '',
      password: this.loginForm.getRawValue().password ?? ''
    }).subscribe({
      next: () => {
        const roles = this.authService.getRole();

        if (roles.includes('HR')) {
          this.router.navigate(['/hr/dashboard']);
          return;
        }

        if (roles.includes('EMPLOYEE')) {
          this.router.navigate(['/employee/dashboard']);
          return;
        }

        this.router.navigate(['/']);
      },
      error: (error: Error) => {
        this.errorMessage = error.message || 'Login failed. Please check your credentials.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
