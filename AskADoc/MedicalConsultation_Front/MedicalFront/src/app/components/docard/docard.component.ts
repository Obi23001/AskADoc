import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Doctor } from '../../models/doctor.model';
import { DoctorService } from '../../services/DoctorService';
import { MatDialog } from '@angular/material/dialog';
import { BookAppointmentDialogComponent } from '../book-appointment-dialog/book-appointment-dialog.component';
import { PatientService } from '../../services/PatientService';
import { MedicalCategoriesDisplay } from '../../models/medical-categories-display';
import { MedicalCategories } from '../../models/medical-categories';

@Component({
  selector: 'app-docard',
  standalone: true,
  imports: [CommonModule, BookAppointmentDialogComponent],
  templateUrl: './docard.component.html',
  styleUrl: './docard.component.css'
})
export class DocardComponent {
  @Input() doctor!: Doctor;
  @Input() image: string = '';
  @Input() name: string = '';
  @Input() specialty: MedicalCategories = MedicalCategories.INTERNAL_MEDICINE; // Change type to MedicalCategories
  @Input() price: string = '';

  constructor(
    private doctorService: DoctorService,
    private patientService: PatientService,
    private dialog: MatDialog
  ) {}

  get specialtyDisplay(): string {
    return MedicalCategoriesDisplay[this.specialty];
  }

  bookAppointment(doctorEmail: string) {
    const dialogRef = this.dialog.open(BookAppointmentDialogComponent, {
      width: '300px',
      data: { doctorEmail: doctorEmail }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.patientService.bookAppointment(doctorEmail, result).subscribe(
          (response) => {
            console.log('Appointment booked successfully', response);
            alert('Appointment booked successfully');
          },
          (error) => {
            console.error('Error booking appointment', error);
            alert('Failed to book appointment');
          }
        );
      } else {
        console.log('Appointment booking cancelled');
      }
    });
  }
}
