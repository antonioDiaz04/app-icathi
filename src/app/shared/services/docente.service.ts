import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

export interface Docente {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  especialidad: string | null;
  certificado_profesional: boolean;
  cedula_profesional: string | null;
  documento_identificacion: string | null;
  num_documento_identificacion: string | null;
  curriculum_url: string | null;
  estatus_tipo: string;   // "DOCENTE"
  estatus_valor: string;  // "Activo", "Inactivo", etc.
  created_at: string;     // ISO
  updated_at: string;     // ISO
  usuario_validador_id: number | null;
  fecha_validacion: string | null; // ISO o null
  foto_url: string | null;
  validador_nombre: string | null;
  validador_apellidos: string | null;
}
@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  constructor(private http: HttpClient) { }


  url = "docentes"
  
  /** GET /docentes/:id */ 
  // a obtener un docente por ID de docente
  getById(id: number): Observable<Docente> {
    return this.http
      .get<Docente>(`${environment.api}/${this.url}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  getDocentes(): Observable<any> {
    return this.http.get<any>(`${environment.api}/${this.url}`)
  }
  updateDocente(id: number, docenteData: any): Observable<any> {
    return this.http.put<any>(`${environment.api}/${this.url}/${id}`, docenteData);
  }


  // Método para obtener un docente por ID de usuario
  getDocenteById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.api}/${this.url}/usuario/${id}`);
  }



  /** Utilidad opcional: nombre completo */
  nombreCompleto(d: Pick<Docente, 'nombre' | 'apellidos'>): string {
    return `${(d.nombre ?? '').trim()} ${(d.apellidos ?? '').trim()}`.trim();
    }

  private handleError(error: HttpErrorResponse) {
    const msg =
      (error.error && (error.error.message || error.error.error)) ||
      `HTTP ${error.status} — ${error.statusText || 'Error de red'}`;
    return throwError(() => new Error(msg));
  }
  // Nuevo método para cambiar la contraseña
  cambiarPassword(id: number, passwordData: any): Observable<any> {
    return this.http.post<any>(`${environment.api}/${this.url}/${id}/cambiar-password`, passwordData);
  }
}
