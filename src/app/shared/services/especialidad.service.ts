import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

interface Especialidad {
  id: number;
  nombre: string;
  area_id: number;
}
export interface Especialidad_docente {
  id: number;
  docente_id: number;
  especialidad_id: number;
  especialidad: string;
  fecha_validacion: string | null;
  estatus_id: number;
  estatus: string;
}

@Injectable({
  providedIn: 'root',
})
export class EspecialidadesService {
  private especialidadesApiUrl = `${environment.api}/especialidades`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de especialidades desde la API
   * @returns Un observable con la lista de especialidades
   */
  getEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.especialidadesApiUrl);
  }
  obtenerEspecialidadesPorDocente(docenteId: number): Observable<{ especialidades: Especialidad_docente[] }> {
    return this.http
      .get<{ especialidades: Especialidad_docente[] }>(`${this.especialidadesApiUrl}/${docenteId}`)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    let mensajeError = 'Ocurrió un error inesperado';
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      mensajeError = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      mensajeError = `Error del servidor: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(() => new Error(mensajeError));
  }

}
