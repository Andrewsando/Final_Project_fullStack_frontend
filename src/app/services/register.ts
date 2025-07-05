import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreateUserRequest, User, RegisterResponse } from '../interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:8000/api/users';

  constructor(private http: HttpClient) { }

  createUser(userData: CreateUserRequest): Observable<RegisterResponse> {
    console.log('RegisterService - sending data:', userData);
    console.log('RegisterService - data keys:', Object.keys(userData));
    console.log('RegisterService - endpoint:', `${this.apiUrl}/create/`);
    
    return this.http.post<RegisterResponse>(`${this.apiUrl}/create/`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  checkEmailExists(email: string): Observable<{exists: boolean}> {
    return this.http.get<{exists: boolean}>(`${this.apiUrl}/check-email?email=${email}`);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('RegisterService Error:', error);
    console.error('Error status:', error.status);
    console.error('Error message:', error.message);
    console.error('Error body:', error.error);
    console.error('Error headers:', error.headers);
    
    if (error.status === 0) {
      console.error('Network error - server might be down or CORS issue');
    } else if (error.status === 404) {
      console.error('Endpoint not found - check if /api/users/create/ exists');
    } else if (error.status >= 400 && error.status < 500) {
      console.error('Client error:', error.status);
    } else if (error.status >= 500) {
      console.error('Server error:', error.status);
    }
    
    return throwError(() => error);
  }
}