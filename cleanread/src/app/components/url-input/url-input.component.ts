import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-url-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './url-input.component.html',
  styleUrls: ['./url-input.component.css']
})
export class UrlInputComponent {
  @Output() urlSubmitted = new EventEmitter<string>();
  
  url: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  /**
   * Handles form submission
   * @param event The form submit event
   */
  onSubmit(event: Event): void {
    event.preventDefault();
    
    if (!this.url.trim()) {
      this.errorMessage = 'Please enter a URL';
      return;
    }

    // Basic URL validation
    if (!this.isValidUrl(this.url)) {
      this.errorMessage = 'Please enter a valid URL (e.g., https://example.com)';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;
    this.urlSubmitted.emit(this.url.trim());
  }

  /**
   * Clears the form and error message
   */
  clearForm(): void {
    this.url = '';
    this.errorMessage = '';
  }

  /**
   * Sets loading state (called by parent component)
   * @param loading The loading state
   */
  setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  /**
   * Sets error message (called by parent component)
   * @param error The error message
   */
  setError(error: string): void {
    this.errorMessage = error;
    this.isLoading = false;
  }

  /**
   * Validates if the provided string is a valid URL
   * @param url The URL string to validate
   * @returns boolean indicating if URL is valid
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
} 