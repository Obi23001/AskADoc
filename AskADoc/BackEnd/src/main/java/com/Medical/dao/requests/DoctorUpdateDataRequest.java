package com.Medical.dao.requests;

import com.Medical.security.user.Gender;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorUpdateDataRequest {

    @NotBlank(message = "Speciality is required")
    private String speciality;

    @NotBlank(message = "Education is required")
    private String education;

    @NotBlank(message = "Work place is required")
    private String workPlace;

    private String position;
    private Integer workExperienceYears;
    private String awards;
    private String contactPhone;
    private String contactEmail;
    private String aboutMe;
    private String specializationDetails;
    private String workExperienceDetails;
    private String furtherTraining;
    private String achievementsAndAwards;
    private String scientificWorks;
}
