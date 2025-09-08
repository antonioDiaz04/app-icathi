import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {
  private apiUrl = `${environment.api}/postulacion/registro`; // Cambia a tu URL del servidor

  constructor(private http: HttpClient) {}

  registrarUsuario(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

}
