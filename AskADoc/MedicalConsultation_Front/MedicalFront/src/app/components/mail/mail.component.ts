import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/authService';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './mail.component.html',
  styleUrl: './mail.component.css'
})
export class MailComponent implements OnInit {
  activationForm: FormGroup;
  message: string | null = null;
  isActivated: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.activationForm = this.fb.group({
      activationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.activationForm.valid) {
      this.authService.activateAccount(this.activationForm.value.activationCode).subscribe({
        next: (response) => {
          console.log('Activation response:', response);
          this.message = 'Account activated successfully.';
          this.isActivated = true;
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (error) => {
          console.error('Activation error:', error);
          this.message = error.message || 'An error occurred during account activation.';
          this.isActivated = false;
        }
      });
    }
  }
}