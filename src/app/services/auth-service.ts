import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { tap, catchError, filter, take, switchMap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { environment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl +"auth-service/";

  // ===== STATE =====
  private tokenSub = new BehaviorSubject<string | null>(null);
  private refreshTokenSub = new BehaviorSubject<string | null>(null);
  private rolesSub = new BehaviorSubject<string[]>([]);
  private usernameSub = new BehaviorSubject<string | null>(null);
  private expirationSub = new BehaviorSubject<number | null>(null);

  token$ = this.tokenSub.asObservable();
  roles$ = this.rolesSub.asObservable();
  username$ = this.usernameSub.asObservable();

  private refreshInProgress = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.restoreSession();
  }

  // ================= LOGIN =================

  login(req: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}auth/login`, req).pipe(
      tap(res => this.storeAuth(res)),
      catchError(this.handleError)
    );
  }

  // ================= STORE AUTH =================

  private storeAuth(res: LoginResponse): void {

    const expiration = Date.now() + res.expiresIn * 1000;

    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('roles', JSON.stringify(res.roles));
    localStorage.setItem('username', res.username);
    localStorage.setItem('expiration', expiration.toString());

    this.tokenSub.next(res.accessToken);
    this.refreshTokenSub.next(res.refreshToken);
    this.rolesSub.next(res.roles ?? []);
    this.usernameSub.next(res.username);
    this.expirationSub.next(expiration);

    this.startRefreshTimer(expiration);
  }

  // ================= RESTORE SESSION =================

  private restoreSession(): void {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const roles = localStorage.getItem('roles');
    const username = localStorage.getItem('username');
    const expiration = localStorage.getItem('expiration');

    if (!token || !refreshToken || !expiration) return;

    this.tokenSub.next(token);
    this.refreshTokenSub.next(refreshToken);
    this.rolesSub.next(roles ? JSON.parse(roles) : []);
    this.usernameSub.next(username);
    this.expirationSub.next(Number(expiration));

    this.startRefreshTimer(Number(expiration));
  }

  // ================= REFRESH TOKEN =================

  refreshToken(): Observable<LoginResponse> {

    const refreshToken = this.refreshTokenSub.value;

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    if (this.refreshInProgress) {
      return this.refreshSubject.pipe(
        filter(Boolean),
        take(1),
        switchMap(token =>
          of({
            accessToken: token!,
            refreshToken: this.refreshTokenSub.value!,
            expiresIn: 0,
            username: this.usernameSub.value!,
            roles: this.rolesSub.value
          })
        )
      );
    }

    this.refreshInProgress = true;
    this.refreshSubject.next(null);

    return this.http.post<LoginResponse>(`${this.baseUrl}auth/refresh`, { refreshToken }).pipe(
      tap(res => {
        this.refreshInProgress = false;
        this.storeAuth(res);
        this.refreshSubject.next(res.accessToken);
      }),
      catchError(err => {
        this.refreshInProgress = false;
        this.logout();
        return throwError(() => err);
      })
    );
  }

  // ================= LOGOUT =================

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private clearSession(): void {
    localStorage.clear();

    this.tokenSub.next(null);
    this.refreshTokenSub.next(null);
    this.rolesSub.next([]);
    this.usernameSub.next(null);
    this.expirationSub.next(null);

    this.stopRefreshTimer();
  }

  // ================= TIMER =================

  private startRefreshTimer(expiration: number): void {

    this.stopRefreshTimer();

    const timeout = expiration - Date.now() - 60000;

    if (timeout <= 0) return;

    this.refreshTimer = setTimeout(() => {
      this.refreshToken().subscribe();
    }, timeout);
  }

  private stopRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // ================= HELPERS =================

  isAuthenticated(): boolean {
    return !!this.tokenSub.value;
  }

  hasRole(role: string): boolean {
    return this.rolesSub.value.includes(role) ||
           this.rolesSub.value.includes(`ROLE_${role}`);
  }

  getToken(): string | null {
    return this.tokenSub.value;
  }

  // ================= ERROR HANDLER =================

  private handleError(error: HttpErrorResponse) {

    let msg = 'Erreur inconnue';

    switch (error.status) {
      case 401: msg = 'Login incorrect'; break;
      case 403: msg = 'Accès refusé'; break;
      case 500: msg = 'Erreur serveur'; break;
    }

    return throwError(() => new Error(msg));
  }
}
