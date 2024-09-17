package com.Medical.services;


import com.Medical.dao.entities.Certificate;
import com.Medical.dao.entities.Doctor;
import com.Medical.dao.repositories.DoctorRepository;
import com.Medical.dao.requests.DoctorVerificationRequest;
import com.Medical.security.user.User;
import com.Medical.security.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    @Override
    public Doctor saveOrUpdateDoctor(Doctor doctor){
        return doctorRepository.save(doctor);
    }

    @Override
    public List<Doctor> getAllDoctors(){
        return doctorRepository.findAll();
    }

    @Override
    public Optional<Doctor> getDoctorById(Integer id){
        return doctorRepository.findById(id);
    }

    @Override
    public void deleteDoctorById(Integer id){
        doctorRepository.deleteById(id);
    }

    @Transactional
    @Override
    public Doctor verifyDoctor(String userEmail, DoctorVerificationRequest request) throws IOException {
        // Find the User by email
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user instanceof Doctor) {
            Doctor doctor = (Doctor) user;

            // Update doctor fields
            doctor.setSpeciality(request.getSpeciality());
            doctor.setEducation(request.getEducation());
            doctor.setWorkPlace(request.getWorkPlace());
            doctor.setPosition(request.getPosition());
            doctor.setWorkExperienceYears(request.getWorkExperienceYears());
            doctor.setAwards(request.getAwards());
            doctor.setContactPhone(request.getContactPhone());
            doctor.setContactEmail(request.getContactEmail());
            doctor.setAboutMe(request.getAboutMe());
            doctor.setSpecializationDetails(request.getSpecializationDetails());
            doctor.setWorkExperienceDetails(request.getWorkExperienceDetails());
            doctor.setFurtherTraining(request.getFurtherTraining());
            doctor.setAchievementsAndAwards(request.getAchievementsAndAwards());
            doctor.setScientificWorks(request.getScientificWorks());
            doctor.setVerified(true);

            // Handle certificates
            if (request.getCertificates() != null && !request.getCertificates().isEmpty()) {
                List<Certificate> certificateList = request.getCertificates().stream()
                    .map(file -> {
                        try {
                            return Certificate.builder()
                                    .certificateName(file.getOriginalFilename())
                                    .certificateFile(file.getBytes())
                                    .doctor(doctor)
                                    .build();
                        } catch (IOException e) {
                            throw new RuntimeException("Error processing certificate file", e);
                        }
                    })
                    .collect(Collectors.toList());

                doctor.setCertificates(certificateList);
            }

            // Save the updated Doctor entity
            return doctorRepository.save(doctor);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a Doctor");
        }
    }

    @Override
    public Doctor getDoctorProfile(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user instanceof Doctor) {
            return (Doctor) user;
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a Doctor");
        }
    }

    public Doctor uploadProfileImage(String userEmail, MultipartFile profileImage) {
        // Find the organization by user email
        Doctor doctor = doctorRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        try {
            // Convert the MultipartFile to a byte array
            byte[] imageBytes = profileImage.getBytes();
            // Update the organization's profile image
            doctor.setProfileImage(imageBytes);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload profile image", e);
        }

        // Save the updated organization
        doctorRepository.save(doctor);

        return doctor;
    }
}
