import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AspiranteService {
  private apiUrl = `${environment.api}/aspirante/registro`;

  constructor(private http: HttpClient) {}

  registrarAspirante(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, JSON.stringify(data), { headers });
  }

  registrarAspiranteByPllantel(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${environment.api}/aspirante/registro/${data.plantel}`, JSON.stringify(data), { headers });
  }



  getApirantes(): Observable<any> {
    return this.http.get(`${environment.api}/alumno`);
  }

  // Obtener un alumno por su ID
  getAlumnoById_user(id: number): Observable<any> {
    return this.http.get(`${environment.api}/alumno/usuario/${id}`);
  }

  getApirantesBIdPlantel(id: any): Observable<any> {
    // http://localhost:3000/alumnosPlantelCursos/byIdPlantel/3
    return this.http.get(
      `${environment.api}/PlantelCursos/byIdPlantel/${id}/alumnos`
    );
  }
  // Nueva función para obtener el CURP por correo electrónico
  obtenerCurpPorEmail(email: string): Observable<any> {
    return this.http.get(`${environment.api}/aspirante/curp/${email}`);
  } // Nueva función para obtener un alumno por su ID
  getAlumnoById(id: number): Observable<any> {
    return this.http.get(`${environment.api}/alumno/${id}`);
  }
}
