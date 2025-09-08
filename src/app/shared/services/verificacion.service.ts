import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class VerificacionService {
  private apiUrl = `${environment.api}/verificar-correo`; // Cambia a tu URL del servidor

  constructor(private http: HttpClient) {}

  /**
   * Verifica un número de teléfono.
   * @param telefono Teléfono a verificar
   */
  verificarTelefono(telefono: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/telefono`, { telefono });
  }
  /**
   * Verifica un correo electrónico.
   * @param email Correo a verificar
   */
  verificarCorreo(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, { email });
  }

}
