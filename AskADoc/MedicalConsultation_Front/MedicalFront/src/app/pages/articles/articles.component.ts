import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from '../../components/pagination/pagination.component';

interface Article {
  id: number;
  title: string;
  author: string;
  date: string;
  summary: string;
  category: string;
  imageUrl: string;
}

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [PaginationComponent, CommonModule, RouterModule],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  articles: Article[] = [
    { id: 1, title: 'Understanding Diabetes', author: 'Dr. John Doe', date: '2023-05-01', summary: 'An in-depth look into managing and understanding diabetes, its symptoms, and treatment options.', category: 'Endocrinology', imageUrl: 'https://as1.ftcdn.net/v2/jpg/02/76/20/56/1000_F_276205639_zXwXmtHSonG36a9pXiF2mYI6pBTIIMc8.jpg' },
    { id: 2, title: 'Heart Health Tips', author: 'Dr. Jane Smith', date: '2023-05-15', summary: 'Essential tips and advice on maintaining a healthy heart and preventing heart diseases.', category: 'Cardiology', imageUrl: 'https://as1.ftcdn.net/v2/jpg/02/55/91/22/1000_F_255912251_vAQv7KTZbStZSSyL2bC3aZIVD3vWdmCO.jpg' },
    { id: 3, title: 'Cancer Treatment Advances', author: 'Dr. Michael Johnson', date: '2023-06-01', summary: 'Latest advancements in cancer treatment, research breakthroughs, and patient care.', category: 'Oncology', imageUrl: 'https://as2.ftcdn.net/v2/jpg/08/33/89/25/1000_F_833892556_O62E7v2DDqljJcOsNetUXmJN2NGVr2xg.jpg' },
    { id: 4, title: 'Mental Health Awareness', author: 'Dr. Emily Brown', date: '2023-06-15', summary: 'Understanding the importance of mental health and strategies for maintaining emotional well-being.', category: 'Psychiatry', imageUrl: 'https://as1.ftcdn.net/v2/jpg/07/57/33/22/1000_F_757332277_dR4dtJWZAu47nSrBauVgJy5FUtRd1sH5.jpg' },
    { id: 5, title: 'Nutrition and Diet', author: 'Dr. David Wilson', date: '2023-07-01', summary: 'Exploring the role of nutrition in overall health and tips for maintaining a balanced diet.', category: 'Nutrition', imageUrl: 'https://as1.ftcdn.net/v2/jpg/02/77/22/76/1000_F_277227681_tG6Y5NNQo7Jji61nCFya2fxbTunku78d.jpg' },
    { id: 6, title: 'Pediatric Care Essentials', author: 'Dr. Sarah Lee', date: '2023-07-15', summary: 'Key aspects of pediatric care and child health management for parents and caregivers.', category: 'Pediatrics', imageUrl: 'https://as1.ftcdn.net/v2/jpg/04/08/48/26/1000_F_408482658_k7t25kX0vuzYMNSi7R5U3m6eloxT7tFh.jpg' },
  ];

  displayedArticles: Article[] = [];
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;

  ngOnInit() {
    this.updatePagedArticles();
  }

  updatePagedArticles() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedArticles = this.articles.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.articles.length / this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagedArticles();
  }
}
