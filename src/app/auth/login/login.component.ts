import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';

import {
  Router,
  RouterModule
} from '@angular/router';

import {
  CommonModule
} from '@angular/common';

import {
  finalize
} from 'rxjs';

import {
  AuthService
} from '../auth.service';

import {
  LoaderService
} from '../../core/loader.service';

import {
  DataCacheService
} from '../../core/data-cache.service';


@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],

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
    private dataCache: DataCacheService,
  ) {}


  ngOnInit(): void {

    /*
     * If the user is already logged in and their
     * 10-day session is still valid, don't show the
     * login page again.
     *
     * Example:
     *
     * User types:
     * tripmatch.fun/login
     *
     * while already authenticated.
     *
     * They are sent directly to the dashboard.
     */
    if (this.authService.isAuthenticated()) {

      this.router.navigate([
        '/dashboard'
      ]);

      return;
    }


    /*
     * If an old/expired authentication exists,
     * remove it before displaying the login form.
     */
    if (localStorage.getItem('token')) {

      this.authService.clearAuthentication();

      this.dataCache.clear();
      this.loader.reset();
    }


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
      ],

    });
  }


  onSubmit(): void {

    if (this.loginForm.invalid) {
      return;
    }


    this.errorMessage = '';


    /*
     * Login starts a completely new authenticated session.
     */
    this.dataCache.clear();

    this.loader.reset();


    const loadingToken =
      this.loader.show('Signing you in...');


    this.authService
      .login(this.loginForm.value)
      .pipe(

        /*
         * Always clean up the manual loader:
         *
         * - success
         * - error
         * - cancellation
         */
        finalize(() => {

          this.loader.hide(
            loadingToken
          );

        })

      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Login successful:',
            response
          );


          /*
           * Store authentication information.
           */
          localStorage.setItem(
            'token',
            response.token
          );


          localStorage.setItem(
            'userId',
            response.userId.toString()
          );


          localStorage.setItem(
            'name',
            response.name
          );


          localStorage.setItem(
            'role',
            response.role
          );


          /*
           * IMPORTANT:
           *
           * Start the 10-day remembered-login
           * period AFTER successful login.
           */
          this.authService
            .startRememberedSession();


          /*
           * Go directly to the authenticated application.
           */
          this.router.navigate([
            '/dashboard'
          ]);
        },


        error: (err) => {

          console.error(
            'Login failed:',
            err
          );


          /*
           * Make absolutely sure a failed login
           * cannot leave authentication state behind.
           */
          this.authService
            .clearAuthentication();


          this.errorMessage =
            err?.error?.message ||
            err?.error ||
            'Login failed. Please check your email and password.';
        },

      });
  }
}
