import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoaderService } from '../../core/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage = '';

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]

    });

  }

  onSubmit(){

    if(this.loginForm.invalid){
      return;
    }

    this.errorMessage = '';

    this.loader.show("Signing you in...");

    this.authService.login(this.loginForm.value).subscribe({

      next: (res:any)=>{

        localStorage.setItem('token',res.token);
        localStorage.setItem('userId',res.userId);
        localStorage.setItem('name',res.name);

        this.loader.hide();

        this.router.navigate(['/dashboard']);

      },

      error:(err)=>{

        this.loader.hide();

        this.errorMessage = err.error?.message || "Login failed";

      }

    });

  }

}