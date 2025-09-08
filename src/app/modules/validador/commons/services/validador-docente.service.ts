import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ValidadorDocenteService {

  private apiUrl = `${environment.api}/docentes`; // URL base de tu API
  // private apiUrl = 'http://localhost:3000/docentes'; // URL base de tu API

  constructor(private http: HttpClient) {}
  // Obtener docentes por el ID del usuario
  getDocentesByUserId(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${userId}`);
  }
  // Obtener un docente por ID
  getDocenteById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  // Obtener todos los docentes
  getAllDocentes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }


  // Crear un nuevo docente
  createDocente(docente: any): Observable<any> {
    return this.http.post(this.apiUrl, docente);
  }

  // Actualizar un docente existente
  updateDocente(id: string, docente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, docente);
  }

  // Eliminar un docente
  deleteDocente(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  // Actualizar el estatus de un docente
  updateDocenteStatus(usuarioValidadorId:number,docenteId: string, nuevoEstatusId: number): Observable<any> {
    const payload = {
      estatus_id: nuevoEstatusId,
      usuario_validador_id: usuarioValidadorId,
    };
    return this.http.put(`${this.apiUrl}/${docenteId}/estatus`,payload);
  }
}
