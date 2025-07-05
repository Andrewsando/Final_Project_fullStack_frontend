import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginRequest } from '../interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8000/api/users'; 

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<any> {
    console.log('LoginService - sending data:', data);
    console.log('LoginService - endpoint:', `${this.apiUrl}/login/`);
    
    return this.http.post<any>(`${this.apiUrl}/login/`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Test endpoint connectivity
  testConnection(): Observable<any> {
    console.log('Testing connection to:', this.apiUrl);
    return this.http.get<any>(`${this.apiUrl}/`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('LoginService Error:', error);
    console.error('Error status:', error.status);
    console.error('Error message:', error.message);
    console.error('Error body:', error.error);
    
    if (error.status === 0) {
      console.error('Network error - server might be down or CORS issue');
    } else if (error.status === 404) {
      console.error('Endpoint not found - check if /api/users/login/ exists');
    } else if (error.status >= 400 && error.status < 500) {
      console.error('Client error:', error.status);
    } else if (error.status >= 500) {
      console.error('Server error:', error.status);
    }
    
    return throwError(() => error);
  }
}