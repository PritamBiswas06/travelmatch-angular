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


export const authGuard: CanActivateFn = (_route, state) => {

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

    /*
     * Keep first-login users inside onboarding until they finish it.
     * This is a client-side navigation guard; the backend still requires
     * Terms acceptance before the onboarding completion endpoint succeeds.
     */
    if (authService.isOnboardingRequired() && state.url !== '/onboarding') {
      return router.createUrlTree(['/onboarding']);
    }

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
