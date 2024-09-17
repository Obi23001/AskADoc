import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8088/api/v1/auth';
  private tokenKey = 'auth_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.checkInitialAuthState();
  }

  private checkInitialAuthState() {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            // Token has expired
            this.logout();
          } else {
            // Token is valid
            this.setUserFromToken(token);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          this.logout();
        }
      } else {
        this.logout();
      }
    }
  }

  private setUserFromToken(token: string) {
    const decodedToken: any = jwtDecode(token);
    const user = {
      role: decodedToken.authorities && decodedToken.authorities.length > 0 ? decodedToken.authorities[0] : 'UNKNOWN',
      fullName: decodedToken.fullName || 'User',
      email: decodedToken.sub || ''
    };
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/authenticate`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.setToken(response.token);
          const decodedToken: any = jwtDecode(response.token);
          console.log('Decoded Token:', decodedToken);
          const user = {
            role: decodedToken.authorities && decodedToken.authorities.length > 0 ? decodedToken.authorities[0] : 'UNKNOWN',
            fullName: decodedToken.fullName || 'User',
            email: decodedToken.sub || '',
          };
          localStorage.setItem('userRole', user.role);
          localStorage.setItem('currentUser', JSON.stringify(user));
          console.log('Setting currentUser:', user);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
          console.log('Token set:', response.token);
        } else {
          console.error('Invalid response structure');
          throw new Error('Invalid response structure');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.status === 401) {
            errorMessage = 'Invalid email or password';
          } else if (error.status === 404) {
            errorMessage = 'User not found';
          } else if (error.status === 403) {
            errorMessage = 'User account is not enabled. Activation email has been sent.';
          }
        }
        console.error('Login error:', errorMessage);
        return throwError(() => errorMessage);
      })
    );
  }

  logout(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return of(null).pipe(tap(() => this.clearLocalData()));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/logout`, { headers: headers }).pipe(
      tap(() => this.clearLocalData()),
      catchError(error => {
        console.error('Logout error:', error);
        this.clearLocalData();
        return throwError(() => 'Logout failed');
      })
    );
  }

  private clearLocalData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem('userRole');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('Retrieved token:', token);
    return token;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  activateAccount(activationCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/activate-account?token=${activationCode}`, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  getCurrentUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const userString = localStorage.getItem('currentUser');
      console.log('Current User from localStorage:', userString); // Keep this for debugging
      if (userString) {
        const user = JSON.parse(userString);
        console.log('Parsed Current User:', user); // Add this for additional debugging
        return user;
      }
    }
    return null;
  }

  getUserRole(): string {
    const user = this.currentUserSubject.value;
    const role = user && user.role ? user.role : 'UNKNOWN';
    // console.log('Current user role:', role);
    return role;
  }

  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem(this.tokenKey);
    }
    return false;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unexpected error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.status === 404) {
        errorMessage = 'User not found';
      }
    }
    return throwError(() => errorMessage);
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
    this.isAuthenticatedSubject.next(true);
  }

  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`, { headers: this.getHeaders() })
        .pipe(catchError(this.handleError));
  }

  getCurrentUserEmail(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub; // Assuming the email is stored in the 'sub' claim
    }
    return null;
  }

  getEmail(): string {
    const token = this.getToken();
    if (token) {
      const decodedToken = jwtDecode(token) as any; // You might need to install jwt-decode package
      return decodedToken.sub; // Assuming the email is stored in the 'sub' claim of the JWT
    }
    return '';
  }

  changePassword(data: { oldPassword: string; newPassword: string; confirmPassword: string }): Observable<any> {
    const token = localStorage.getItem(this.tokenKey); // Adjust how you retrieve the token
    return this.http.post(`${this.apiUrl}/change-password`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}