import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

export interface DictamenPayload {
  folio: string;
  solicitudId: number;
  candidatoNombreCompleto: string;
  candidatoTelefono: string;
  candidatoEmail: string;
  curso: {
    id: number;
    nombre: string;
    clave: string | null;
    modalidad: string | null;
    duracionHoras: number | null;
  };
  estado: string;
  validado: boolean;
  fechaConvoco: string;
  fechaRespuesta: string;
  criterioPrimera: string;
  criterioSegunda: string;
  reforzarTemas: string;
  prioridad: string;
  justificacion: string;
}

@Injectable({ providedIn: 'root' })
export class DictamenValidacionService {
  private http = inject(HttpClient);
  private base = `${environment.api}/validacion-dictamen`;

  getBySolicitudId(solicitudId: number | string): Observable<{ ok: boolean; data: DictamenPayload }> {
    return this.http.get<{ ok: boolean; data: DictamenPayload }>(`${this.base}/${solicitudId}`);
  }
}
