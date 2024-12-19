import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

interface Curso {
  id: number;
  nombre: string;
  clave: string;
  duracion_horas: number;
  descripcion: string;
  area_id: number;
  area_nombre: string;
  especialidad_id: number;
  especialidad_nombre: string;
  tipo_curso_id: number;
  tipo_curso_nombre: string;
  vigencia_inicio: string | null;
  fecha_publicacion: string | null;
  ultima_actualizacion: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  private cursosApiUrl = `${environment.api}/cursos`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de cursos desde la API
   * @returns Un observable con la lista de cursos
   */
  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.cursosApiUrl);
  }

  getEspecialidadesByAreaId(areaId: number): Observable<any[]> {
    const url = `${environment.api}/especialidades/byAreaId/${areaId}/`;
    return this.http.get<any>(url);
  }

  getCursosByEspecialidadId(especialidadId: number): Observable<Curso[]> {
    const url = `${environment.api}/cursos/byEspecialidadId/${especialidadId}/`;
    return this.http.get<Curso[]>(url);
  }







  // Método para obtener los alumnos inscritos en un curso de un plantel
  getAlumnosCurso(idPlantel: any, idCurso: any): Observable<any[]> {
    return this.http.get<any[]>(
      `/alumnos-cursos?plantel_id=${idPlantel}&curso_id=${idCurso}`
    );
  }


  // Método para obtener los docentes asignados a un curso
  getDocentesCurso(idCurso: any): Observable<any[]> {
    return this.http.get<any[]>(`/cursos-docentes?curso_id=${idCurso}`);
  }
}
