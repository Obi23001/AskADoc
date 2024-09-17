import { Component } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AskQuestionComponent {
  questionForm: FormGroup;

  constructor(
    private questionService: QuestionService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      category: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      keyword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.questionForm.valid) {
      console.log('Sending question:', this.questionForm.value);
      this.questionService.askQuestion(this.questionForm.value).subscribe({
        next: (response) => {
          console.log('Question asked successfully', response);
          console.log('Question details:', {
            category: response.category,
            title: response.title,
            description: response.description,
            keyword: response.keyword,
            createdDate: response.createdDate
          });
          this.questionForm.reset();
        },
        error: (error) => {
          console.error('Error asking question', error);
          if (error.message === 'No authentication token found') {
            console.error('User not authenticated. Redirecting to login page.');
            this.router.navigate(['/login']);
          } else if (error instanceof ErrorEvent) {
            console.error('Client-side error:', error.error.message);
          } else if (error.status === 0) {
            console.error('Network error. Please check your internet connection and try again.');
            console.error('Error details:', error);
          } else {
            console.error(`Backend returned code ${error.status}, body was:`, error.error);
          }
        }
      });
    }
  }
}
