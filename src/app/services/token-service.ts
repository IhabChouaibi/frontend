import { Injectable } from '@angular/core';
import { TokenPayload } from '../models/token-payload';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_EXPIRES_KEY = 'token_expires';
  private readonly USER_KEY = 'user_data';

  // ==================== ACCESS TOKEN ====================

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  removeAccessToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  // ==================== REFRESH TOKEN ====================

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // ==================== EXPIRATION ====================

  setExpiresIn(expiresInSeconds: number): void {
    const expiresAt = Date.now() + (expiresInSeconds * 1000);
    localStorage.setItem(this.TOKEN_EXPIRES_KEY, expiresAt.toString());
  }

  getExpirationTime(): number {
    const expires = localStorage.getItem(this.TOKEN_EXPIRES_KEY);
    return expires ? parseInt(expires, 10) : 0;
  }

  removeExpiration(): void {
    localStorage.removeItem(this.TOKEN_EXPIRES_KEY);
  }

  isTokenExpired(): boolean {
    const expiresAt = this.getExpirationTime();
    if (!expiresAt) return true;
    return Date.now() >= expiresAt;
  }

  getTimeUntilExpiration(): number {
    return Math.floor((this.getExpirationTime() - Date.now()) / 1000);
  }

  // ==================== USER DATA ====================

  setUserData(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUserData(): any | null {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  removeUserData(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // ==================== DECODE TOKEN ====================

  decodeToken(token: string): TokenPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  // ==================== CLEAR ALL ====================

  clearAll(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeExpiration();
    this.removeUserData();
  }
  
}
