import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, tap, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './authService';
import { Patient } from '../models/patient.model';



@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8088/api/v1/patient'; // Update to match your backend URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getPatientProfile(): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/profile`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  uploadProfileImage(formData: FormData): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/upload-profile-image`, formData, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}` // Include authorization if needed
      }
    }).pipe(
      catchError(this.handleError)
    );
  }

  getPatientAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8088/api/v1/appointments/patient`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  bookAppointment(doctorEmail: string, appointmentDateTime: string): Observable<any> {
    const body = { doctorEmail, appointmentDateTime };
    console.log('Sending appointment request:', body);
    return this.http.post(`http://localhost:8088/api/v1/appointments/book`, body, { headers: this.getHeaders(), observe: 'response' })
      .pipe(
        tap(response => console.log('Appointment response:', response)),
        map(response => response.body),
        catchError(this.handleError)
      );
  }

  cancelAppointment(appointmentId: number): Observable<any> {
    return this.http.post(`http://localhost:8088/api/v1/appointments/cancel/${appointmentId}`, {}, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Appointment cancelled:', response)),
        catchError(this.handleError)
      );
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error('An error occurred:', error);
    return throwError(() => new Error(`${error.status} ${error.statusText}: ${error.message}`));
  }

  getQuestionsWithPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/questions`, { headers: this.getHeaders() });
  }

  getPatientById(patientId: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${patientId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }
}
