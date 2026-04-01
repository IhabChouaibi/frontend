import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Path } from '../../enums/path';
import { LoginRequest } from '../../models/login-request';
import { LoginResponse } from '../../models/login-response';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}${Path.authPath}/auth`;

  private readonly tokenSub = new BehaviorSubject<string | null>(null);
  private readonly rolesSub = new BehaviorSubject<string[]>([]);
  private readonly usernameSub = new BehaviorSubject<string | null>(null);
  private readonly expirationSub = new BehaviorSubject<number | null>(null);
  private readonly employeeIdSub = new BehaviorSubject<number | null>(null);

  readonly token$ = this.tokenSub.asObservable();
  readonly roles$ = this.rolesSub.asObservable();
  readonly username$ = this.usernameSub.asObservable();
  readonly employeeId$ = this.employeeIdSub.asObservable();

  private logoutTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly http: HttpClient, private readonly router: Router) {
    this.restoreSession();
  }

  login(req: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, req).pipe(
      tap((response) => this.storeAuth(response)),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.tokenSub.value ?? localStorage.getItem('accessToken');
    const expiration = this.expirationSub.value ?? Number(localStorage.getItem('expiration'));

    return !!token && !!expiration && expiration > Date.now();
  }

  getRole(): string[] {
    return this.rolesSub.value;
  }

  getToken(): string | null {
    return this.isAuthenticated() ? localStorage.getItem('accessToken') : null;
  }

  getEmployeeId(): number | null {
    return this.employeeIdSub.value;
  }

  getUsername$(): Observable<string | null> {
    return this.username$;
  }

  getRole$(): Observable<string> {
    return this.roles$.pipe(map((roles) => roles[0] ?? ''));
  }

  getCurrentUserId(): number | null {
    return this.getEmployeeId();
  }

  getCurrentUser(): { username: string | null; roles: string[]; employeeId: number | null } | null {
    if (!this.isAuthenticated()) {
      return null;
    }

    return {
      username: this.usernameSub.value,
      roles: this.rolesSub.value,
      employeeId: this.employeeIdSub.value
    };
  }

  private storeAuth(response: LoginResponse): void {
    const expiration = Date.now() + Number(response.expiresIn ?? 0) * 1000;
    const roles = (response.roles ?? []).map((role) => role.toUpperCase());

    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken ?? '');
    localStorage.setItem('roles', JSON.stringify(roles));
    localStorage.setItem('username', response.username ?? '');
    localStorage.setItem('expiration', expiration.toString());

    const employeeId = this.toNumericId(response.employeeId);
    if (employeeId !== null) {
      localStorage.setItem('employeeId', employeeId.toString());
    } else {
      localStorage.removeItem('employeeId');
    }

    this.tokenSub.next(response.accessToken);
    this.rolesSub.next(roles);
    this.usernameSub.next(response.username ?? null);
    this.expirationSub.next(expiration);
    this.employeeIdSub.next(employeeId);

    this.startLogoutTimer(expiration);
  }

  private restoreSession(): void {
    const token = localStorage.getItem('accessToken');
    const roles = localStorage.getItem('roles');
    const username = localStorage.getItem('username');
    const expiration = Number(localStorage.getItem('expiration'));
    const employeeId = this.readStoredNumericId();

    if (!token || Number.isNaN(expiration) || expiration <= Date.now()) {
      this.clearSession();
      return;
    }

    this.tokenSub.next(token);
    this.rolesSub.next(roles ? JSON.parse(roles) : []);
    this.usernameSub.next(username);
    this.expirationSub.next(expiration);
    this.employeeIdSub.next(employeeId);

    this.startLogoutTimer(expiration);
  }

  private clearSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('roles');
    localStorage.removeItem('username');
    localStorage.removeItem('expiration');
    localStorage.removeItem('employeeId');

    this.tokenSub.next(null);
    this.rolesSub.next([]);
    this.usernameSub.next(null);
    this.expirationSub.next(null);
    this.employeeIdSub.next(null);

    this.stopLogoutTimer();
  }

  private startLogoutTimer(expiration: number): void {
    this.stopLogoutTimer();

    const timeout = expiration - Date.now() - 60000;

    if (timeout <= 0) {
      this.logout();
      return;
    }

    this.logoutTimer = setTimeout(() => this.logout(), timeout);
  }

  private stopLogoutTimer(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  private readStoredNumericId(): number | null {
    return this.toNumericId(localStorage.getItem('employeeId'));
  }

  private toNumericId(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && /^\d+$/.test(value.trim())) {
      return Number(value);
    }

    return null;
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Erreur inconnue';

    switch (error.status) {
      case 0:
        message = 'Le service d authentification est indisponible.';
        break;
      case 401:
        message = 'Login incorrect';
        break;
      case 403:
        message = 'Acces refuse';
        break;
      case 500:
        message = 'Erreur serveur';
        break;
    }

    return throwError(() => new Error(message));
  }
}
