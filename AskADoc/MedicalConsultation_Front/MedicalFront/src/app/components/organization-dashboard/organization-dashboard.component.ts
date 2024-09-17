import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationService } from '../../services/OrganizationService';
import { AuthService } from '../../services/authService';
import { Organization } from '../../models/organization.model';
import { isPlatformBrowser } from '@angular/common';
import { OrganizationTypes } from '../../models/organization-types';
import { OrganizationTypesDisplay } from '../../models/organization-types-display';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organization-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './organization-dashboard.component.html',
  styleUrls: ['./organization-dashboard.component.css']
})
export class OrganizationDashboardComponent implements OnInit {
  organizationProfile: Organization | null = null;
  verificationForm: FormGroup;
  changePasswordForm: FormGroup; // New form for changing password
  activeSection: string = 'dashboard';
  isVerified: boolean = false;
  organizationTypes = Object.values(OrganizationTypes);
  organizationTypesDisplay = OrganizationTypesDisplay;
  verificationError: any = {};
  verificationSuccess: string | null = null;
  changePasswordError: string | null = null; // Error message for password change
  profileImageFile: File | null = null;
  profileImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.verificationForm = this.fb.group({
      organizationName: ['', [Validators.required]],
      typeOfInstitution: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      facilityCity: ['', [Validators.required]],
      facilityAddress: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?[0-9. ()-]{7,25}$')]],
      schedule: [''],
      website: ['', [Validators.maxLength(100)]],
      facilityEmailAddress: ['', [Validators.required, Validators.email]]
    });

    // Initialize change password form
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadOrganizationProfile();
    }
  }

  loadOrganizationProfile() {
    this.organizationService.getOrganizationProfile().subscribe({
      next: (organization: Organization) => {
        this.organizationProfile = organization;
        this.isVerified = organization.verified;
        if (this.isVerified) {
          this.verificationForm.patchValue(organization);
        }
        if (organization.user.profileImage) {
          this.profileImageUrl = 'data:image/jpeg;base64,' + organization.user.profileImage;
        }
      },
      error: (error: any) => {
        console.error('Error loading organization profile:', error);
      }
    });
  }

  submitVerification() {
    if (this.verificationForm.valid) {
      const formValue = this.verificationForm.value;

      this.organizationService.verifyOrganization(formValue).subscribe({
        next: (response: Organization) => {
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

  private handleVerificationSuccess(response: Organization) {
    this.organizationProfile = response;
    this.isVerified = true;
    this.verificationSuccess = 'Verification successful. Your profile has been updated.';
    this.verificationError = {};
    console.log('Verification successful', response);
    setTimeout(() => {
      this.router.navigate(['/organization-dashboard']);
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
      'Organization name': 'organizationName',
      'Type of institution': 'typeOfInstitution',
      'Description': 'description',
      'Facility city': 'facilityCity',
      'Facility address': 'facilityAddress',
      'Phone number': 'phoneNumber',
      'Schedule': 'schedule',
      'Website': 'website',
      'Facility email address': 'facilityEmailAddress'
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

  private validateAllFormFields() {
    Object.keys(this.verificationForm.controls).forEach(field => {
      const control = this.verificationForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  changeSection(section: string) {
    this.activeSection = section;
    if (section === 'profile') {
      this.loadOrganizationProfile();
    }
  }

  formatFieldName(fieldName: string): string {
    const words = fieldName.split(/(?=[A-Z])/).map(word => word.toLowerCase());
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profileImageFile = file;
    }
  }

  uploadImage(): void {
    if (this.profileImageFile) {
      const formData = new FormData();
      formData.append('profileImage', this.profileImageFile);

      this.organizationService.uploadProfileImage(formData).subscribe({
        next: (organization: Organization) => {
          this.organizationProfile = organization;
          if (organization['profileImage']) {
            this.profileImageUrl = 'data:image/jpeg;base64,' + organization['profileImage'];
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

  // New method for changing password
  changePassword(): void {
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
}
