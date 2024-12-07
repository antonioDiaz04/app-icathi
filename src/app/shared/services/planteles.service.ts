import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlantelesService {



  constructor(private http:HttpClient) { }


  createPlantel(body:any):Observable<any>{
    return this.http.post<any>(`${environment.api}/plantel/`,body);
  }

  getPlanteles(){
    return this.http.get(`${environment.api}/plantel`)
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


}
