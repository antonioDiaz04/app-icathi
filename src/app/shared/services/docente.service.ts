import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  constructor(private http:HttpClient) { }


  url="docentes"
  // http://localhost:3000/docentes
 getDocentes():Observable<any>{
  return this.http.get<any>(`${environment.api}/${this.url}`)
 }



 

}
