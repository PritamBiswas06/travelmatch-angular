import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';

import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../auth.service';

import { LoaderService } from '../../core/loader.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  errorMessage = '';

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loader: LoaderService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage = '';

    this.loader.show('Signing you in...');

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);

        // Store JWT
        localStorage.setItem('token', response.token);

        // Store user ID
        localStorage.setItem('userId', response.userId.toString());

        // Store name
        localStorage.setItem('name', response.name);

        // Store role
        localStorage.setItem('role', response.role);

        // VERY IMPORTANT
        // Hide "Signing you in..." loader
        // this.loader.hide();

        // // Navigate to dashboard
        // this.router.navigate(['/dashboard']);

        setTimeout(() => {
          this.loader.hide();
          this.router.navigate(['/dashboard']);
        }, 500);
      },

      error: (err) => {
        console.error('Login failed:', err);

        // VERY IMPORTANT
        // Hide loader even when login fails
        this.loader.hide();

        this.errorMessage =
          err?.error?.message ||
          err?.error ||
          'Login failed. Please check your email and password.';
      },
    });
  }
}
