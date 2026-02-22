import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LoginRequest, LoginResponse, RefreshResponse, User } from '../models/auth.model';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const BASE_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly currentUser = signal<User | null>(null);
  readonly accessToken = signal<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY));

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${BASE_URL}/auth/login`, data).pipe(
      tap((res) => {
        this.saveTokens(res.access_token, res.refresh_token);
        this.currentUser.set(res.user);
        const target = res.user.globalRole === 'OWNER' ? '/organizations' : '/dashboard';
        this.router.navigate([target]);
      })
    );
  }

  refresh(): Observable<RefreshResponse> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    return this.http
      .post<RefreshResponse>(`${BASE_URL}/auth/refresh`, { refreshToken })
      .pipe(
        tap((res) => {
          this.saveTokens(res.access_token, localStorage.getItem(REFRESH_TOKEN_KEY)!);
        }),
        catchError((err) => {
          this.logout();
          return throwError(() => err);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.accessToken.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  private saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    this.accessToken.set(accessToken);
  }
}
