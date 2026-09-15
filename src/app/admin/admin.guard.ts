import {
  inject
} from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  AuthService
} from '../auth/auth.service';

import {
  DataCacheService
} from '../core/data-cache.service';

import {
  LoaderService
} from '../core/loader.service';


export const adminGuard: CanActivateFn = () => {

  const router =
    inject(Router);

  const authService =
    inject(AuthService);

  const dataCache =
    inject(DataCacheService);

  const loader =
    inject(LoaderService);


  /*
   * First verify that the remembered login is still valid.
   */
  if (!authService.isAuthenticated()) {

    authService.clearAuthentication();

    dataCache.clear();

    loader.reset();

    return router.createUrlTree([
      '/login'
    ]);
  }


  /*
   * Existing server-side role requirement:
   * only ADMIN can enter Angular admin routes.
   */
  const role =
    localStorage.getItem('role');


  if (role === 'ADMIN') {

    return true;
  }


  /*
   * Authenticated normal users cannot access admin routes.
   */
  return router.createUrlTree([
    '/dashboard'
  ]);
};
