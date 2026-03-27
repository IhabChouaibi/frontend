import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth-service';

function getFriendlyMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'The server is unreachable or the request was blocked by CORS.';
  }

  switch (error.status) {
    case 401:
      return 'Your session is no longer valid. Please sign in again.';
    case 403:
      return 'You do not have the required permissions for this action.';
    case 404:
      return 'The requested API endpoint was not found.';
    default:
      return error.error?.message || error.message || 'An unexpected error occurred.';
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const friendlyMessage = getFriendlyMessage(error);

      console.error('[HttpError]', {
        method: req.method,
        url: req.url,
        status: error.status,
        message: friendlyMessage,
        error
      });

      if (error.status === 401 && !req.url.includes('/auth-service/auth/')) {
        authService.logout();
      }

      return throwError(() => error);
    })
  );
};
