import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Curso } from './cursos.service';
export type Estado = 'Pendiente' | 'En Revisión' | 'Aprobado' | 'Rechazado';
export type PrioridadApi = 'Baja' | 'Media' | 'Alta'; // tal como viene del API

export interface SolicitudCursoApi {
  id: number;
  cursoId: number;
  docenteId: number;
  prioridad: PrioridadApi;
  justificacion: string;
  estado: Estado;
  respuestaMensaje?: string | null;
  evaluadorId?: number | null;
  fechaRespuesta?: string | null;
  fechaSolicitud: string;
  createdAt: string;
  updatedAt: string;
  curso:Curso;
}

interface ApiOkResponse {
  ok: boolean;
  data: {
    data: SolicitudCursoApi[];
    total: number;
    page: number;
    pageSize: number;
  };
}
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
    respuestaMensaje?: string; // <-- NUEVO

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

  // Actualizar prioridad/justificación
  actualizarSolicitud(id: number, datos: Partial<SolicitudCurso>): Observable<SolicitudCurso> {
    return this.http.patch<SolicitudCurso>(`${this.apiUrl}/${id}`, datos);
  }

  // // Cambiar estado
  // cambiarEstado(id: number, cambioEstado: CambioEstado): Observable<SolicitudCurso> {
  //   return this.http.patch<SolicitudCurso>(`${this.apiUrl}/${id}/estado`, cambioEstado);
  // }
// (sin cambios)
cambiarEstado(id: number, cambioEstado: CambioEstado): Observable<SolicitudCurso> {
  return this.http.patch<SolicitudCurso>(`${this.apiUrl}/${id}/estado`, cambioEstado);
}
  // Aprobar y asignar
  aprobarYAsignar(id: number, aprobarRequest: AprobarRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/aprobar`, aprobarRequest);
  }
  // Listar solicitudes con filtros (Componente 2)
    listarSolicitudes(
    filtros?: SolicitudFiltros
  ): Observable<{ solicitudes: SolicitudCursoApi[]; total: number; page: number; pageSize: number ; }> {
    let params = new HttpParams();
    console.log("filtros",filtros)
    if (filtros?.docenteId) params = params.set('docenteId', String(filtros.docenteId));
    if (filtros?.estado)    params = params.set('estado', filtros.estado);
    if (filtros?.page)      params = params.set('page', String(filtros.page));
    if (filtros?.pageSize)  params = params.set('pageSize', String(filtros.pageSize));

    return this.http.get<ApiOkResponse>(this.apiUrl, { params }).pipe(
      map((r) => ({
        solicitudes: r.data.data,
        total: r.data.total,
        page: r.data.page,
        pageSize: r.data.pageSize,
      }))
    );
  }


  // listarSolicitudes(filtros?: SolicitudFiltros): Observable<{solicitudes: SolicitudCurso[], total: number}> {
  //   let params = new HttpParams();
    
  //   if (filtros) {
  //     if (filtros.docenteId) {
  //       params = params.set('docenteId', filtros.docenteId.toString());
  //     }
  //     if (filtros.estado) {
  //       params = params.set('estado', filtros.estado);
  //     }
  //     if (filtros.page) {
  //       params = params.set('page', filtros.page.toString());
  //     }
  //     if (filtros.pageSize) {
  //       params = params.set('pageSize', filtros.pageSize.toString());
  //     }
  //   }

  //   return this.http.get<{solicitudes: SolicitudCurso[], total: number}>(this.apiUrl, { params });
  // }
  // Crear solicitud (Componente 1)
  crearSolicitud(solicitud: SolicitudCurso): Observable<SolicitudCurso> {
    return this.http.post<SolicitudCurso>(this.apiUrl, solicitud);
  }



  // Obtener detalle de una solicitud
  obtenerSolicitud(id: number): Observable<SolicitudCurso> {
    return this.http.get<SolicitudCurso>(`${this.apiUrl}/${id}`);
  }
  // Obtener detalle de una solicitud
  obtenerSolicitudes(): Observable<SolicitudCurso> {
    return this.http.get<SolicitudCurso>(`${this.apiUrl}`);
  }


  // Eliminar solicitud
  eliminarSolicitud(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}