import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');

  // Never attach an empty/invalid token.
  if (!token || token.trim().length === 0) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token.trim()}`
    }
  });

  return next(authReq);
};