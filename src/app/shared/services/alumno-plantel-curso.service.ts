import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlumnoPlantelCursoService {

   private apiUrl = `${environment.api}/PlantelCursos`;
 
   constructor(private http: HttpClient) {}


  /**
   * Obtener alumnos por plantel y curso
   * @param plantelId - ID del plantel
   * @param cursoId - ID del curso
   * @returns Observable con la lista de alumnos
   */
  obtenerAlumnosPorPlantelYCurso(plantelId: number, cursoId: number): Observable<any[]> {
    const url = `${this.apiUrl}/alumnos/${plantelId}/${cursoId}`;
    return this.http.get<any[]>(url);
  }
}
