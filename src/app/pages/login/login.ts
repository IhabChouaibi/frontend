import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login  {
 
  loading = false;
  errorMessage: string | null = null;
private fb = inject(FormBuilder);
private authService = inject(AuthService);
private router = inject(Router);

loginForm = this.fb.group({
  username: ['', Validators.required],
  password: ['', Validators.required]
});

  submit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value as any).subscribe({

       next: (res) => {
    console.log("SUCCESS", res);
    this.router.navigate(['/dashboard']);
  },
  error: (err) => {
    console.log("ERROR", err);
  },

      complete: () => {
        this.loading = false;
      }

    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
 

}
