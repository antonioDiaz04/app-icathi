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
   * Actualizar el estatus y rol de un usuario
   * @param id - ID del usuario
   * @param estatus - Nuevo estatus (true o false)
   * @param rol - Nuevo rol
   * @returns Observable con la respuesta del servidor
   */
  actualizarEstatusRol(id: string, estatus: boolean, rol: string): Observable<any> {
    const url = `${this.apiUrl}/${id}/estatus-rol`;  // URL proporcionada en el enunciado
    console.log('Datos enviados:', { estatus, rol });  // Verifica qué se está enviando
    return this.http.put(url, { estatus, rol });
  }
  
  /**
   * Obtener la lista de todos los usuarios
   * @returns Observable con la lista de usuarios
   */
  listarUsuarios(): Observable<Usuario[]> {
    const url = `${this.apiUrl}/`;
    return this.http.get<Usuario[]>(url);
  }

  /**
   * Eliminar un usuario
   * @param id - ID del usuario
   * @returns Observable con la respuesta del servidor
   */
  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear un nuevo usuario
   * @param usuario - Objeto usuario con los datos a registrar
   * @returns Observable con la respuesta del servidor
   */
  crearUsuario(usuario: any): Observable<any> {
    const url = `${this.apiUrl}/`;
    console.log('Datos del nuevo usuario:', usuario); // Verifica los datos que se enviarán
    return this.http.post(url, usuario);
  }
}
