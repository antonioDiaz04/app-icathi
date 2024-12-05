import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Usuario } from '../../../shared/models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.api}/user`;

  constructor(private http: HttpClient) {}

  /**
   * Cambiar el rol de un usuario
   * @param id - ID del usuario
   * @param nuevoRol - Nuevo rol a asignar
   * @returns Observable con la respuesta del servidor
   */
  cambiarRol(id: string, nuevoRol: string): Observable<any> {
    const url = `${this.apiUrl}/cambiar-rol/${id}`;
    console.log('Datos enviados:', { rol: nuevoRol }); // Verifica qué se está enviando
    return this.http.put(url, { rol: nuevoRol });
  }
  
  /**
 * Obtener la lista de todos los usuarios
 * @returns Observable con la lista de usuarios
 */
  listarUsuarios(): Observable<Usuario[]> {
    const url = `${this.apiUrl}/`;
    return this.http.get<Usuario[]>(url);
  }
  
}
