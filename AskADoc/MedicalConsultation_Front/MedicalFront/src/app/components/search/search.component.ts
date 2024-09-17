import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @Output() searchEvent = new EventEmitter<string>();
  @Output() filterEvent = new EventEmitter<string>();
  @Input() categories: { key: string, value: string }[] = [];
  @Input() placeholder: string = 'Search...';

  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchEvent.emit(searchTerm);
  }

  onFilter(event: Event) {
    const category = (event.target as HTMLSelectElement).value;
    this.filterEvent.emit(category);
  }
}
