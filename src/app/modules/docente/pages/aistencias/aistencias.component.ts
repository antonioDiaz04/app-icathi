import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment.prod';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-aistencias',
  templateUrl: './aistencias.component.html',
  styles: [],
})
export class AistenciasComponent implements OnInit {
  alumnosConAsistencias: any[] = []; // Almacena los datos obtenidos del API
  curso_id: string | null = null;
  loading: boolean = false; // Variable para controlar el estado de carga
  errorMessage: string = ''; // Variable para el mensaje de error

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}




  
  ngOnInit(): void {
    this.getAlumnosConAsistencias(); // Llama a la función que obtiene los datos
  }

  getAlumnosConAsistencias(): void {
    this.route.paramMap.subscribe((params) => {
      this.curso_id = params.get('id');
      if (this.curso_id) {
        // /curso-docente/asistencia/3
        this.loading = true; // Activamos el loading antes de la solicitud
        const API_URL = `${environment.api}/curso-docente/asistencia/${this.curso_id}`; // Cambia esto por tu endpoint
        this.http.get(API_URL).subscribe((data:any) => {

              this.alumnosConAsistencias = data.data; // Almacenamos los datos obtenidos del API
              this.loading = false; // Desactivamos el loading una vez recibimos los datos
            console.log(this.alumnosConAsistencias);

        },(err) => {
              console.error('Error al obtener datos del API:', err);
              this.loading = false; // Desactivamos el loading en caso de error
              this.errorMessage = 'Hubo un error al obtener los datos. Intenta nuevamente.';
            }
          );
        
        // this.http.get(API_URL).subscribe({
        //   next: (data: any) => {
        //   },
        //   error: (err) => {
        //     console.error('Error al obtener datos del API:', err);
        //     this.loading = false; // Desactivamos el loading en caso de error
        //     this.errorMessage = 'Hubo un error al obtener los datos. Intenta nuevamente.';
        //   },
        // });
      }
    });
  }
}
