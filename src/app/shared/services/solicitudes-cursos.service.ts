import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SolicitudCurso {
  id?: number;
  cursoId: number;
  docenteId: number;
  prioridad: string;
  justificacion: string;
  estado?: string;
  fechaSolicitud?: Date;
  evaluadorId?: number;
  respuestaMensaje?: string;
}

export interface SolicitudFiltros {
  docenteId?: number;
  estado?: string;
  page?: number;
  pageSize?: number;
}

export interface CambioEstado {
  estado: string;
  evaluadorId?: number;
}

export interface AprobarRequest {
  estado: string;
  evaluadorId: number;
  respuestaMensaje?: string;
  approveAndAssign?: boolean;
  paramsAsignacion?: any;
}
@Injectable({
  providedIn: 'root'
})
export class SolicitudesCursosService {

  // private apiUrl = `${environment.apiUrl}/solicitudes-cursos`;
  private apiUrl = `${environment.api}/solicitudes-cursos`; // Cambia a tu URL del servidor

  constructor(private http: HttpClient) { }

  // Crear solicitud (Componente 1)
  crearSolicitud(solicitud: SolicitudCurso): Observable<SolicitudCurso> {
    return this.http.post<SolicitudCurso>(this.apiUrl, solicitud);
  }

  // Listar solicitudes con filtros (Componente 2)
  listarSolicitudes(filtros?: SolicitudFiltros): Observable<{solicitudes: SolicitudCurso[], total: number}> {
    let params = new HttpParams();
    
    if (filtros) {
      if (filtros.docenteId) {
        params = params.set('docenteId', filtros.docenteId.toString());
      }
      if (filtros.estado) {
        params = params.set('estado', filtros.estado);
      }
      if (filtros.page) {
        params = params.set('page', filtros.page.toString());
      }
      if (filtros.pageSize) {
        params = params.set('pageSize', filtros.pageSize.toString());
      }
    }

    return this.http.get<{solicitudes: SolicitudCurso[], total: number}>(this.apiUrl, { params });
  }

  // Obtener detalle de una solicitud
  obtenerSolicitud(id: number): Observable<SolicitudCurso> {
    return this.http.get<SolicitudCurso>(`${this.apiUrl}/${id}`);
  }

  // Actualizar prioridad/justificación
  actualizarSolicitud(id: number, datos: Partial<SolicitudCurso>): Observable<SolicitudCurso> {
    return this.http.patch<SolicitudCurso>(`${this.apiUrl}/${id}`, datos);
  }

  // Cambiar estado
  cambiarEstado(id: number, cambioEstado: CambioEstado): Observable<SolicitudCurso> {
    return this.http.patch<SolicitudCurso>(`${this.apiUrl}/${id}/estado`, cambioEstado);
  }

  // Aprobar y asignar
  aprobarYAsignar(id: number, aprobarRequest: AprobarRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/aprobar`, aprobarRequest);
  }

  // Eliminar solicitud
  eliminarSolicitud(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}