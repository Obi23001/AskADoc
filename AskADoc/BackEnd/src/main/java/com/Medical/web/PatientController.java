package com.Medical.web;

import com.Medical.dao.entities.Doctor;
import com.Medical.dao.entities.Organization;
import com.Medical.dao.entities.Patient;
import com.Medical.dao.entities.Question;
import com.Medical.dao.requests.QuestionRequest;
import com.Medical.security.security.JwtService;
import com.Medical.services.PatientService;
import com.Medical.services.QuestionService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("patient")
@RequiredArgsConstructor
public class PatientController {

    private final QuestionService questionService;
    private final JwtService jwtService;
    private final PatientService patientService;

    @PostMapping("/askAQuestion")
    public ResponseEntity<Question> askAQuestion(@RequestHeader("Authorization") String authorizationHeader,
                                                @RequestBody QuestionRequest request) {
        System.out.println("Received askAQuestion request");
        System.out.println("Authorization header: " + authorizationHeader);
        System.out.println("Question request: " + request);

        // Extract the JWT token from the Authorization header
        String token = authorizationHeader.replace("Bearer ", "");

        // Extract user email from the token
        String userEmail = jwtService.extractUsername(token);
        System.out.println("User email extracted from token: " + userEmail);
                                                
        // Ask a question
        Question question = questionService.askAQuestion(userEmail, request);
        System.out.println("Question created: " + question);

        return ResponseEntity.status(HttpStatus.CREATED).body(question);
    }

    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getAllQuestions(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        String userEmail = jwtService.extractUsername(token);
        List<Question> questions = questionService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/upload-profile-image")
    public ResponseEntity<Patient> uploadProfileImage(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("profileImage") MultipartFile profileImage) {

        // Extract the JWT token from the Authorization header
        String token = authorizationHeader.replace("Bearer ", "");

        // Extract user email from the token
        String userEmail = jwtService.extractUsername(token);

        // Upload the profile image
        Patient patient = patientService.uploadProfileImage(userEmail, profileImage);

        return ResponseEntity.ok(patient);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Integer id) {
    Optional<Patient> patientOpt = patientService.getPatientById(id);
    if (patientOpt.isPresent()) {
        return ResponseEntity.ok(patientOpt.get());
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}
}
