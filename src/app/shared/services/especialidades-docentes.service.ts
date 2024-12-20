import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesDocentesService {
  private baseUrl = `${environment.api}/especialidades_docentes`;
  constructor(private http: HttpClient) {}

  /**
   * Actualiza el estatus de una especialidad de un docente.
   * @param docenteId ID del docente.
   * @param especialidadId ID de la especialidad.
   * @param nuevoEstatusId Nuevo estatus.
   * @param usuarioValidadorId ID del usuario validador.
   * @returns Observable con la respuesta de la API.
   */
  actualizarEstatus(docenteId: number, especialidadId: number, nuevoEstatusId: number, usuarioValidadorId: number): Observable<any> {
    const url = `${this.baseUrl}/actualizar-estatus`;

    // Cuerpo de la solicitud
    const body = {
      docenteId,
      especialidadId,
      nuevoEstatusId,
      usuarioValidadorId
    };

    // // Configuración de los headers si es necesario
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json'
    // });

    // Realiza la solicitud PUT
    return this.http.put(url, body);
  }
}
