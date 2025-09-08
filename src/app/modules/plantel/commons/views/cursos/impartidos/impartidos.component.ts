import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../../environments/environment.prod';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { response } from 'express';

@Component({
    selector: 'app-impartidos',
    templateUrl: './impartidos.component.html',
    styles: ``,
    standalone: false
})
export class ImpartidosComponent implements OnInit {
  idPlantel: any;
  cursos:any;
  isLoading!:boolean;
  constructor(private http: HttpClient, private authh: AuthService) {}

  ngOnInit(): void {
    this.cargarCursosStatus();
  }

  cargarCursosStatus() {
    this.isLoading=true;
    this.authh.getIdFromToken().then((idPlantel)=>{
      // http://localhost:3000/plantelesCursos/cursosYestatus/3
      this.http.get<any>(
        `${environment.api}/plantelesCursos/cursosYestatus/${idPlantel}`
      ).subscribe(response=>{
        this.isLoading=false;
        this.cursos=response.filter((curso:any)=>curso.estado!= "Completado");
    });
  });
  }
}
