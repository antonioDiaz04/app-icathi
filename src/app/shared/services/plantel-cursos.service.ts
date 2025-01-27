import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlantelCursosService {
  private baseUrl = `${environment.api}/PlantelCursos`;
  private planteles_curso_solicitud = `${environment.api}/planteles-curso`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la oferta educativa para un alumno específico.
   * @param alumnoId - ID del alumno
   * @returns Un Observable con los datos de la oferta educativa
   */
  getOfertaEducativa(alumnoId: number): Observable<any[]> {
    const url = `${this.baseUrl}/${alumnoId}/oferta-educativa`;
    return this.http.get<any[]>(url);
  }

  /**
   * Actualiza la solicitud de un curso por ID.
   * @param id - ID de la solicitud a actualizar
   * @param data - Objeto con los datos que se desean actualizar
   * @returns Un Observable con la respuesta del servidor
   */
  updateCourseSolicitudById(id: number, data: any): Observable<any> {
    const url = `${this.planteles_curso_solicitud}/solicitud/${id}`;
    return this.http.put<any>(url, data);
  }
}
