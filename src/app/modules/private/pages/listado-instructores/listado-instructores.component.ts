import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

export interface Docente {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  especialidad?: string;
  cedula_profesional?: string;
  curriculum_url?: string;
  documento_identificacion?: string;
  estatus_tipo?: string; // Nueva propiedad
  estatus_valor?: string; // Nueva propiedad
  foto_url?: string; // Para mostrar la imagen
}

@Component({
  selector: 'app-listado-instructores',
  templateUrl: './listado-instructores.component.html',
  styleUrls: ['./listado-instructores.component.scss']
})
export class ListadoInstructoresComponent implements OnInit {
  docentes: Docente[] = [];
  mostrarDetalleModal = false;
  docenteSeleccionado: Docente | null = null;

  private apiUrl = `${environment.api}`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarDocentes();
  }

  cargarDocentes(): void {
    const url = `${this.apiUrl}/docentes`;
    console.log('Solicitando datos a:', url);

    this.http.get<Docente[]>(url).subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.docentes = data;
      },
      error: (err) => {
        console.error('Error al cargar los docentes:', err);
      },
    });
  }

  verDetalles(docente: Docente): void {
    this.docenteSeleccionado = docente;
    this.mostrarDetalleModal = true;
  }

  cerrarDetalleModal(): void {
    this.mostrarDetalleModal = false;
    this.docenteSeleccionado = null;
  }
}