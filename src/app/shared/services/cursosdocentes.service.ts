import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CursosdocentesService {
  url = 'curso-docente';
  constructor(private http: HttpClient) {}

  asignarDocenteACurso(docenteId: number, cursoId: number) {
    return this.http.post(
      `${environment.api}/${this.url}/asignar-curso-docente/`,
      { docenteId, cursoId }
    );
  }
  
  obtenerCursosAsignados(docenteId: number) {
    return this.http.get(
      `${environment.api}/${this.url}/asignados/${docenteId}`
    );
  }
}
