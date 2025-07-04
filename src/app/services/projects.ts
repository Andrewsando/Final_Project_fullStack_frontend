import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectsResponse } from '../interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private apiUrl = 'http://localhost:8000/api/projects';

  constructor(private http: HttpClient) { }

  getUserProjects(): Observable<ProjectsResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<ProjectsResponse>(`${this.apiUrl}/user-projects/`, { headers });
  }

  getAllProjects(): Observable<ProjectsResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<ProjectsResponse>(`${this.apiUrl}/`, { headers });
  }
}
