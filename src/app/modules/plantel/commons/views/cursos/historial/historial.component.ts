import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID } from '@angular/core';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { environment } from '../../../../../../../environments/environment.prod';
import {  registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);
@Component({
    selector: 'app-historial',
    templateUrl: './historial.component.html',
    styles: ``,

  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
    standalone: false
})
export class HistorialComponent {
  idPlantel: any;
  cursosCompletado: any;
  cursosProceso: any;
  cursosPendiente: any;
  isLoading!: boolean;
  constructor(private http: HttpClient, private authh: AuthService) {}

  ngOnInit(): void {
    this.generarAnios();
    this.cargarCursos(); // Simula la carga inicial de cursos

    this.cargarCursosStatus();
  }

  cargarCursosStatus() {
    this.isLoading = true;
    this.authh.getIdFromToken().then((idPlantel) => {
      this.http
        .get<any>(
          `${environment.api}/plantelesCursos/cursosYestatus/${idPlantel}`
        )
        .subscribe((response) => {
          // Filtrar los cursos con estado "Completado"
          this.isLoading = false;
          this.cursosCompletado = response.filter(
            (curso: any) => curso.estado === 'Completado'
          );
          this.cursosPendiente = response.filter(
            (curso: any) => curso.estado === 'Pendiente'
          );
          this.cursosProceso = response.filter(
            (curso: any) => curso.estado === 'En Proceso'
          );
        });
    });5
  }






  //

  // isLoading = false;
  cursos: any[] = []; // Cursos originales
  cursosFiltrados: any[] = []; // Cursos después de filtrar
  filtroMes = '';
  filtroAnio = '';
  meses = [
    { valor: 1, nombre: 'Enero' },
    { valor: 2, nombre: 'Febrero' },
    { valor: 3, nombre: 'Marzo' },
    { valor: 4, nombre: 'Abril' },
    { valor: 5, nombre: 'Mayo' },
    { valor: 6, nombre: 'Junio' },
    { valor: 7, nombre: 'Julio' },
    { valor: 8, nombre: 'Agosto' },
    { valor: 9, nombre: 'Septiembre' },
    { valor: 10, nombre: 'Octubre' },
    { valor: 11, nombre: 'Noviembre' },
    { valor: 12, nombre: 'Diciembre' },
  ];
  anios: number[] = [];


  generarAnios() {
    const anioActual = new Date().getFullYear();
    this.anios = Array.from({ length: 10 }, (_, i) => anioActual - i);
  }

  cargarCursos() {
    // Simula la carga de cursos. Sustituye con tu lógica real.
    this.isLoading = true;
    setTimeout(() => {
      this.cursos = [/* Tus datos de cursos */];
      this.cursosFiltrados = [...this.cursos];
      this.isLoading = false;
    }, 1000);
  }

  filtrarEstado(estado: string) {
    this.cursosFiltrados = estado === 'Todos' ? [...this.cursos] : this.cursos.filter(curso => curso.estado === estado);
  }

  filtrarPorFecha() {
    this.cursosFiltrados = this.cursos.filter(curso => {
      const fechaInicio = new Date(curso.fecha_inicio);
      const coincideMes = this.filtroMes ? fechaInicio.getMonth() + 1 === +this.filtroMes : true;
      const coincideAnio = this.filtroAnio ? fechaInicio.getFullYear() === +this.filtroAnio : true;
      return coincideMes && coincideAnio;
    });
  }
}

