package com.Medical.services;

import com.Medical.dao.entities.Appointment;
import com.Medical.dao.entities.Doctor;
import com.Medical.dao.entities.Patient;
import com.Medical.dao.repositories.AppointmentRepository;
import com.Medical.dao.repositories.DoctorRepository;
import com.Medical.dao.repositories.PatientRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public Appointment bookAppointment(String doctorEmail, String patientEmail, String appointmentDateTime) {
        Doctor doctor = doctorRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        Patient patient = patientRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Appointment appointment = Appointment.builder()
                .doctor(doctor)
                .patient(patient)
                .appointmentDateTime(LocalDateTime.parse(appointmentDateTime))
                .status("SCHEDULED")
                .build();

        return appointmentRepository.save(appointment);
    }

    @Override
    public List<Appointment> getDoctorAppointments(String doctorEmail) {
        Doctor doctor = doctorRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return appointmentRepository.findByDoctor(doctor);
    }

    @Override
    public List<Appointment> getPatientAppointments(String patientEmail) {
        Patient patient = patientRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return appointmentRepository.findByPatient(patient);
    }

    @Override
    public Appointment cancelAppointment(Long appointmentId, String userEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getDoctor().getEmail().equals(userEmail) && !appointment.getPatient().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to cancel this appointment");
        }

        appointment.setStatus("CANCELLED");
        return appointmentRepository.save(appointment);
    }
}
