package com.Medical.dao.entities;

import com.Medical.dao.enums.OrganizationTypes;
import com.Medical.security.role.Role;
import com.Medical.security.user.Gender;
import com.Medical.security.user.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "organization_id")
public class Organization extends User {

    private String organizationName;
    private OrganizationTypes typeOfInstitution;
    @Lob
    private String description;
    private String facilityCity;
    private String facilityAddress;
    private String phoneNumber;
    private String schedule;
    private String website;
    private String facilityEmailAddress;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Comment> comments;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Post> posts;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<HistoryOperations> historyOperations;

    @Builder
    public Organization(Integer id, String firstName, String lastName, LocalDate dateOfBirth,
                        String email, String password, String city, Gender gender, List<Role> roles, boolean accountLocked,
                        boolean enabled, boolean verified, byte[] profileImage, LocalDate createdDate, LocalDate lastModifiedDate,
                        String organizationName, OrganizationTypes typeOfInstitution, String description,
                        String facilityCity, String facilityAddress, String phoneNumber,
                        String schedule, String website, String facilityEmailAddress) {
        super(id, firstName, lastName, dateOfBirth, email, password, city, gender, roles, accountLocked,
                enabled, verified, profileImage, createdDate, lastModifiedDate);
        this.organizationName = organizationName;
        this.typeOfInstitution = typeOfInstitution;
        this.description = description;
        this.facilityCity = facilityCity;
        this.facilityAddress = facilityAddress;
        this.phoneNumber = phoneNumber;
        this.schedule = schedule;
        this.website = website;
        this.facilityEmailAddress = facilityEmailAddress;
    }
}

