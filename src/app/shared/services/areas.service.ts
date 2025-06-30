import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

interface Area {
  id: number;
  nombre: string;
}
export interface AreaDetail {
  area_id: number;
  area_nombre: string;
  area_descripcion: string | null;
  num_especialidades: string;
  num_cursos_area: string;
  num_cursos_area_especialidad: string;
}

@Injectable({
  providedIn: 'root',
})
export class AreasService {
  private areasApiUrl = `${environment.api}/areas`;
  private areasApiUrl2 = `${environment.api}/areas/byIdPlantel/`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de áreas desde la API
   * @returns Un observable con la lista de áreas
   */
  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(this.areasApiUrl);
  }
  getAreasByIdPlantel(idPlantel:any): Observable<Area[]> {
    return this.http.get<Area[]>(this.areasApiUrl2+idPlantel);
  }
  getAreaDetailsById(idArea: number): Observable<AreaDetail> {
    const url = `${this.areasApiUrl}/deatilsById/${idArea}`;
    return this.http.get<AreaDetail[]>(url).pipe(
      map(response => response[0])
    );
  }
}
