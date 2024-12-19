import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PlantelService {

  constructor(private http:HttpClient) { }




  // Método para obtener los alumnos inscritos en un curso de un plantel
  getAlumnosCurso(idPlantel: any, idCurso: any): Observable<any[]> {
    return this.http.get<any[]>(`/alumnos-cursos?plantel_id=${idPlantel}&curso_id=${idCurso}`);
  }
  // Método para obtener los alumnos inscritos en un curso de un plantel
  // getInfoCursoPlantel(idPlantelCurso: any): Observable<any[]> {
  //   // http://localhost:3000/planteles-curso/plantelinfo/23
  // }
  getInfoCursoPlantel(idPlantelCurso: any): Observable<{ alumnos: any[]; docentes: any[] ;curso:any[]}> {
    //   return this.http.get<any[]>(`${environment.api}/planteles-curso/plantelinfo/${idPlantelCurso}`);
    return this.http.get<{ alumnos: any[]; docentes: any[] ;curso:any[]}>(`${environment.api}/planteles-curso/plantelinfo/${idPlantelCurso}`);
  }

  // Método para obtener la lista de cursos
  getCursos(): Observable<any[]> {
    return this.http.get<any[]>('/cursos');
  }

  // Método para obtener los docentes asignados a un curso
  getDocentesCurso(idCurso: any): Observable<any[]> {
    return this.http.get<any[]>(`/cursos-docentes?curso_id=${idCurso}`);
  }

  // Método para mostrar el modal
  showModal(data: { alumnos: any[]; cursos: any[]; docentes: any[] }) {
    // Lógica para mostrar el modal y pasar los datos obtenidos
  }

}
