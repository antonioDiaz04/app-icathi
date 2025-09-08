import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';

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

  // asignarODesasignarDocenteACurso(docenteId: number, cursoId: number, action: 'asignar' | 'desasignar'): Observable<any> {
  //   return this.http.post(`${environment.api}/${this.url}/asignar-desasignar-curso-docente`, {
  //     docenteId,
  //     cursoId,
  //     action,
  //   });
  // }
  asignarODesasignarDocenteACurso(docentesIds: number[], cursoId: number): Observable<any> {
    return this.http.post(`${environment.api}/${this.url}/asignar-desasignar-curso-docente`, { cursoId, docentesIds });

    // return this.http.post(`${environment.api}/${this.url}/asignar-desasignar-curso-docente`, {

  }
  obtenerCursosAsignados(docenteId: number) {
    return this.http.get(`${environment.api}/${this.url}/asignados/${docenteId}`);
  }

  // Nueva función para obtener los docentes de un curso
  obtenerDocentesPorCurso(cursoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.api}/${this.url}/${cursoId}/docentes`);
  }
  
}
