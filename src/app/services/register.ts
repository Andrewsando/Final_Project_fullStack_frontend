import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUserRequest, User, RegisterResponse } from '../interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:8000/api/users';

  constructor(private http: HttpClient) { }

  createUser(userData: CreateUserRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/create/`, userData);
  }

  checkEmailExists(email: string): Observable<{exists: boolean}> {
    return this.http.get<{exists: boolean}>(`${this.apiUrl}/check-email?email=${email}`);
  }
}