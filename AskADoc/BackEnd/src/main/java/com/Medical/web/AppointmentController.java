package com.Medical.web;

import com.Medical.dao.entities.Appointment;
import com.Medical.services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.Medical.security.security.JwtService;
import com.Medical.dao.requests.AppointmentRequest;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/book")
    public ResponseEntity<Appointment> bookAppointment(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody AppointmentRequest appointmentRequest) {
        String token = authorizationHeader.replace("Bearer ", "");
        String patientEmail = jwtService.extractUsername(token);
        Appointment appointment = appointmentService.bookAppointment(
                appointmentRequest.getDoctorEmail(),
                patientEmail,
                appointmentRequest.getAppointmentDateTime());
        return ResponseEntity.ok(appointment);
    }

    @GetMapping("/doctor")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        String doctorEmail = jwtService.extractUsername(token);
        List<Appointment> appointments = appointmentService.getDoctorAppointments(doctorEmail);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/patient")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        String patientEmail = jwtService.extractUsername(token);
        List<Appointment> appointments = appointmentService.getPatientAppointments(patientEmail);
        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/cancel/{appointmentId}")
    public ResponseEntity<Appointment> cancelAppointment(
            @PathVariable Long appointmentId,
            @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        String userEmail = jwtService.extractUsername(token);
        Appointment cancelledAppointment = appointmentService.cancelAppointment(appointmentId, userEmail);
        return ResponseEntity.ok(cancelledAppointment);
    }
}
