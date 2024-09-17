import { Component, OnInit } from '@angular/core';
import { DocardComponent } from '../../components/docard/docard.component';
import { SearchComponent } from '../../components/search/search.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/DoctorService';
import { Doctor } from '../../models/doctor.model';
import { MedicalCategories } from '../../models/medical-categories';
import { MedicalCategoriesDisplay } from '../../models/medical-categories-display';
import { PatientService } from '../../services/PatientService';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BookAppointmentDialogComponent } from '../../components/book-appointment-dialog/book-appointment-dialog.component';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [DocardComponent, SearchComponent, PaginationComponent, CommonModule, MatDialogModule, MatDatepickerModule, MatInputModule, MatNativeDateModule, ReactiveFormsModule, BookAppointmentDialogComponent],
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.css'
})
export class DocsComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  displayedDoctors: Doctor[] = [];
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  profileImageUrl: string = '';
  
  constructor(private doctorService: DoctorService, private patientService: PatientService, private dialog: MatDialog) {}

  ngOnInit() {
    this.fetchDoctors();
  }

  fetchDoctors() {
    this.doctorService.getAllDoctors().subscribe({
      next: (doctors) => {
        console.log(doctors); // Add this line
        this.doctors = doctors.map(doctor => {
          if (doctor['profileImage']) {
            doctor['profileImageUrl'] = 'data:image/jpeg;base64,' + doctor['profileImage'];
          }
          return doctor;
        });
        this.filterDoctors();
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
      }
    });
  }

  onSearch(searchTerm: string) {
    this.currentPage = 1;
    this.filterDoctors(searchTerm);
  }

  onFilter(specialty: string) {
    this.currentPage = 1;
    this.filterDoctors(undefined, specialty as MedicalCategories | 'All');
  }

  filterDoctors(searchTerm?: string, specialty?: MedicalCategories | 'All') {
    let filtered = this.doctors.filter(doctor => doctor.verified === true);

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(doctor => {
        const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
        const reversedName = `${doctor.lastName} ${doctor.firstName}`.toLowerCase();
        return fullName.includes(lowerCaseSearchTerm) ||
               reversedName.includes(lowerCaseSearchTerm) ||
               doctor.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
               doctor.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
               MedicalCategoriesDisplay[doctor.speciality].toLowerCase().includes(lowerCaseSearchTerm);
      });
    }

    if (specialty && specialty !== 'All') {
      filtered = filtered.filter(doctor => doctor.speciality === specialty);
    }

    this.filteredDoctors = filtered;
    this.totalPages = Math.ceil(this.filteredDoctors.length / this.pageSize);
    this.updatePagedDoctors();
  }

  updatePagedDoctors() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedDoctors = this.filteredDoctors.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagedDoctors();
  }

  searchCategories: { key: string, value: string }[] = [
    { key: 'All', value: 'All Specialties' },
    ...Object.entries(MedicalCategoriesDisplay).map(([key, value]) => ({
      key: key,
      value: value
    }))
  ];

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
      }
    });
  }
}

