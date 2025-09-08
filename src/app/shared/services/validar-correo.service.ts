import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidarCorreoService {


  constructor(private http: HttpClient) {}
  validarCorreo(token: string): Observable<any> {
    const params = new HttpParams().set('token', token);
    return this.http.get(`${environment.api}/postulacion/validar-correo`, { params });
  }
  
}
