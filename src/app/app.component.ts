import { Component, OnDestroy, OnInit } from '@angular/core';

import { Router, RouterOutlet } from '@angular/router';

import { NgIf } from '@angular/common';

import { Subscription } from 'rxjs';

import { LoaderService } from './core/loader.service';

import { LoaderComponent } from './shared/loader/loader.component';

import { ModalComponent } from './shared/modal/modal.component';

import { ToastComponent } from './shared/toast/toast.component';

import { AuthService } from './auth/auth.service';

import { DataCacheService } from './core/data-cache.service';

@Component({
  selector: 'app-root',

  imports: [
    RouterOutlet,
    LoaderComponent,
    ModalComponent,
    ToastComponent,
    NgIf,
  ],

  templateUrl: './app.component.html',

  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'travelmatch';

  loading = false;

  private readonly loaderSubscription: Subscription;

  constructor(
    private loaderService: LoaderService,
    private authService: AuthService,
    private dataCache: DataCacheService,
    private router: Router,
  ) {
    this.loaderSubscription = this.loaderService.loading$.subscribe((value) => {
      this.loading = value;
    });
  }

  ngOnInit(): void {
    /*
     * Facebook-style remembered login:
     *
     * When the user opens the website root:
     *
     * https://tripmatch.fun
     *
     * automatically continue to Dashboard if the
     * previous login is still within the 10-day window.
     */
    this.handleInitialAuthentication();
  }

  private handleInitialAuthentication(): void {
    /*
     * Only perform the automatic redirect for the
     * website root.
     *
     * This prevents us from interfering with pages such as:
     *
     * /login
     * /register
     * /about
     * /forgot-password
     * etc.
     */
    const currentUrl = this.router.url;

    if (currentUrl !== '/' && currentUrl !== '') {
      return;
    }

    /*
     * Valid remembered session:
     *
     * Automatically open Dashboard.
     */
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);

      return;
    }

    /*
     * There may be an old expired token.
     *
     * Remove it so the application starts with
     * a clean unauthenticated state.
     */
    if (localStorage.getItem('token')) {
      this.authService.clearAuthentication();

      /*
       * Authentication-specific cached data must never
       * survive an expired session.
       */
      this.dataCache.clear();

      /*
       * Reset any stale loader state.
       */
      this.loaderService.reset();
    }
  }

  ngOnDestroy(): void {
    this.loaderSubscription.unsubscribe();
  }
}
