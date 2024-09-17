import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="flex justify-center">
      <ul class="flex list-none">
        <li *ngFor="let page of pages" class="mx-1">
          <button
            (click)="onPageChange(page)"
            [class.bg-blue-500]="page === currentPage"
            [class.text-white]="page === currentPage"
            class="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            {{ page }}
          </button>
        </li>
      </ul>
    </nav>
  `
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
}