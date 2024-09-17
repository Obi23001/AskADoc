import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DoctorService } from '../../services/DoctorService';
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Doctor } from '../../models/doctor.model';
import { MedicalCategories } from '../../models/medical-categories';
import { MedicalCategoriesDisplay } from '../../models/medical-categories-display';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { BookAppointmentDialogComponent } from '../../components/book-appointment-dialog/book-appointment-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    BookAppointmentDialogComponent
  ],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.css'
})
export class DoctorDashboardComponent implements OnInit {
  appointments: any[] = [];
  doctorProfile: Doctor | null = null;
  verificationForm: FormGroup;
  changePasswordForm: FormGroup;
  activeSection: string = 'appointments';
  isVerified: boolean = false;
  medicalCategories = Object.values(MedicalCategories);
  medicalCategoriesDisplay = MedicalCategoriesDisplay;
  verificationError: any = {};
  verificationSuccess: string | null = null;
  profileImageFile: File | null = null;
  profileImageUrl: string | null = null;
  changePasswordError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.verificationForm = this.fb.group({
      speciality: ['', [Validators.required]],
      education: ['', [Validators.required]],
      workPlace: ['', [Validators.required]],
      position: ['', [Validators.required]],
      workExperienceYears: ['', [Validators.required, Validators.min(0)]],
      awards: [''],
      contactPhone: ['', [Validators.required, Validators.pattern('^\\+?[0-9. ()-]{7,25}$')]],
      contactEmail: ['', [Validators.required, Validators.email]],
      aboutMe: ['', [Validators.maxLength(500)]],
      specializationDetails: ['', [Validators.maxLength(500)]],
      workExperienceDetails: ['', [Validators.maxLength(500)]],
      furtherTraining: ['', [Validators.maxLength(500)]],
      achievementsAndAwards: ['', [Validators.maxLength(500)]],
      scientificWorks: ['', [Validators.maxLength(500)]],
      certificates: [null, [this.validateCertificates]]
    });

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDoctorProfile();
      this.loadAppointments();
    }
  }

  loadDoctorProfile() {
    this.doctorService.getDoctorProfile().subscribe({
      next: (doctor: Doctor) => {
        this.doctorProfile = doctor;
        this.isVerified = doctor.verified;
        if (this.isVerified) {
          this.verificationForm.patchValue(doctor);
        }
        if (doctor.user.profileImage) { // Access profileImage from user
          this.profileImageUrl = 'data:image/jpeg;base64,' + doctor.user.profileImage;
        }
        this.loadAppointments();
      },
      error: (error: any) => {
        console.error('Error loading organization profile:', error);
      }
    });
  }

  loadAppointments() {
    console.log('Loading appointments...');
    this.doctorService.getDoctorAppointments().subscribe({
      next: (appointments) => {
        console.log('Received appointments:', appointments);
        this.appointments = appointments;
        this.activeSection = 'appointments';
      },
      error: (error) => {
        console.error('Error loading appointments', error);
        this.activeSection = 'appointments';
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

      this.doctorService.uploadProfileImage(formData).subscribe({
        next: (doctor: Doctor) => {
          this.doctorProfile = doctor;
          if (doctor['profileImage']) {
            this.profileImageUrl = 'data:image/jpeg;base64,' + doctor['profileImage'];
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

  submitVerification() {
    if (this.verificationForm.valid) {
      const formData = new FormData();
      const formValue = this.verificationForm.value;
      
      const dataWithoutCertificates = { ...formValue };
      delete dataWithoutCertificates.certificates;

      formData.append('data', new Blob([JSON.stringify(dataWithoutCertificates)], {
        type: "application/json"
      }));

      if (formValue.certificates) {
        for (let i = 0; i < formValue.certificates.length; i++) {
          formData.append('certificates', formValue.certificates[i]);
        }
      }

      this.doctorService.verifyDoctor(formData).subscribe({
        next: (response: Doctor) => {
          this.handleVerificationSuccess(response);
        },
        error: (error: any) => {
          this.handleVerificationError(error);
        }
      });
    } else {
      this.validateAllFormFields();
    }
  }

  private handleVerificationSuccess(response: Doctor) {
    this.doctorProfile = response;
    this.isVerified = true;
    this.verificationSuccess = 'Verification successful. Your profile has been updated.';
    this.verificationError = {};
    console.log('Verification successful', response);
    setTimeout(() => {
      this.router.navigate(['/doctor-dashboard']);
    }, 2000);
  }

  private handleVerificationError(error: any) {
    this.verificationSuccess = null;
    this.verificationError = {};

    if (error.error && error.error.validationErrors) {
      this.handleValidationErrors(error.error.validationErrors);
    } else if (error.error && error.error.error) {
      this.verificationError.general = error.error.error;
    } else if (error.error && error.error.businessErrorDescription) {
      this.verificationError.general = error.error.businessErrorDescription;
    } else {
      this.verificationError.general = 'An unexpected error occurred. Please try again.';
    }
    console.error('Error during verification:', error);
  }

  private handleValidationErrors(validationErrors: string[]) {
    const fieldMap: { [key: string]: string } = {
      'Specialization': 'speciality',
      'Education': 'education',
      'Current place of work': 'workPlace',
      'Position': 'position',
      'Work experience': 'workExperienceYears',
      'Awards': 'awards',
      'Contact Phone': 'contactPhone',
      'Contact Email': 'contactEmail',
      'About me': 'aboutMe',
      'Specialization details': 'specializationDetails',
      'Work experience details': 'workExperienceDetails',
      'Further training': 'furtherTraining',
      'Achievements and awards': 'achievementsAndAwards',
      'Scientific works': 'scientificWorks',
      'Certificates': 'certificates'
    };

    validationErrors.forEach((errorMsg: string) => {
      for (const [key, value] of Object.entries(fieldMap)) {
        if (errorMsg.includes(key)) {
          this.verificationError[value] = errorMsg;
          this.verificationForm.get(value)?.setErrors({ serverError: errorMsg });
          break;
        }
      }
    });
  }

  changeSection(section: string) {
    console.log('Changing section to:', section);
    this.activeSection = section;
    if (section === 'profile') {
      this.loadDoctorProfile();
    } else if (section === 'appointments') {
      this.loadAppointments();
    }
    console.log('Active section after change:', this.activeSection);
    console.log('Appointments:', this.appointments);
  }
  
  formatFieldName(fieldName: string): string {
    const words = fieldName.split(/(?=[A-Z])/).map(word => word.toLowerCase());
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  validateCertificates(control: AbstractControl): {[key: string]: any} | null {
    const files = control.value as File[];
    if (files) {
      if (files.length > 5) {
        return { 'maxCount': true };
      }
      for (let file of files) {
        if (file.size > 5 * 1024 * 1024) { // 5MB in bytes
          return { 'maxSize': true };
        }
      }
    }
    return null;
  }

  cancelAppointment(appointmentId: number) {
    this.doctorService.cancelAppointment(appointmentId).subscribe({
      next: (response) => {
        console.log('Appointment cancelled successfully', response);
        this.loadAppointments(); // Refresh the appointments list
      },
      error: (error) => {
        console.error('Error cancelling appointment', error);
      }
    });
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const { oldPassword, newPassword, confirmPassword } = this.changePasswordForm.value;
      if (newPassword !== confirmPassword) {
        this.changePasswordError = "New passwords do not match!";
        return;
      }
      console.log("Attempting to change password for user:", oldPassword);
      this.authService.changePassword({ oldPassword, newPassword, confirmPassword }).subscribe(
        () => {
          // Directly show success message without checking for response
          this.changePasswordError = null; // Clear any previous errors
          alert("Password Changed Successfully!"); // Display success message
          this.changePasswordForm.reset(); // Reset the form after successful change
        },
        error => {
          console.error("Error response from server:", error);
          // Check if the error response has a specific error message
          if (error.error && error.error.error) {
            this.changePasswordError = error.error.error; // Extract the specific error message
          } else {
            this.changePasswordError = "An unexpected error occurred. Please try again."; // Fallback error message
          }
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
}
