import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  inject
} from '@angular/core';

import {
  AuthService
} from '../auth/auth.service';

import {
  DataCacheService
} from './data-cache.service';

import {
  LoaderService
} from './loader.service';


export const authGuard: CanActivateFn = () => {

  const router =
    inject(Router);

  const authService =
    inject(AuthService);

  const dataCache =
    inject(DataCacheService);

  const loader =
    inject(LoaderService);


  /*
   * Check both:
   *
   * - JWT token
   * - 10-day remembered-login expiration
   */
  if (authService.isAuthenticated()) {

    return true;
  }


  /*
   * Authentication is missing or expired.
   *
   * Remove all session-specific information.
   */
  authService.clearAuthentication();


  /*
   * Never allow authenticated API data from the previous
   * session to remain available after expiration.
   */
  dataCache.clear();


  /*
   * Reset any loader state left by the previous session.
   */
  loader.reset();


  /*
   * Redirect to login.
   */
  return router.createUrlTree([
    '/login'
  ]);
};
