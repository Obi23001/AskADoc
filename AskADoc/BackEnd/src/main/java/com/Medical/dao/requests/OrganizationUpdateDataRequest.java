package com.Medical.dao.requests;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizationUpdateDataRequest {
    private String organizationName;
    private String typeOfInstitution;
    private String description;
    private String facilityCity;
    private String facilityAddress;
    private String phoneNumber;
    private String schedule;
    private String website;
    private String facilityEmailAddress;
}
