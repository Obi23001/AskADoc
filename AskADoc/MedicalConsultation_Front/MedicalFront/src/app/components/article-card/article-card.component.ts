import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.css'
})
export class ArticleCardComponent {
  @Input() title!: string;
  @Input() author!: string;
  @Input() date!: string;
  @Input() summary!: string;
  @Input() category!: string;
}
