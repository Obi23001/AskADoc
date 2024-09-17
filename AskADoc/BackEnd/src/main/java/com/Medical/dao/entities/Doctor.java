package com.Medical.dao.entities;

import com.Medical.dao.enums.MedicalCategories;
import com.Medical.security.role.Role;
import com.Medical.security.user.Gender;
import com.Medical.security.user.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "doctor_id")
public class Doctor extends User {

    private MedicalCategories speciality;
    private String education;
    private String workPlace;
    private String position;
    private int workExperienceYears;
    private String awards;
    private String contactPhone;
    private String contactEmail;
    private String aboutMe;
    private String specializationDetails;
    private String workExperienceDetails;
    private String furtherTraining;
    private String achievementsAndAwards;
    private String scientificWorks;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Certificate> certificates;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Answer> answers;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Comment> comments;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Post> posts;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<HistoryOperations> historyOperations;

    @Builder
    public Doctor(Integer id, String firstName, String lastName, LocalDate dateOfBirth,
                  String email, String password, String city, Gender gender, List<Role> roles, boolean accountLocked,
                  boolean enabled, boolean verified, byte[] profileImage, LocalDate createdDate, LocalDate lastModifiedDate,
                  MedicalCategories speciality, String education, String workPlace, String position, int workExperienceYears,
                  String awards, String contactPhone, String contactEmail,
                  String aboutMe, String specializationDetails,
                  String workExperienceDetails, String furtherTraining, String achievementsAndAwards, String scientificWorks,
                  List<Certificate> certificates) {
        super(id, firstName, lastName, dateOfBirth, email, password, city, gender, roles, accountLocked,
                enabled, verified, profileImage, createdDate, lastModifiedDate);
        this.speciality = speciality;
        this.education = education;
        this.workPlace = workPlace;
        this.position = position;
        this.workExperienceYears = workExperienceYears;
        this.awards = awards;
        this.contactPhone = contactPhone;
        this.contactEmail = contactEmail;
        this.aboutMe = aboutMe;
        this.specializationDetails = specializationDetails;
        this.workExperienceDetails = workExperienceDetails;
        this.furtherTraining = furtherTraining;
        this.achievementsAndAwards = achievementsAndAwards;
        this.scientificWorks = scientificWorks;
        this.certificates = certificates;
    }
}
