import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getToken();

  // Skip endpoints publics
  if (req.url.includes('/login') || req.url.includes('/refresh')) {
    return next(req);
  }

  // Ajouter Authorization header
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(

    catchError(error => {

      // Si token expiré
      if (error.status === 401 && authService.isAuthenticated()) {

        return authService.refreshToken().pipe(

          switchMap(res => {

            const newToken = res.accessToken;

            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });

            return next(newReq);
          }),

          catchError(err => {
            authService.logout();
            return throwError(() => err);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
