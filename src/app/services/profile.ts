import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User, UpdateProfileRequest, UpdateProfileResponse } from '../interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8000/api/users';

  constructor(private http: HttpClient) { }

  private getUserId(): number {
    const userString = localStorage.getItem('user');
    
    if (!userString) {
      throw new Error('User not found in localStorage');
    }
    
    const user = JSON.parse(userString);
    
    if (!user.id) {
      throw new Error('User ID not found');
    }
    
    return user.id;
  }

  updateProfile(userData: UpdateProfileRequest): Observable<UpdateProfileResponse> {
    const token = localStorage.getItem('access_token');
    const userId = this.getUserId();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const filteredData: any = {};
    
    if (userData.name && typeof userData.name === 'string' && userData.name.trim().length > 0) {
      filteredData.name = userData.name.trim();
    }
    
    if (userData.email && typeof userData.email === 'string' && userData.email.trim().length > 0) {
      filteredData.email = userData.email.trim();
    }
    
    if (userData.password && typeof userData.password === 'string' && userData.password.trim().length > 0) {
      filteredData.password = userData.password.trim();
    }

    const fieldsToUpdate = Object.keys(filteredData).length;
    
    if (fieldsToUpdate === 0) {
      throw new Error('No fields to update');
    } else if (fieldsToUpdate < 3) {
      return this.http.patch<UpdateProfileResponse>(`${this.apiUrl}/${userId}/`, filteredData, { headers })
        .pipe(
          catchError(this.handleError.bind(this))
        );
    } else {
      return this.http.put<UpdateProfileResponse>(`${this.apiUrl}/${userId}/`, filteredData, { headers })
        .pipe(
          catchError(this.handleError.bind(this))
        );
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }

  uploadProfilePhoto(photo: File): Observable<any> {
    const token = localStorage.getItem('access_token');
    const userId = this.getUserId();
    const formData = new FormData();
    formData.append('photo', photo);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/${userId}/photo/`, formData, { headers });
  }
}
