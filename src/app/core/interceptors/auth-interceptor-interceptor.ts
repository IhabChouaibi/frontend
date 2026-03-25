import { inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";
import { AuthService } from "../services/auth-service";


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Skip authentication for login URLs or OPTIONS requests
  if (
    req.method === 'OPTIONS' ||
    req.url.includes('/auth/login') ||
    req.url.includes('/auth-service/auth/login')
  ) {
    console.log('[AuthInterceptor] Skipping auth for:', req.method, req.url);
    return next(req);
  }

  console.log('[AuthInterceptor] Processing request:', req.method, req.url);

  if (token) {
    console.log('[AuthInterceptor] Adding Authorization header');
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  } else {
    console.warn('[AuthInterceptor] No token available, proceeding without auth');
    return next(req);
  }
};
