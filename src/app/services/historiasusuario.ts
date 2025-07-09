import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HistoriaUsuario {
  id?: number;
  title: string;
  description: string;
  state: string;
}

@Injectable({ providedIn: 'root' })
export class HistoriasUsuarioService {
  private apiUrl = 'http://localhost:8000/api/userstories/';  // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  getHistorias(): Observable<HistoriaUsuario[]> {
    return this.http.get<HistoriaUsuario[]>(this.apiUrl);
  }

  crearHistoria(historia: HistoriaUsuario): Observable<HistoriaUsuario> {
    return this.http.post<HistoriaUsuario>(this.apiUrl, historia);
  }

  actualizarHistoria(id: number, historia: HistoriaUsuario): Observable<HistoriaUsuario> {
    return this.http.put<HistoriaUsuario>(`${this.apiUrl}${id}/`, historia);
  }
}
