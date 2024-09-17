package com.Medical.security.auth;

import com.Medical.security.user.Gender;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class RegistrationRequest {
    @NotNull(message = "First Name Required")
    @NotBlank(message = "First Name Required")
    private String firstName;
    @NotNull(message = "Last Name Required")
    @NotBlank(message = "Last Name Required")
    private String lastName;
    @NotNull(message = "Email Required")
    @NotBlank(message = "Email Required")
    @Email(message = "Email is not well formatted")
    private String email;
    @NotNull(message = "Password Required")
    @NotBlank(message = "Password Required")
    @Size(min = 8, message = "Password Should Be 8 Characters Long Minimum")
    private String password;
    @NotNull(message = "Date of Birth Required")
    @Past(message = "Date of Birth must be in the past")
    private LocalDate dateOfBirth;
    @NotNull(message = "Gender Required")
    private Gender gender;
    @NotNull(message = "City Required")
    @NotBlank(message = "City Required")
    private String city;
}


