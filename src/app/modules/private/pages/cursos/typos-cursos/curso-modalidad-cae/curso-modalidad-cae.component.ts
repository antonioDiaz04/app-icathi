import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';

export interface Modulo {
  id: number;
  nombre: string;
  clave?: string;
  duracion_horas: number;
  descripcion: string;
  nivel: string;
  costo?: number;
  requisitos?: string;
  area_id?: number;
  especialidad_id?: number;
  tipo_curso_id?: number;
  vigencia_inicio?: string;
  fecha_publicacion?: string;
  ultima_actualizacion?: string;
}


@Component({
  selector: 'app-curso-modalidad-cae',
  templateUrl: './curso-modalidad-cae.component.html',
  styles: ``
})
export class CursoModalidadCAEComponent implements OnInit{


  areas: any[] = [];
  especialidades: any[] = [];
  tiposCurso: any[] = [];
  modulos: Modulo[] = [];



  nuevoCurso: Modulo = {
    id: 0,
    nombre: '',
    duracion_horas: 0,
    descripcion: '',
    nivel: '', // Inicializado como cadena vacía
    clave: '',
    area_id: undefined,
    especialidad_id: undefined,
    tipo_curso_id: undefined,
  };
  // `${environment.api}/user`;
  private apiUrl =  `${environment.api}`;

  constructor(private http: HttpClient) {}


ngOnInit(): void {
    this.cargarAreas()
    this.cargarEspecialidades()
    this.cargarTiposCurso()
}

  cargarAreas(): void {
    this.http.get<any[]>(`${this.apiUrl}/areas`).subscribe({
      next: (data) => {
        this.areas = data;
      },
      error: (err) => {
        console.error('Error al cargar áreas:', err);
      },
    });
  }
  cargarEspecialidades(): void {
    this.http.get<any[]>(`${this.apiUrl}/especialidades`).subscribe({
      next: (data) => {
        this.especialidades = data;
      },
      error: (err) => {
        console.error('Error al cargar especialidades:', err);
      },
    });
  }

  cargarTiposCurso(): void {
    this.http.get<any[]>(`${this.apiUrl}/tiposCurso`).subscribe({
      next: (data) => {
        this.tiposCurso = data;
      },
      error: (err) => {
        console.error('Error al cargar tipos de curso:', err);
      },
    });
  }


 agregarCurso(): void {
    console.log('Datos enviados al backend:', this.nuevoCurso); // Verifica el contenido

    this.http.post<Modulo>(`${this.apiUrl}/cursos`, this.nuevoCurso).subscribe({
      next: (cursoCreado) => {
        this.modulos.push(cursoCreado);
        this.nuevoCurso = {
          id: 0,
          nombre: '',
          duracion_horas: 0,
          descripcion: '',
          nivel: '', // Reinicia el campo después de enviar
          clave: '',
          area_id: undefined,
          especialidad_id: undefined,
          tipo_curso_id: undefined,
        };
        // this.mostrarFormulario = false;

        console.log('Curso agregado correctamente');
      },
      error: (err) => {
        console.error('Error al agregar el curso:', err);
      },
    });
  }

  
}
