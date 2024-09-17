package com.Medical.dao.repositories;

import com.Medical.dao.entities.Appointment;
import com.Medical.dao.entities.Doctor;
import com.Medical.dao.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctor(Doctor doctor);
    List<Appointment> findByPatient(Patient patient);
}
