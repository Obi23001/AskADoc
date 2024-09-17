import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../services/PatientService';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  patientProfile: Patient | null = null;
  activeSection: string = 'dashboard';
  profileImageFile: File | null = null;
  profileImageUrl: string | null = null;
  appointments: any[] = [];
  changePasswordForm: FormGroup; // New form for changing password
  changePasswordError: string | null = null; // Error message for password change

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize change password form
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPatientProfile();
    }
  }

  loadPatientProfile() {
    this.patientService.getPatientProfile().subscribe({
      next: (patient: Patient) => {
        this.patientProfile = patient;
        if (patient.user && patient.user.profileImage) {
          this.profileImageUrl = 'data:image/jpeg;base64,' + patient.user.profileImage;
        }
      },
      error: (error: any) => {
        console.error('Error loading patient profile:', error);
      }
    });
  }

  loadAppointments() {
    this.patientService.getPatientAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.activeSection = 'appointments'; // Set the active section
      },
      error: (error) => {
        console.error('Error loading appointments', error);
        this.activeSection = 'appointments'; // Set the active section even if there's an error
      }
    });
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.profileImageFile = files[0];
    }
  }

  uploadImage() {
    if (this.profileImageFile) {
      const formData = new FormData();
      formData.append('profileImage', this.profileImageFile);

      this.patientService.uploadProfileImage(formData).subscribe({
        next: (patient: Patient) => {
          this.patientProfile = patient;
          if (patient.user && patient.user['profileImage']) {
            this.profileImageUrl = 'data:image/jpeg;base64,' + patient.user['profileImage'];
          }
          alert('Profile image uploaded successfully.');
        },
        error: (error: any) => {
          console.error('Error uploading profile image:', error);
          alert('Failed to upload profile image.');
        }
      });
    }
  }

  changeSection(section: string) {
    this.activeSection = section;
    if (section === 'profile') {
      this.loadPatientProfile();
    } else if (section === 'appointments') {
      this.loadAppointments();
    }
  }

  // Method for changing password
  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const { oldPassword, newPassword, confirmPassword } = this.changePasswordForm.value;
      if (newPassword !== confirmPassword) {
        this.changePasswordError = "New passwords do not match!";
        return;
      }
      this.authService.changePassword({ oldPassword, newPassword, confirmPassword }).subscribe(
        () => {
          this.changePasswordError = null; // Clear any previous errors
          alert("Password Changed Successfully!"); // Display success message
          this.changePasswordForm.reset(); // Reset the form after successful change
        },
        error => {
          this.changePasswordError = error.error?.error || "An unexpected error occurred. Please try again.";
        }
      );
    } else {
      this.validateAllFormFields();
    }
  }

  private validateAllFormFields() {
    Object.keys(this.changePasswordForm.controls).forEach(field => {
      const control = this.changePasswordForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  cancelAppointment(appointmentId: number) {
    this.patientService.cancelAppointment(appointmentId).subscribe({
      next: (response) => {
        this.loadAppointments(); // Refresh the appointments list
      },
      error: (error) => {
        console.error('Error cancelling appointment', error);
        alert('Failed to cancel appointment');
      }
    });
  }
}