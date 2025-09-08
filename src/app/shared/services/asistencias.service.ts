import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsistenciasService {
  // private baseUrl = 'http://localhost:3000/asistencias_alumnos'; // Cambia esto según la URL de tu API
  private baseUrl = `${environment.api}/asistencias_alumnos`;

  constructor(private http: HttpClient) {}

  // Obtener todas las asistencias
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  // Obtener una asistencia por su ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Crear una nueva asistencia
  create(asistencia: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, asistencia);
  }

  // Actualizar una asistencia por su ID
  update(id: number, asistencia: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, asistencia);
  }

  // Eliminar una asistencia por su ID
}