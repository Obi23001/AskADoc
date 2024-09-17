package com.Medical.web;


import com.Medical.dao.requests.OrganizationUpdateDataRequest;
import com.Medical.dao.requests.OrganizationVerificationRequest;
import com.Medical.security.security.JwtService;
import com.Medical.services.OrganizationService;

import io.jsonwebtoken.io.IOException;
import jakarta.validation.Valid;

import com.Medical.dao.entities.Doctor;
import com.Medical.dao.entities.Organization;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("organization")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;
    private final JwtService jwtService;

    @PostMapping("/verifyOrganization")
    public ResponseEntity<Organization> verifyOrganization(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody OrganizationVerificationRequest request) {

        // Extract the JWT token from the Authorization header
        String token = authorizationHeader.replace("Bearer ", "");

        // Extract user email from the token
        String userEmail = jwtService.extractUsername(token);

        // Register the organization
        Organization organization = organizationService.verifyOrganization(userEmail, request);

        return ResponseEntity.ok(organization);
    }

    @GetMapping("/profile")
    public ResponseEntity<Organization> getDoctorProfile(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        String userEmail = jwtService.extractUsername(token);
        Organization organization = organizationService.getOrganizationProfile(userEmail).orElse(null);
        return ResponseEntity.ok(organization);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Organization>> getAllOrganizations() {
        List<Organization> organizations = organizationService.getAllOrganization();
        return ResponseEntity.ok(organizations);
    }

    @PostMapping("/upload-profile-image")
    public ResponseEntity<Organization> uploadProfileImage(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("profileImage") MultipartFile profileImage) {

        // Extract the JWT token from the Authorization header
        String token = authorizationHeader.replace("Bearer ", "");

        // Extract user email from the token
        String userEmail = jwtService.extractUsername(token);

        // Upload the profile image
        Organization organization = organizationService.uploadProfileImage(userEmail, profileImage);

        return ResponseEntity.ok(organization);
    }
}

