import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ManagementList } from '../interfaces/ManagementList';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class ManagmentServices {

  private apiUrl: string = 'http://localhost:8000/api/project/';

  constructor(private readonly http: HttpClient) {}

  getManagements(): Observable<ManagementList[]> {
    const token = localStorage.getItem('access_token');
    return this.http.get<ManagementList[]>(`${this.apiUrl}`, {
      headers:{
        'Authorization': `Bearer ${token}`,
      }
    })
  }

  editProject(projectId:number): Observable<ManagementList[]> {
    const token = localStorage.getItem('access_token');
    return this.http.get<ManagementList[]>(`${this.apiUrl}${projectId}/`, {
      headers:{
        'Authorization': `Bearer ${token}`,
      }
    })
  }


  saveEditProject(projectId: number, inputNewData: any): Observable<ManagementList[]> {
    const token = localStorage.getItem('access_token');
    return this.http.put<ManagementList[]>(`${this.apiUrl}${projectId}/`, inputNewData, {
      headers:{
        'Authorization': `Bearer ${token}`,
      }
    })
  }



  destroyProject(projectId: number): Observable<ManagementList[]> {
    const token = localStorage.getItem('access_token');
    return this.http.delete<ManagementList[]>(`${this.apiUrl}${projectId}/`, {
      headers:{
        'Authorization': `Bearer ${token}`,
      }
    })
  }
}

