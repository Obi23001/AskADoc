import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { RegistrationService } from '../../services/RegistrationService';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let registrationServiceSpy: jasmine.SpyObj<RegistrationService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('RegistrationService', ['registerDoctor', 'registerPatient', 'registerOrganization']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: RegistrationService, useValue: spy }
      ]
    }).compileComponents();

    registrationServiceSpy = TestBed.inject(RegistrationService) as jasmine.SpyObj<RegistrationService>;
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have doctor, patient, and organization forms', () => {
    expect(component.doctorForm).toBeTruthy();
    expect(component.patientForm).toBeTruthy();
    expect(component.organizationForm).toBeTruthy();
  });

  it('should change active form', () => {
    component.setActiveForm('patient');
    expect(component.activeForm).toBe('patient');
    component.setActiveForm('organization');
    expect(component.activeForm).toBe('organization');
  });

  // Add more tests for form submission, error handling, etc.
});
