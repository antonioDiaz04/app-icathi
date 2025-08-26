import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  constructor(private http:HttpClient) { }


  url="docentes"
 getDocentes():Observable<any>{
  return this.http.get<any>(`${environment.api}/${this.url}`)
 }
 updateDocente(id: number, docenteData: any): Observable<any> {
  return this.http.put<any>(`${environment.api}/${this.url}/${id}`, docenteData);
}


  // Método para obtener un docente por ID de usuario
  getDocenteById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.api}/${this.url}/usuario/${id}`);
  }


  // Nuevo método para cambiar la contraseña
  cambiarPassword(id: number, passwordData: any): Observable<any> {
    return this.http.post<any>(`${environment.api}/${this.url}/${id}/cambiar-password`, passwordData);
  }
}
