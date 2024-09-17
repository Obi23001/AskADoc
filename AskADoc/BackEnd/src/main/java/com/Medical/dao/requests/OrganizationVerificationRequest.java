package com.Medical.dao.requests;

import com.Medical.dao.enums.OrganizationTypes;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Builder
public class OrganizationVerificationRequest {
    @NotBlank(message = "Organization name is required")
    private String organizationName;

    @NotNull(message = "Type of institution is required")
    private OrganizationTypes typeOfInstitution;

    @Size(min = 50, message = "Description must exceed 70 characters")
    private String description;

    @NotBlank(message = "Facility city is required")
    private String facilityCity;

    @NotBlank(message = "Facility address is required")
    private String facilityAddress;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    private String schedule;

    @Size(max = 100, message = "Website URL must not exceed 100 characters")
    private String website;

    @Email(message = "Facility email address must be a valid email address")
    private String facilityEmailAddress;

}
