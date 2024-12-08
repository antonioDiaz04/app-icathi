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
  certificado_profesional?: boolean;
  cedula_profesional?: string;
  documento_identificacion?: string;
  num_documento_identificacion?: string;
  curriculum_url?: string;
  estatus?: boolean;
  usuario_validador_id?: number;
  fecha_validacion?: string;
  foto_url?: string;
}

@Component({
  selector: 'app-docentes',
  templateUrl: './docentes.component.html',
  styleUrls: ['./docentes.component.scss'],
})
export class DocentesComponent implements OnInit {
  docentes: Docente[] = [];
  mostrarFormulario = false;
  mostrarModal = false;
  mostrarDetalleModal = false;

  docenteSeleccionado: Docente | null = null;
  docenteDetalleSeleccionado: Docente | null = null;

  nuevoDocente: Partial<Docente> = {
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    especialidad: '',
    certificado_profesional: false,
    cedula_profesional: '',
    documento_identificacion: '',
    num_documento_identificacion: '',
    curriculum_url: '',
    estatus: true,
    usuario_validador_id: undefined,
    fecha_validacion: '',
    foto_url: '',
  };

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

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (this.mostrarFormulario) {
      this.nuevoDocente = {
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        especialidad: '',
        certificado_profesional: false,
        cedula_profesional: '',
        documento_identificacion: '',
        num_documento_identificacion: '',
        curriculum_url: '',
        estatus: true,
        usuario_validador_id: undefined,
        fecha_validacion: '',
        foto_url: '',
      };
    }
  }

  agregarDocente(): void {
    console.log('Datos enviados al backend:', this.nuevoDocente);

    this.http.post<Docente>(`${this.apiUrl}/docentes`, this.nuevoDocente).subscribe({
      next: (docenteCreado) => {
        this.docentes.push(docenteCreado);
        this.mostrarFormulario = false;
        console.log('Docente agregado correctamente');
      },
      error: (err) => {
        console.error('Error al agregar el docente:', err);
      },
    });
  }

  editarDocente(docente: Docente): void {
    this.docenteSeleccionado = { ...docente };
    this.mostrarModal = true;
  }

  guardarEdicion(): void {
    if (this.docenteSeleccionado) {
      console.log('Datos a actualizar:', this.docenteSeleccionado);
      this.http
        .put<Docente>(
          `${this.apiUrl}/docentes/${this.docenteSeleccionado.id}`,
          this.docenteSeleccionado
        )
        .subscribe({
          next: (docenteActualizado) => {
            const index = this.docentes.findIndex(
              (d) => d.id === this.docenteSeleccionado!.id
            );
            if (index !== -1) {
              this.docentes[index] = { ...docenteActualizado };
            }
            console.log('Docente actualizado correctamente');
            this.cerrarModal();
          },
          error: (err) => {
            console.error('Error al actualizar el docente:', err);
          },
        });
    }
  }

  eliminarDocente(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este docente?')) {
      this.http.delete(`${this.apiUrl}/docentes/${id}`).subscribe({
        next: () => {
          this.docentes = this.docentes.filter((d) => d.id !== id);
          console.log('Docente eliminado correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar el docente:', err);
        },
      });
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.docenteSeleccionado = null;
  }

  verDetalles(docente: Docente): void {
    this.docenteDetalleSeleccionado = docente;
    this.mostrarDetalleModal = true;
  }

  cerrarDetalleModal(): void {
    this.mostrarDetalleModal = false;
    this.docenteDetalleSeleccionado = null;
  }
}