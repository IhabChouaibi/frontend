import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth-service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles: string[] = route.data['roles'] ?? [];

    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!requiredRoles.length) {
      return true;
    }

    const userRoles = this.auth.getRole();
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
