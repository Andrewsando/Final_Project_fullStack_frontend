import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<Project[]>(`${this.baseUrl}/project/user/${user.id}/`, { headers });
  }

  getAllProjects(): Observable<ProjectsResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<ProjectsResponse>(`${this.baseUrl}/projects/`, { headers });
  }

  createProject(projectData: CreateProjectRequest): Observable<Project> {
    const headers = this.getAuthHeaders();
    return this.http.post<Project>(`${this.baseUrl}/project/`, projectData, { headers });
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
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
