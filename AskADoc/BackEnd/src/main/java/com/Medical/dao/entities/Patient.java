package com.Medical.dao.entities;

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
@PrimaryKeyJoinColumn(name = "patient_id")
public class Patient extends User {

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Question> questions;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Comment> comments;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Post> posts;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<HistoryOperations> historyOperations;

    @Builder
    public Patient(Integer id, String firstName, String lastName, LocalDate dateOfBirth,
                   String email, String password, String city, Gender gender, List<Role> roles, boolean accountLocked,
                   boolean enabled, boolean verified, byte[] profileImage, LocalDate createdDate, LocalDate lastModifiedDate) {
        super(id, firstName, lastName, dateOfBirth, email, password, city, gender, roles, accountLocked,
                enabled, verified, profileImage, createdDate, lastModifiedDate);
    }
}
