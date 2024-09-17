package com.Medical.security.auth;

import com.Medical.dao.entities.Doctor;
import com.Medical.dao.entities.Organization;
import com.Medical.dao.entities.Patient;
import com.Medical.security.email.EmailService;
import com.Medical.security.email.EmailTemplateName;
import com.Medical.security.handler.EmailAlreadyExistsException;
import com.Medical.security.handler.UserNotEnabledException;
import com.Medical.security.role.Role;
import com.Medical.security.role.RoleRepository;
import com.Medical.security.security.JwtService;
import com.Medical.security.user.Token;
import com.Medical.security.user.TokenRepository;
import com.Medical.security.user.User;
import com.Medical.security.user.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;

    public void registerDoctor(RegistrationRequest request) throws MessagingException {
        registerUser(request, "DOCTOR");
    }

    public void registerPatient(RegistrationRequest request) throws MessagingException {
        registerUser(request, "PATIENT");
    }

    public void registerOrganization(RegistrationRequest request) throws MessagingException {
        registerUser(request, "ORGANIZATION");
    }

    private void registerUser(RegistrationRequest request, String roleName) throws MessagingException {
        var role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalStateException("ROLE " + roleName + " NOT FOUND"));

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        User user = buildUserBasedOnRole(roleName, request, role);
        userRepository.save(user);
        sendValidationEmail(user);
    }

    private User buildUserBasedOnRole(String roleName, RegistrationRequest request, Role role) {
        if (request.getGender() == null) {
            throw new IllegalArgumentException("Gender is required and must be either MALE or FEMALE");
        }

        switch (roleName) {
            case "DOCTOR":
                return Doctor.builder()
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .accountLocked(false)
                        .enabled(false)
                        .roles(List.of(role))
                        .dateOfBirth(request.getDateOfBirth())
                        .city(request.getCity())
                        .gender(request.getGender())
                        .build();
            case "PATIENT":
                return Patient.builder()
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .accountLocked(false)
                        .enabled(false)
                        .verified(true)
                        .roles(List.of(role))
                        .dateOfBirth(request.getDateOfBirth())
                        .city(request.getCity())
                        .gender(request.getGender())
                        .build();
            case "ORGANIZATION":
                return Organization.builder()
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .accountLocked(false)
                        .enabled(false)
                        .roles(List.of(role))
                        .dateOfBirth(request.getDateOfBirth())
                        .city(request.getCity())
                        .gender(request.getGender())
                        .build();
            default:
                throw new IllegalArgumentException("Invalid role: " + roleName);
        }
    }

    public void passwordChanging(String userEmail, PasswordChangingRequest request) {
        // Find Connected User
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if old Password and User's Password Match
        if (request.getOldPassword().equals(request.getNewPassword())) {
            throw new IllegalArgumentException("New password matches the old one");
        }

        // Check if both passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        // Check if old password matches user's password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Old password incorrect");
        }

        // Encode the new password and update it
        String newPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(newPassword);
        userRepository.save(user);
    }


    private void sendValidationEmail(User user) throws MessagingException {
        var newToken = generateAndSaveActivationToken(user);
        System.out.println("Generated Activation Token: " + newToken);
        emailService.sendEmail(
                user.getEmail(),
                user.getFullName(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "Account Activation"
        );
    }

    private String generateAndSaveActivationToken(User user) {
        String generatedToken = generateActivationCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .user(user)
                .build();
        System.out.println("Generated Token: " + generatedToken);
        System.out.println("Token Details: " + token);
        try {
            tokenRepository.save(token);
            System.out.println("Token saved to database.");
        } catch (Exception e) {
            System.err.println("Error saving token to database: " + e.getMessage());
        }
        return generatedToken;
    }



    /**
     * This method generates a code to be sent by mail
     */
    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        SecureRandom secureRandom = new SecureRandom();
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }
        return codeBuilder.toString();
    }

    @Transactional
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            var user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            var auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            var claims = new HashMap<String, Object>();
            user = (User) auth.getPrincipal();
            claims.put("fullName", user.getFullName());
            var jwtToken = jwtService.generateToken(claims, user);

            // Log the token
            System.out.println("Generated JWT Token: " + jwtToken);

            tokenRepository.deleteByUser(user);

            // Save the JWT token in the repository
            var token = Token.builder()
                    .token(jwtToken)
                    .createdAt(LocalDateTime.now())
                    .expiresAt(null) // Adjust the expiry as needed
                    .user(user)
                    .build();

            tokenRepository.save(token);

            return AuthenticationResponse.builder().token(jwtToken).build();
        } catch (BadCredentialsException e) {
            // Throw a specific BadCredentialsException with a custom message
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    public void enableUser(User user){
            // Send validation email if not enabled
        try {
            sendValidationEmail(user);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send validation email", e);
        }
        throw new UserNotEnabledException("User account is not enabled. Activation email has been sent.");
    }

    public void activateAccount(String token) throws MessagingException {
        Token savedToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> {
                    System.err.println("Token not found: " + token); // Log token issue
                    return new RuntimeException("Invalid Token");
                });

        System.out.println("Retrieved Token: " + savedToken.getToken()); // Log token details

        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired. A new Token has been sent");
        }

        var user = userRepository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> {
                    System.err.println("User not found for token: " + savedToken.getToken()); // Log user issue
                    return new UsernameNotFoundException("User Not Found");
                });

        user.setEnabled(true);
        userRepository.save(user);
        savedToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);
    }

    public User getUserProfile(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
