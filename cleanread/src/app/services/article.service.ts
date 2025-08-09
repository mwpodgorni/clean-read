import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Article } from '../models/article.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  // Replace this with your actual Firebase function URL
  private readonly apiUrl = 'http://127.0.0.1:5001/cleanred-79d9e/us-central1/scrapeArticle';
  // private readonly apiUrl = 'https://your-firebase-function-url.cloudfunctions.net/scrapeArticle';

  constructor(private http: HttpClient) {}

  /**
   * Fetches readable article content from a given URL
   * @param url The URL of the article to scrape
   * @returns Observable of Article data
   */
  getArticle(url: string): Observable<Article> {
    // Validate URL
    if (!this.isValidUrl(url)) {
      return throwError(() => new Error('Please enter a valid URL'));
    }

    const params = new HttpParams().set('url', url);

    return this.http.get<Article>(this.apiUrl, { params }).pipe(
      map(article => {
        // Calculate reading time (average reading speed: 200 words per minute)
        const wordCount = article.content.split(/\s+/).length;
        article.readingTime = Math.ceil(wordCount / 200);
        return article;
      }),
      catchError(error => {
        console.error('Error fetching article:', error);
        if (error.status === 0) {
          return throwError(() => new Error('Network error. Please check your connection.'));
        } else if (error.status === 400) {
          return throwError(() => new Error('Invalid URL provided.'));
        } else if (error.status === 404) {
          return throwError(() => new Error('Article not found or not accessible.'));
        } else if (error.status === 403) {
          return throwError(() => new Error('Access denied. This site may block scraping.'));
        } else {
          return throwError(() => new Error('Failed to fetch article. Please try again.'));
        }
      })
    );
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