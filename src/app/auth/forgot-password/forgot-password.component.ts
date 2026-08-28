import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoaderService } from '../../core/loader.service';
import { ToastService } from '../../shared/toast/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private loader: LoaderService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

  }

  sendCode(){

    if(this.form.invalid) return;

    const email = this.form.value.email;

    this.loader.show("Sending reset code...");

    this.auth.forgotPassword(email).subscribe({

      next: () => {

        this.loader.hide();

        localStorage.setItem("resetEmail", email);

        this.router.navigate(['/verify-reset']);

      },

      error: (err) => {

        this.loader.hide();

        this.toast.error(err.error?.message || "Failed");

      }

    });

  }

}