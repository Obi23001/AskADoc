import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service'; 
import { PatientService } from '../../services/PatientService'; 
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MedicalCategories } from '../../models/medical-categories';
import { MedicalCategoriesDisplay } from '../../models/medical-categories-display';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class QuestionListComponent implements OnInit {
  questions: any[] = [];
  questionForm: FormGroup;
  answerForm: FormGroup;
  showPopup: boolean = false;
  isDoctor: boolean = false;
  isPatient: boolean = false;
  medicalCategories = Object.values(MedicalCategories);
  medicalCategoriesDisplay = MedicalCategoriesDisplay;

  constructor(
    private questionService: QuestionService,
    private patientService: PatientService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.questionForm = this.fb.group({
      category: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      keyword: ['', Validators.required]
    });
    this.answerForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log('QuestionListComponent initialized');
    if (typeof window !== 'undefined') {
      this.loadQuestions();
      this.isDoctor = this.authService.getUserRole() === 'DOCTOR';
      this.isPatient = this.authService.getUserRole() === 'PATIENT';
    }
  }

  loadAnswers(questionId: number) {
    console.log(`Attempting to load answers for question ID: ${questionId}`);
    this.questionService.loadAnswers(questionId).subscribe({
        next: (answers: any[]) => {
            console.log(`Answers loaded for question ID ${questionId}:`, answers);
            const question = this.questions.find(q => q.id === questionId);
            if (question) {
                question.answers = answers; // Assign the loaded answers to the question

                // Load doctor details for each answer
                question.answers.forEach((answer: any) => {
                    if (answer.doctorId) {
                        console.log(`Loading doctor details for doctor ID: ${answer.doctorId}`);
                        this.questionService.getDoctorById(answer.doctorId).subscribe({
                            next: (doctor: any) => {
                                answer.doctor = doctor; // Assign the doctor data to the answer
                                console.log(`Doctor details loaded for answer:`, doctor);
                            },
                            error: (error: any) => {
                                console.error('Error loading doctor', error);
                            }
                        });
                    } else {
                        answer.doctor = { name: 'Anonymous' }; // Default to 'Anonymous' if no doctorId
                        console.log('No doctorId found for answer, setting to Anonymous');
                    }
                });
            } else {
                console.warn(`Question with ID ${questionId} not found in the questions list.`);
            }
        },
        error: (error: any) => {
            console.error('Error loading answers', error);
        }
    });
  }

  toggleAnswerView(question: any) {
    console.log(`Toggling answer view for question ID: ${question.id}`);
    console.log(`Current showAnswer: ${question.showAnswer}, Current answers: ${question.answers}`);

    // Toggle the visibility of the answers
    question.showAnswer = !question.showAnswer;

    // Always load answers if showing them
    if (question.showAnswer) {
      this.loadAnswers(question.id); // Load answers if they are being shown
  }
}

  openAskQuestionPopup() {
    this.showPopup = true;
  }

  closeAskQuestionPopup() {
    this.showPopup = false;
  }

  toggleAnswerForm(question: any) {
    question.showAnswerForm = !question.showAnswerForm;
  }

  onSubmitAnswer(questionId: number) {
    if (this.answerForm.valid) {
      const answerRequest = {
        questionId: questionId,
        content: this.answerForm.get('content')?.value
      };

      this.questionService.answerQuestion(answerRequest).subscribe({
        next: (response: any) => { // Specify the type of response
          console.log('Answer submitted successfully', response);
          this.answerForm.reset();
          this.loadQuestions(); // Reload questions to show the new answer
        },
        error: (error: any) => {
          console.error('Error submitting answer', error);
        }
      });
    }
  }

  loadQuestions() {
    this.patientService.getQuestionsWithPatients().subscribe({
      next: (questions: any) => {
        console.log('Questions with Patients API Response:', questions);
        this.questions = questions;

        // Load patient details for each question
        this.questions.forEach(question => {
          if (question.patientId) {
            this.patientService.getPatientById(question.patientId).subscribe({
              next: (patient: any) => {
                question.patient = patient; // Assign the patient data to the question
                console.log('Patient First Name:', patient.firstName); // Log the patient's first name
              },
              error: (error: any) => {
                console.error('Error loading patient', error);
              }
            });
          } else {
            console.log('No patientId for question:', question);
          }

          // Ensure question.category is typed correctly
          const categoryKey = question.category as keyof typeof MedicalCategoriesDisplay;
          question.categoryDisplay = MedicalCategoriesDisplay[categoryKey];
        });
      },
      error: (error: any) => {
        console.error('Error loading questions', error);
      }
    });
  }

  onSubmit() {
    if (this.questionForm.valid) {
      console.log('Sending question:', this.questionForm.value);
      this.questionService.askQuestion(this.questionForm.value).subscribe({
        next: (response: any) => {
          console.log('Question asked successfully', response);
          this.questionForm.reset();
          this.loadQuestions(); // Reload questions after asking a new one
          this.closeAskQuestionPopup(); // Close the popup after submission
        },
        error: (error: any) => {
          console.error('Error asking question', error);
        }
      });
    }
  }
}