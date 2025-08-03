import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UrlInputComponent } from './components/url-input/url-input.component';
import { ReaderViewComponent } from './components/reader-view/reader-view.component';
import { ArticleService } from './services/article.service';
import { Article } from './models/article.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, UrlInputComponent, ReaderViewComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentArticle: Article | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  fontSize: number = 18;
  theme: 'light' | 'dark' = 'light';

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.theme = 'dark';
      document.documentElement.classList.add('dark');
    }

    // Check for saved font size preference
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      this.fontSize = parseInt(savedFontSize);
    }
  }

  /**
   * Handles URL submission from URLInputComponent
   * @param url The submitted URL
   */
  onUrlSubmitted(url: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.currentArticle = null;

    this.articleService.getArticle(url).subscribe({
      next: (article) => {
        this.currentArticle = article;
        this.isLoading = false;
        // Scroll to reader view
        setTimeout(() => {
          document.querySelector('#reader-view')?.scrollIntoView({ 
            behavior: 'smooth' 
          });
        }, 100);
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  /**
   * Handles font size changes from ReaderViewComponent
   * @param size The new font size
   */
  onFontSizeChange(size: number): void {
    this.fontSize = size;
    localStorage.setItem('fontSize', size.toString());
  }

  /**
   * Handles theme changes from ReaderViewComponent
   * @param theme The new theme
   */
  onThemeChange(theme: 'light' | 'dark'): void {
    this.theme = theme;
    localStorage.setItem('theme', theme);
  }

  /**
   * Clears the current article and error state
   */
  clearArticle(): void {
    this.currentArticle = null;
    this.errorMessage = '';
  }
} 