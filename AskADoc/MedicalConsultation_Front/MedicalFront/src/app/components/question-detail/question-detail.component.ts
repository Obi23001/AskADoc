import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { CommonModule } from '@angular/common';
import { AnswerQuestionComponent } from '../answer-question/answer-question.component';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.css'],
  standalone: true,
  imports: [CommonModule, AnswerQuestionComponent]
})
export class QuestionDetailComponent implements OnInit {
  question: any;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadQuestion(+id);
    }
  }

  loadQuestion(id: number) {
    this.questionService.getQuestionById(id).subscribe(
      question => {
        this.question = question;
      },
      error => {
        console.error('Error loading question', error);
      }
    );
  }
}
