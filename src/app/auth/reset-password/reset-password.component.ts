import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../core/loader.service';
import { ToastService } from '../../shared/toast/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  form!: FormGroup;

  email = localStorage.getItem("resetEmail");

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private loader: LoaderService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]

    });

  }

  reset(){

    if(this.form.invalid) return;

    this.loader.show("Updating password...");

    this.auth.resetPassword(
      this.email!,
      this.form.value.password
    ).subscribe({

      next: () => {

        this.loader.hide();

        this.toast.success("Password updated");

        localStorage.removeItem("resetEmail");

        this.router.navigate(['/login']);

      },

      error: (err) => {

        this.loader.hide();

        this.toast.error(err.error?.message || "Failed");

      }

    });

  }

}