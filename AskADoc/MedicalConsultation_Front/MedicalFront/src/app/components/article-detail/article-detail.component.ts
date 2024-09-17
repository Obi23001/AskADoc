import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  article: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const articleId = this.route.snapshot.paramMap.get('id');
    // Fetch the article details using the articleId
    // For now, we'll just use a placeholder
    this.article = {
      id: articleId,
      title: `Article ${articleId}`,
      author: `Author ${articleId}`,
      date: '2023-01-01',
      summary: `Summary of article ${articleId}`,
      content: `Full content of article ${articleId}`
    };
  }
}
