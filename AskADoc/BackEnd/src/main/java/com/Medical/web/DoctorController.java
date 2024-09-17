package com.Medical.web;

import com.Medical.dao.requests.AnswerRequest;
import com.Medical.dao.requests.DoctorUpdateDataRequest;
import com.Medical.dao.requests.DoctorVerificationRequest;
import com.Medical.security.security.JwtService;
import com.Medical.services.DoctorService;
import com.Medical.services.QuestionService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import com.Medical.dao.entities.Answer;
import com.Medical.dao.entities.Doctor;
import com.Medical.dao.entities.Organization;
import com.Medical.dao.entities.Question;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("doctor")
@RequiredArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;
    private final JwtService jwtService;
    private final QuestionService questionService;

    @PostMapping(value = "/verifyDoctor", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Doctor> verifyDoctor(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestPart("data") @Valid DoctorVerificationRequest request,
            @RequestPart(value = "certificates", required = false) List<MultipartFile> certificates) throws IOException {

        // Extract the JWT token from the Authorization header
        String token = authorizationHeader.replace("Bearer ", "");

        // Extract user email from the token
        String userEmail = jwtService.extractUsername(token);

        // Add certificates to the request
        request.setCertificates(certificates);

        // Verify the doctor
        Doctor doctor = doctorService.verifyDoctor(userEmail, request);

        return ResponseEntity.ok(doctor);
    }

    @GetMapping("/profile")
    public ResponseEntity<Doctor> getDoctorProfile(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        String userEmail = jwtService.extractUsername(token);
        Doctor doctor = doctorService.getDoctorProfile(userEmail);
        return ResponseEntity.ok(doctor);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @PostMapping("/answerQuestion")
    public ResponseEntity<Answer> answerQuestion(@RequestHeader("Authorization") String authorizationHeader,
                                             @RequestBody @Valid AnswerRequest request) {
        String token = authorizationHeader.replace("Bearer ", "");
        String doctorEmail = jwtService.extractUsername(token);
        Answer answer = questionService.answerQuestion(doctorEmail, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(answer);
    }

    @PostMapping("/upload-profile-image")
    public ResponseEntity<Doctor> uploadProfileImage(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("profileImage") MultipartFile profileImage) {

        // Extract the JWT token from the Authorization header
        String token = authorizationHeader.replace("Bearer ", "");

        // Extract user email from the token
        String userEmail = jwtService.extractUsername(token);

        // Upload the profile image
        Doctor doctor = doctorService.uploadProfileImage(userEmail, profileImage);

        return ResponseEntity.ok(doctor);
    }

    @GetMapping("/questions/{questionId}/answers")
    public ResponseEntity<List<Answer>> getAllAnswers(@RequestHeader("Authorization") String authorizationHeader,
                                                  @PathVariable Long questionId) {
        // Extract the JWT token from the Authorization header
        String token = authorizationHeader.replace("Bearer ", "");
        
        // Extract user email from the token
        String doctorEmail = jwtService.extractUsername(token);
        
        // Optionally, you can check if the user is a doctor here if needed
        
        // Fetch the question by ID to ensure it exists
        Question question = questionService.getQuestionById(questionId); // You may need to implement this method
        
        // Get all answers for the question
        List<Answer> answers = questionService.getAllAnswers(question);
        
        return ResponseEntity.ok(answers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Integer id) {
    Optional<Doctor> doctorOpt = doctorService.getDoctorById(id);
    if (doctorOpt.isPresent()) {
        return ResponseEntity.ok(doctorOpt.get());
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}
}
