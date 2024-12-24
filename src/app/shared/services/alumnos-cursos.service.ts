import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AlumnosCursosService {
  // private baseUrl = 'http://localhost:3000/alumnos-cursos'; // URL base del API
  // private baseUrl = 'http://localhost:3000/alumnos-cursos'; // URL base del API
  private baseUrl = `${environment.api}/alumnos-cursos`;

  constructor(private http: HttpClient) {}

  // Método para obtener información de un curso específico por su ID
  getCursoById_Alumno(alumnoId: number): Observable<any> {
    const url = `${this.baseUrl}/${alumnoId}`;
    return this.http.get<any>(url);
  }
}
