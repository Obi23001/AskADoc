import { Component, Input } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-answer-question',
  templateUrl: './answer-question.component.html',
  styleUrls: ['./answer-question.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule]
})
export class AnswerQuestionComponent {
  @Input() questionId!: number;
  answerForm: FormGroup;

  constructor(private questionService: QuestionService, private fb: FormBuilder) {
    this.answerForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.answerForm.valid) {
      const answerRequest = {
        questionId: this.questionId,
        content: this.answerForm.get('content')?.value
      };

      this.questionService.answerQuestion(answerRequest).subscribe(
        response => {
          console.log('Answer submitted successfully', response);
          // Reset form or update the question detail view
          this.answerForm.reset();
        },
        error => {
          console.error('Error submitting answer', error);
        }
      );
    }
  }
}
