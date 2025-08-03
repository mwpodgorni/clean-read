import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Article } from '../../models/article.interface';

@Component({
  selector: 'app-reader-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reader-view.component.html',
  styleUrls: ['./reader-view.component.css']
})
export class ReaderViewComponent {
  @Input() article: Article | null = null;
  @Input() isLoading: boolean = false;
  @Output() fontSizeChange = new EventEmitter<number>();
  @Output() themeChange = new EventEmitter<'light' | 'dark'>();

  fontSize: number = 18;
  theme: 'light' | 'dark' = 'light';
  showControls: boolean = false;

  /**
   * Handles font size slider changes
   * @param event The input event
   */
  onFontSizeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.fontSize = parseInt(target.value);
    this.fontSizeChange.emit(this.fontSize);
  }

  /**
   * Toggles between light and dark theme
   */
  toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.themeChange.emit(this.theme);
    
    // Update document class for global theme
    if (this.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  /**
   * Toggles the visibility of reading controls
   */
  toggleControls(): void {
    this.showControls = !this.showControls;
  }

  /**
   * Formats the reading time for display
   * @param minutes The reading time in minutes
   * @returns Formatted reading time string
   */
  formatReadingTime(minutes: number): string {
    if (minutes < 1) {
      return 'Less than 1 min read';
    } else if (minutes === 1) {
      return '1 min read';
    } else {
      return `${minutes} min read`;
    }
  }

  /**
   * Formats the published date for display
   * @param dateString The date string
   * @returns Formatted date string
   */
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  }
} 