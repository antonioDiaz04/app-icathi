import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

// Interfaces para tipar las respuestas
export interface CursoDetallado {
  id: number;
  estatus: boolean;
  area_id: number;
  area_nombre: string;
  especialidad_id: number;
  especialidad_nombre: string;
  clave: string;
  curso_nombre: string;
  tipo_curso_id: number;
  tipo_curso_nombre: string;
  horas: number;
  detalles: string;
}

export interface TipoCurso {
  id: number;
  nombre: string;
}

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
  private TipoCursoApiUrl = `${environment.api}`;
  private cursosApiUrl = `${environment.api}/cursos`;
  private cursosApiUrl2 = `${environment.api}/cursos/ByIdPlantel/`;

  constructor(private http: HttpClient) {}
  getTiposCurso(): Observable<TipoCurso[]> {
    return this.http.get<TipoCurso[]>(`${this.TipoCursoApiUrl}/tiposCurso`);
  }

    getCursosDetallados(): Observable<CursoDetallado[]> {
    return this.http.get<CursoDetallado[]>(`${this.cursosApiUrl}/cursos/detallados`);
  }
  /**
   * Obtiene la lista de cursos desde la API
   * @returns Un observable con la lista de cursos
   */
  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.cursosApiUrl);
  }
  getCursosByIdPlatel(idPlantel:any): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.cursosApiUrl2+idPlantel);
  }

  getEspecialidadesByAreaId(areaId: number): Observable<any[]> {
    const url = `${environment.api}/especialidades/byAreaId/${areaId}/`;
    return this.http.get<any>(url);
  }

  getCursosByEspecialidadId(especialidadId: number,plantelId:number): Observable<Curso[]> {

    const url = `${environment.api}/cursos/byEspecialidadId/${especialidadId}/plantelId/${plantelId}`;
    return this.http.get<Curso[]>(url);
  }






    /**
   * Obtiene un curso por su ID
   * @param idCurso El ID del curso
   * @returns Un observable con los detalles del curso
   */
    getCursoById(idCurso: number): Observable<Curso> {
      const url = `${this.cursosApiUrl}/${idCurso}`; // Construcción dinámica de la URL
      return this.http.get<Curso>(url);
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
