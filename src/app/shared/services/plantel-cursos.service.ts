import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlantelCursosService {
  private baseUrl = `${environment.api}/PlantelCursos`;

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
}
