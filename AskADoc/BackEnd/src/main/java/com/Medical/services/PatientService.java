package com.Medical.services;

import com.Medical.dao.entities.Organization;
import com.Medical.dao.entities.Patient;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

public interface PatientService {
    Patient saveOrUpdatePatient(Patient patient);
    List<Patient> getAllPatients();
    Optional<Patient> getPatientById(Integer id);
    void deletePatientById(Integer id);
    Patient findByEmail(String email);
    Patient uploadProfileImage(String userEmail, MultipartFile profileImage);
}