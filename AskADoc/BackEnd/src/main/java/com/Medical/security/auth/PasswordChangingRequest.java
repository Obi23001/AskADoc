package com.Medical.security.auth;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PasswordChangingRequest {
    @NotNull(message = "Old Password is required")
    @NotBlank(message = "Old Password cannot be blank")
    private String oldPassword;

    @NotNull(message = "New Password is required")
    @NotBlank(message = "New Password cannot be blank")
    @Size(min = 8, message = "Password should be at least 8 characters long")
    private String newPassword;

    @NotNull(message = "Confirm Password is required")
    @NotBlank(message = "Confirm Password cannot be blank")
    private String confirmPassword;
}
