import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';

export interface Plantel {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  director: string;
  capacidad_alumnos: number;
  estatus: boolean;
  created_at: string;
  updated_at: string;
  usuario_gestor_id: number;
  estado: string;
  municipio: string;
  password: string;
  rol: string;
}
@Injectable({
  providedIn: 'root'
})
export class PlantelesService {



  constructor(private http:HttpClient) { }


  createPlantel(body:any):Observable<any>{
    return this.http.post<any>(`${environment.api}/plantel/`,body);
  }
  // Método para obtener cursos por ID del plantel
  getCursosByPlantelId(plantelId: number): Observable<any> {
    return this.http.get<any>(`${environment.api}/plantel/${plantelId}/cursos`);
  }
  // getPlanteles(){
  //   return this.http.get(`${environment.api}/plantel`)
  // }
  // Obtener todos los planteles
  getPlanteles(): Observable<Plantel[]> {
    return this.http.get<Plantel[]>(`${environment.api}/plantel`);
  }
  deletePlantel(id:any){
    return this.http.delete(`${environment.api}/plantel/${id}`)
  }
  getPlantelById(id:any){
    return this.http.get(`${environment.api}/plantel/${id}`)
  }
  updatePlantel(id: any, formData: any) {
    return this.http.put(`${environment.api}/plantel/${id}`, formData);
  }

// Nueva función para obtener los datos del plantel por su ID
getPlantelDetails(plantelId: number): Observable<any> {
  return this.http.get<any>(`${environment.api}/plantel/datos/${plantelId}`);
}

}
