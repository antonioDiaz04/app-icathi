
// src/app/core/services/postulaciones.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { Postulacion, PostulacionesResponse } from '../model/postulacion.model';
// import { PostulacionesResponse, Postulacion } from '../models/postulacion.model';

export interface ListPostulacionesParams {
  recentDays?: number;
  search?: string;
  estatusId?: number | null;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDir?: 'ASC' | 'DESC';
}

@Injectable({ providedIn: 'root' })
export class PostulacionesService {
  // private readonly baseUrl = '/adminreporte/postulaciones';
private baseUrl = `${environment.api}/adminreporte/docentes`;
  constructor(private http: HttpClient) {}

//   asignarPassword(usuarioId: number, password: string) {
//   return this.http.put<{ ok: boolean }>(`/admin/usuarios/${usuarioId}/password`, { password })
// }

  list(params: ListPostulacionesParams): Observable<PostulacionesResponse> {
    let httpParams = new HttpParams();
    if (params.recentDays != null) httpParams = httpParams.set('recentDays', params.recentDays);
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.estatusId != null) httpParams = httpParams.set('estatusId', params.estatusId);
    if (params.limit != null) httpParams = httpParams.set('limit', params.limit);
    if (params.offset != null) httpParams = httpParams.set('offset', params.offset);
    if (params.orderBy) httpParams = httpParams.set('orderBy', params.orderBy);
    if (params.orderDir) httpParams = httpParams.set('orderDir', params.orderDir);

    return this.http.get<PostulacionesResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number) {
    return this.http.get<{ ok: boolean; data: Postulacion }>(`${this.baseUrl}/${id}`);
  }

  updateEstatus(id: number, estatusId: number) {
    return this.http.patch<{ ok: boolean }>(`${this.baseUrl}/${id}/estatus`, { estatusId });
  }

  delete(id: number) {
    return this.http.delete<{ ok: boolean }>(`${this.baseUrl}/${id}`);
  }

  // --- Acciones ADMIN sobre la cuenta/flujo ---

  // 1) Crear cuenta (si aún no existe) o enviar invitación
  crearCuentaOInvitar(postulacionId: number) {
    return this.http.post<{ ok: boolean; usuario_id: number }>(
      `${this.baseUrl}/${postulacionId}/crear-cuenta-o-invitar`,
      {}
    );
  }

  // 2) Forzar/Resetear contraseña (genera password temporal y lo envía por correo)
  resetPassword(usuarioId: number) {
    return this.http.post<{ ok: boolean }>(`/admin/usuarios/${usuarioId}/reset-password`, {});
  }

  // 3) Marcar correo como validado manualmente (si el admin confirmó identidad por otro canal)
  marcarCorreoValidado(usuarioId: number, value = true) {
    return this.http.patch<{ ok: boolean }>(`/admin/usuarios/${usuarioId}/correo-validado`, {
      correo_validado: value
    });
  }

  // 4) Activar/Desactivar usuario
  setActivo(usuarioId: number, activo: boolean) {
    return this.http.patch<{ ok: boolean }>(`/admin/usuarios/${usuarioId}/activo`, { activo });
  }

  // 5) Validar documentos y marcar docente como validado
  validarDocente(docenteId: number) {
    return this.http.post<{ ok: boolean }>(`/admin/docentes/${docenteId}/validar`, {});
  }

  // 6) Aprobar/Rechazar postulación
  aprobarPostulacion(postulacionId: number) {
    return this.http.post<{ ok: boolean }>(`${this.baseUrl}/${postulacionId}/aprobar`, {});
  }

  rechazarPostulacion(postulacionId: number, motivo?: string) {
    return this.http.post<{ ok: boolean }>(`${this.baseUrl}/${postulacionId}/rechazar`, { motivo });
  }
}
