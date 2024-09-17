package com.Medical.services;

import com.Medical.dao.entities.Patient;
import com.Medical.dao.repositories.PatientRepository;

import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {
    private final PatientRepository patientRepository;
    /*private final UserRepository userRepository;*/

    @Override
    public Patient saveOrUpdatePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public Optional<Patient> getPatientById(Integer id) {
        return patientRepository.findById(id);
    }

    @Override
    public void deletePatientById(Integer id) {
        patientRepository.deleteById(id);
    }

    @Override
    public Patient findByEmail(String email) {
        return patientRepository.findByEmail(email).orElse(null);
    }

    public Patient uploadProfileImage(String userEmail, MultipartFile profileImage) {
        // Find the organization by user email
        Patient patient = patientRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        try {
            // Convert the MultipartFile to a byte array
            byte[] imageBytes = profileImage.getBytes();
            // Update the organization's profile image
            patient.setProfileImage(imageBytes);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload profile image", e);
        }

        // Save the updated organization
        patientRepository.save(patient);

        return patient;
    }
}
