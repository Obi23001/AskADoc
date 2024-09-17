package com.Medical.services;

import com.Medical.dao.entities.Appointment;

import java.util.List;

public interface AppointmentService {
    Appointment bookAppointment(String doctorEmail, String patientEmail, String appointmentDateTime);
    List<Appointment> getDoctorAppointments(String doctorEmail);
    List<Appointment> getPatientAppointments(String patientEmail);
    Appointment cancelAppointment(Long appointmentId, String userEmail);
    // Add other methods as needed
}
