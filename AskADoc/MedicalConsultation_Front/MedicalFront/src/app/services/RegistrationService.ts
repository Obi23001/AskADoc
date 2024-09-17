import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { RegistrationRequest } from "../models/registration-request.model";

@Injectable({
  providedIn: "root",
})
export class RegistrationService {
  private baseUrl = '/api/v1/auth';

  constructor(private http: HttpClient) {}

  registerDoctor(data: RegistrationRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/doctor`, data);
  }

  registerPatient(data: RegistrationRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/patient`, data);
  }

  registerOrganization(data: RegistrationRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/organization`, data);
  }
}