import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ManagementList } from '../interfaces/ManagementList';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class ManagmentServices {

  private apiUrl: string = 'http://localhost:8000/api/';

  constructor(private readonly http: HttpClient) {}

  getManagements(): Observable<ManagementList[]> {
    const token = localStorage.getItem('access_token');
    return this.http.get<ManagementList[]>(`${this.apiUrl}project/`, {
      headers:{
        'Authorization': `Bearer ${token}`,
      }
    })
  }

  editProject(id:number): Observable<ManagementList[]> {
    const token = localStorage.getItem('access_token');
    return this.http.get<ManagementList[]>(`${this.apiUrl}project/${id}`, {
      headers:{
        'Authorization': `Bearer ${token}`,
      }
    })
  }
  saveEditProject(id: number, projectData: object): Observable<ManagementList[]> {
  const token = localStorage.getItem('access_token');
  return this.http.put<ManagementList[]>(
    `${this.apiUrl}project/${id}`,
    projectData,  // Aquí van los datos del proyecto a actualizar
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
}
}

