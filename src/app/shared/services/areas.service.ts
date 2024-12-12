import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

interface Area {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class AreasService {
  private areasApiUrl = `${environment.api}/areas`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de áreas desde la API
   * @returns Un observable con la lista de áreas
   */
  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(this.areasApiUrl);
  }

}
