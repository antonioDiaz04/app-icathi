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
      /**
   * Obtener la información de un curso específico de un alumno
   * @param alumnoId ID del alumno
   * @param cursoId ID del curso
   * @returns Observable con los datos del curso
   */
      getCursoByAlumnoAndCurso(alumnoId: number, cursoId: number): Observable<any> {
        const url = `${this.baseUrl}/${alumnoId}/curso/${cursoId}`;
        return this.http.get<any>(url);
      } 
}
