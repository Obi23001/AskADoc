package com.Medical.services;


import com.Medical.dao.entities.Organization;
import com.Medical.dao.requests.OrganizationUpdateDataRequest;
import com.Medical.dao.requests.OrganizationVerificationRequest;
import com.Medical.dao.repositories.OrganizationRepository;
import com.Medical.security.user.User;
import com.Medical.security.user.UserRepository;

import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrganizationServiceImpl implements OrganizationService {
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;


    @Override
    public Organization saveOrUpdateOrganization(Organization organization) {
        return organizationRepository.save(organization);
    }

    @Override
    public List<Organization> getAllOrganization() {
        return organizationRepository.findAll();
    }

    @Override
    public Optional<Organization> getOrganizationById(Integer id) {
        return organizationRepository.findById(id);
    }

    @Override
    public void deleteOrganization(Integer id) {
        organizationRepository.deleteById(id);
    }

    @Override
    public Organization verifyOrganization(String userEmail, OrganizationVerificationRequest request) {
        // Find the User by email
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create and populate the Organization entity
        Organization organization = Organization.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .dateOfBirth(user.getDateOfBirth())
                .email(user.getEmail())
                .password(user.getPassword())
                .city(user.getCity())
                .gender(user.getGender())
                .roles(user.getRoles())
                .accountLocked(user.isAccountNonLocked())
                .enabled(user.isEnabled())
                .verified(true)
                .createdDate(user.getCreatedDate())
                .lastModifiedDate(user.getLastModifiedDate())
                //From the JSON REQUEST
                .organizationName(request.getOrganizationName())
                .typeOfInstitution(request.getTypeOfInstitution())
                .description(request.getDescription())
                .facilityCity(request.getFacilityCity())
                .facilityAddress(request.getFacilityAddress())
                .phoneNumber(request.getPhoneNumber())
                .schedule(request.getSchedule())
                .website(request.getWebsite())
                .facilityEmailAddress(request.getFacilityEmailAddress())
                .build();

        // Save the Organization entity
        return organizationRepository.save(organization);
    }

    @Override
    public Optional<Organization> getOrganizationProfile(String email) {
        return organizationRepository.findByEmail(email);
    }

    public Organization uploadProfileImage(String userEmail, MultipartFile profileImage) {
        // Find the organization by user email
        Organization organization = organizationRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        try {
            // Convert the MultipartFile to a byte array
            byte[] imageBytes = profileImage.getBytes();
            // Update the organization's profile image
            organization.setProfileImage(imageBytes);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload profile image", e);
        }

        // Save the updated organization
        organizationRepository.save(organization);

        return organization;
    }
}

