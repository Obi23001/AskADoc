import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ RouterModule, FormsModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          const role = this.authService.getUserRole();
          switch (role) {
            case 'DOCTOR':
              this.router.navigate(['/doctor-dashboard']);
              break;
            case 'PATIENT':
              this.router.navigate(['/patient-dashboard']);
              break;
            case 'ORGANIZATION':
              this.router.navigate(['/organization-dashboard']);
              break;
            default:
              this.router.navigate(['/']);
          }
        },
        error: (errorMessage: string) => {
          console.error('Login error', errorMessage);
          this.loginError = errorMessage;
          
          if (errorMessage === 'User account is not enabled. Activation email has been sent.') {
            setTimeout(() => {
              this.router.navigate(['/activate']);
            }, 2000);
          }
        }
      });
    } else {
      this.validateAllFormFields();
    }
  }

  private validateAllFormFields() {
    Object.keys(this.loginForm.controls).forEach(field => {
      const control = this.loginForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}