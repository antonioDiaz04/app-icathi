import { Component, OnInit } from '@angular/core';    
import { HttpClient } from '@angular/common/http';    
import { environment } from '../../../../../environments/environment.prod'; // Ajusta la ruta según tu estructura    

interface Modulo {    
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
  validado?: boolean | null;    
  observaciones?: string;    
  estado?: string; // 'pendiente', 'validado', 'rechazado'    
  estatus?: boolean; // Agregar esta línea
}    

@Component({    
  selector: 'app-validador-cursos',    
  templateUrl: './validador-cursos.component.html',    
  styleUrls: ['./validador-cursos.component.scss']    
})    
export class ValidadorCursosComponent implements OnInit {    
  modulosPendientes: Modulo[] = [];    
  modulosValidados: Modulo[] = [];    
  cursoDetalleSeleccionado: Modulo | null = null;    
  mostrarDetalleModal: boolean = false;    
  private apiUrl = `${environment.api}`;    

  constructor(private http: HttpClient) { }    

  ngOnInit(): void {    
    this.cargarCursosPendientes();    
    this.cargarCursosValidados();    
  }    

  cargarCursosPendientes(): void {    
    this.http.get<Modulo[]>(`${this.apiUrl}/cursos/status/false`).subscribe({    
      next: (data) => {    
        this.modulosPendientes = data;    
      },    
      error: (err) => {    
        console.error('Error al cargar los cursos pendientes:', err);    
      },    
    });    
  }    

  cargarCursosValidados(): void {    
    this.http.get<Modulo[]>(`${this.apiUrl}/cursos/status/true`).subscribe({    
      next: (data) => {    
        this.modulosValidados = data;    
      },    
      error: (err) => {    
        console.error('Error al cargar los cursos validados:', err);    
      },    
    });    
  }    

  validarCurso(curso: Modulo): void {      
    const updatedCurso = {   
        ...curso,   
        validado: true,   
        estatus: true   
    };   
    console.log('Datos enviados al servidor:', updatedCurso); // Verifica los datos  
    this.http.put(`${this.apiUrl}/cursos/${curso.id}`, updatedCurso).subscribe({      
        next: (response) => {      
            // Actualiza el estado local      
            const index = this.modulosPendientes.findIndex(m => m.id === curso.id);      
            if (index !== -1) {      
                this.modulosPendientes.splice(index, 1); // Elimina de pendientes    
            }    
            this.modulosValidados.push({ ...curso, validado: true, estatus: true }); // Agrega a validados    
            console.log('Curso validado correctamente', response);      
        },      
        error: (err) => {      
            console.error('Error al validar el curso:', err);      
        },      
    });      
}    

  eliminarCurso(id: number): void {    
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {    
      this.http.delete(`${this.apiUrl}/cursos/${id}`).subscribe({    
        next: () => {    
          this.modulosPendientes = this.modulosPendientes.filter(m => m.id !== id);    
          console.log('Curso eliminado correctamente');    
        },    
        error: (err) => {    
          console.error('Error al eliminar el curso:', err);    
        },    
      });    
    }    
  }    

  verDetalles(curso: Modulo): void {    
    this.cursoDetalleSeleccionado = curso;    
    this.mostrarDetalleModal = true;    
  }    

  cerrarDetalleModal(): void {    
    this.mostrarDetalleModal = false;    
    this.cursoDetalleSeleccionado = null;    
  }    
}  