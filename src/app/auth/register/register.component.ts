import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { LoaderService } from '../../core/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {

    this.registerForm = this.fb.group({

      name: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],

      city: ['', Validators.required],

      age: ['', [
        Validators.required,
        Validators.min(18)
      ]],

      gender: ['', Validators.required]

    });

  }

  onSubmit() {

    if (this.registerForm.invalid) {
      return;
    }

    this.loader.show("Creating your account...");

    this.authService.register(this.registerForm.value).subscribe({

      next: (res: any) => {

        this.loader.hide();

        localStorage.setItem("verifyEmail", this.registerForm.value.email);

        alert("Verification code sent to your email");

        this.router.navigate(['/verify-email']);

      },

      error: (err) => {

        this.loader.hide();

        alert(err?.error?.message || "Registration failed");

        console.error(err);

      }

    });

  }

}