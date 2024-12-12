import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

interface Especialidad {
  id: number;
  nombre: string;
  area_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class EspecialidadesService {
  private especialidadesApiUrl = `${environment.api}/especialidades`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de especialidades desde la API
   * @returns Un observable con la lista de especialidades
   */
  getEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.especialidadesApiUrl);
  }
}
