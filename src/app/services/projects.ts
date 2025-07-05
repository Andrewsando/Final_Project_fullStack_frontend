import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Project, ProjectsResponse, CreateProjectRequest } from '../interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private readonly baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getUserProjects(): Observable<Project[]> {
    const user = this.getCurrentUser();
    
    if (!user?.id) {
      throw new Error('User ID not found');
    }

    const headers = this.getAuthHeaders();
    console.log('Getting user projects for user ID:', user.id);
    console.log('Endpoint:', `${this.baseUrl}/project/user/${user.id}/`);
    
    return this.http.get<Project[]>(`${this.baseUrl}/project/user/${user.id}/`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllProjects(): Observable<ProjectsResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<ProjectsResponse>(`${this.baseUrl}/projects/`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  createProject(projectData: CreateProjectRequest): Observable<Project> {
    const headers = this.getAuthHeaders();
    console.log('Creating project:', projectData);
    console.log('Endpoint:', `${this.baseUrl}/project/`);
    
    return this.http.post<Project>(`${this.baseUrl}/project/`, projectData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return null;
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    console.log('Using auth token:', token ? 'Token present' : 'No token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('ProjectsService Error:', error);
    console.error('Error status:', error.status);
    console.error('Error message:', error.message);
    console.error('Error body:', error.error);
    
    if (error.status === 0) {
      console.error('Network error - server might be down or CORS issue');
    } else if (error.status === 404) {
      console.error('Endpoint not found - check if the API endpoint exists');
    } else if (error.status === 401) {
      console.error('Unauthorized - check if token is valid');
    } else if (error.status >= 400 && error.status < 500) {
      console.error('Client error:', error.status);
    } else if (error.status >= 500) {
      console.error('Server error:', error.status);
    }
    
    return throwError(() => error);
  }
}
