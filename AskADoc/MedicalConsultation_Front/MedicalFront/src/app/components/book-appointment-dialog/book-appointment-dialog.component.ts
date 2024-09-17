import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Book Appointment</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field>
          <input matInput [matDatepicker]="picker" placeholder="Choose a date" formControlName="date">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-form-field>
          <input matInput type="time" placeholder="Choose a time" formControlName="time">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button [mat-dialog-close]="getAppointmentDateTime()" [disabled]="!form.valid">Book</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field {
      display: block;
      margin-bottom: 16px;
    }
  `]
})
export class BookAppointmentDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<BookAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { doctorEmail: string },
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getAppointmentDateTime(): string | null {
    const date = this.form.get('date')?.value;
    const time = this.form.get('time')?.value;
    if (!date || !time) {
      return null;
    }
    return `${date.toISOString().split('T')[0]}T${time}:00`;
  }
}