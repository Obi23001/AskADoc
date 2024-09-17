import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Organization } from '../models/organization.model';
import { AuthService } from './authService';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = 'http://localhost:8088/api/v1/organization';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  verifyOrganization(verificationData: any): Observable<Organization> {
    return this.http.post<Organization>(`${this.apiUrl}/verifyOrganization`, verificationData, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getOrganizationProfile(): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/profile`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.apiUrl}/all`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error('An error occurred:', error);
    return throwError(() => new Error(`${error.status} ${error.statusText}: ${error.message}`));
  }

  uploadProfileImage(formData: FormData): Observable<Organization> {
    return this.http.post<Organization>(`${this.apiUrl}/upload-profile-image`, formData, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}` // Include authorization if needed
      }
    });
  }
}
