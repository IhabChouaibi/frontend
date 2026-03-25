import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from '../../core/services/auth-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login  {
   private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMessage: string | null = null;

  // Formulaire réactif
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  // Configuration pour FormInput
  fields = [
    { name: 'username', label: 'Username', type: 'text', validators: [Validators.required] },
    { name: 'password', label: 'Password', type: 'password', validators: [Validators.required] },
  ];

   get loginRequest() {
    return {
      username: this.loginForm.get('username')?.value || '',
      password: this.loginForm.get('password')?.value || ''
    };
  }

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.authService.login(this.loginRequest).subscribe({
      next: () => {
        const roles = this.authService.getRole();
        if (roles.includes('HR')) this.router.navigate(['/hr/dashboard']);
        else if (roles.includes('EMPLOYEE')) this.router.navigate(['/employee/dashboard']);
        else this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Login failed. Please check your credentials.';
      },
      complete: () => this.loading = false
    });
  }
}
