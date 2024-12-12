import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AspiranteService {

  private apiUrl = `${environment.api}/aspirante/registro`;

  constructor(private http: HttpClient) {}

  registrarAspirante(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, JSON.stringify(data), { headers });
  }

  getApirantes():Observable<any>{
    return this.http.get(`${environment.api}/alumno`)
  }


}
