import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './authService';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:8088/api/v1'; // Adjust this to your backend URL

  constructor(private http: HttpClient, private authService: AuthService) { }

  askQuestion(question: any): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/patient/askAQuestion`, question, { headers });
  }

  getQuestions(): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.get<any[]>(`${this.apiUrl}/patient/questions`, { headers });
  }

  getQuestionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/questions/${id}`);
  }

  answerQuestion(answer: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.post(`${this.apiUrl}/doctor/answerQuestion`, answer, { headers });
  }

  loadAnswers(questionId: number): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.get<any[]>(`${this.apiUrl}/doctor/questions/${questionId}/answers`, { headers });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  getDoctorById(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.get<any>(`${this.apiUrl}/doctor/${id}`, { headers });
  }
}
