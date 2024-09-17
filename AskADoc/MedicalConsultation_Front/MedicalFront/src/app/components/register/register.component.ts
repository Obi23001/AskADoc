import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegistrationService } from '../../services/RegistrationService';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  doctorForm: FormGroup;
  patientForm: FormGroup;
  organizationForm: FormGroup;
  registrationError: any = {};
  registrationSuccess: string | null = null;
  activeForm: 'doctor' | 'patient' | 'organization' = 'doctor';

  constructor(private fb: FormBuilder, private registrationService: RegistrationService, private router: Router) {
    this.doctorForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      password: [''],
      dateOfBirth: [''],
      city: [''],
      gender: ['']
    });

    this.patientForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      password: [''],
      dateOfBirth: [''],
      city: [''],
      gender: ['']
    });

    this.organizationForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      password: [''],
      dateOfBirth: [''],
      city: [''],
      gender: ['']
    });
  }

  ngOnInit(): void {}

  setActiveForm(form: 'doctor' | 'patient' | 'organization') {
    this.activeForm = form;
    this.registrationError = {};
    this.registrationSuccess = null;
  }

  registerDoctor() {
    this.registrationService.registerDoctor(this.doctorForm.value).subscribe(
      (response) => this.handleRegistrationSuccess(),
      (error) => this.handleRegistrationError(error)
    );
  }

  registerPatient() {
    this.registrationService.registerPatient(this.patientForm.value).subscribe(
      (response) => this.handleRegistrationSuccess(),
      (error) => this.handleRegistrationError(error)
    );
  }

  registerOrganization() {
    this.registrationService.registerOrganization(this.organizationForm.value).subscribe(
      (response) => this.handleRegistrationSuccess(),
      (error) => this.handleRegistrationError(error)
    );
  }

  private handleRegistrationSuccess() {
    this.registrationSuccess = 'Registration successful. Redirecting to activation page...';
    this.registrationError = {};
    this.resetForms();
    setTimeout(() => {
      this.router.navigate(['/activate']);
    }, 2000); // Wait for 2 seconds before redirecting
  }

  private resetForms() {
    this.doctorForm.reset();
    this.patientForm.reset();
    this.organizationForm.reset();
  }

  private handleRegistrationError(error: any) {
    this.registrationSuccess = null;
    this.registrationError = {};

    if (error.error && error.error.validationErrors) {
      this.handleValidationErrors(error.error.validationErrors);
    } else if (error.error && error.error.error) {
      this.registrationError.general = error.error.error;
    } else if (error.error && error.error.businessErrorDescription) {
      this.registrationError.general = error.error.businessErrorDescription;
    } else {
      this.registrationError.general = 'An unexpected error occurred. Please try again.';
    }
  }

  private handleValidationErrors(validationErrors: string[]) {
    const fieldMap: { [key: string]: string } = {
      'First Name': 'firstName',
      'Last Name': 'lastName',
      'Date of Birth': 'dateOfBirth',
      'Email': 'email',
      'Password': 'password',
      'City': 'city',
      'Gender': 'gender',
      'Organization Name': 'organizationName',
      'Address': 'address',
      'Phone Number': 'phoneNumber'
    };

    validationErrors.forEach((errorMsg: string) => {
      for (const [key, value] of Object.entries(fieldMap)) {
        if (errorMsg.includes(key)) {
          this.registrationError[value] = errorMsg;
          this.getActiveForm().get(value)?.setErrors({ serverError: errorMsg });
          break;
        }
      }
    });
  }

  private getActiveForm(): FormGroup {
    switch (this.activeForm) {
      case 'doctor':
        return this.doctorForm;
      case 'patient':
        return this.patientForm;
      case 'organization':
        return this.organizationForm;
    }
  }
}
