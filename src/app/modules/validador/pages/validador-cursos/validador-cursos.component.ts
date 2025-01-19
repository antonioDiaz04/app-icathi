import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.prod';
import { DomSanitizer } from '@angular/platform-browser'; // Importa DomSanitizer
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface PlantelCurso {
    plantel_curso_id: number; // ID de la relación plantel_curso
    plantel_id: number;
    curso_id: number;
    cupo_maximo: number;
    requisitos_extra: string;
    fecha_inicio: string;
    fecha_fin: string;
    estatus_id: number;
    created_at: string;
    updated_at: string;
    temario_url: string;
    cant_instructores: number;
    horario_id: number;
    sector_atendido: string;
    rango_edad: string;
    cruzada_contra_hambre: boolean;
    tipo_beca: string;
    participantes: number;
    cuota_tipo: string;
    cuota_monto: number;
    pagar_final: boolean;
    convenio_numero: string;
    equipo_necesario: boolean;
    tipo_curso: number;
    horario: string;
    estatus: boolean;
    tipos_curso: string;
    plantel_nombre: string;
    curso_nombre: string;
    curso_validado: boolean;
    sugerencia: string;
    tipo_curso_nombre: string; // Agregar esta propiedad
    
}

@Component({
    selector: 'app-validador-cursos',
    templateUrl: './validador-cursos.component.html',
    styleUrls: ['./validador-cursos.component.scss'],
    standalone: false
})

export class ValidadorCursosComponent implements OnInit {
    
    plantelesCursosNoValidados: PlantelCurso[] = [];
    plantelesCursosValidados: PlantelCurso[] = [];
    plantelSeleccionado: string | null = null; // Solo el nombre del plantel
    cursosSolicitados: PlantelCurso[] = [];
    cursosNoValidados: PlantelCurso[] = []; // Para almacenar cursos no validados
    cursosValidados: PlantelCurso[] = []; // Para almacenar cursos validados
    plantelesConCursosValidados: PlantelCurso[] = []; // Cambiado a un array para almacenar los planteles con cursos validados
    mostrarDetalleModal: boolean = false;
    cursoSeleccionado: PlantelCurso | null = null; // Variable para almacenar el curso seleccionado
    plantelesUnicos: { plantel_id: number; plantel_nombre: string; plantel_curso_id: number }[] = [];
    private apiUrl = `${environment.api}`;
    sugerencia: string = ''; // Nueva propiedad para almacenar la sugerencia

    public sanitizer: DomSanitizer; // Cambiado a public

    constructor(private http: HttpClient, sanitizer: DomSanitizer, private  router: Router) { 
        this.sanitizer = sanitizer; // Asigna el sanitizer en el constructor
    }

    ngOnInit(): void {
        this.cargarPlantelesCursosNoValidados();
        this.cargarPlantelesCursosValidados();
        this.cargarPlantelesUnicos();
        console.log('Cursos solicitados:', this.cursosSolicitados);
    }

    cargarPlantelesCursosNoValidados(): void {
        this.http.get<PlantelCurso[]>(`${this.apiUrl}/plantelesCursos/plantelesConCursosNoValidados`).subscribe({
            next: (data) => {
                this.plantelesCursosNoValidados = data;
                console.log('Planteles y cursos no validados cargados:', this.plantelesCursosNoValidados);
            },
            error: (err) => {
                console.error('Error al cargar los planteles y cursos no validados:', err);
            },
        });
    }

    cargarPlantelesCursosValidados(): void {
        this.http.get<PlantelCurso[]>(`${this.apiUrl}/plantelesCursos/plantelesConCursosValidados`).subscribe({
            next: (data) => {
                this.plantelesCursosValidados = data;
                console.log('Planteles y cursos validados cargados:', this.plantelesCursosValidados);
                // Inicializar la lista de planteles con cursos validados
                this.plantelesConCursosValidados = this.plantelesCursosValidados.map(pc => ({
                    ...pc, // Copia todas las propiedades del objeto original
                    plantel_nombre: pc.plantel_nombre,
                    curso_nombre: pc.curso_nombre,
                    curso_validado: pc.curso_validado
                }));
            },
            error: (err) => {
                console.error('Error al cargar los planteles y cursos validados:', err);
            },
        });
    }

    verDetallesCurso(curso: PlantelCurso): void {
        if (!curso || !curso.plantel_curso_id) {
            console.error('ID del curso es undefined', curso);
            return;
        }
        this.cursoSeleccionado = curso;
        this.mostrarDetalleModal = true;

        // Aquí se hace la solicitud solo si el ID es válido
        this.http.get<any>(`${this.apiUrl}/planteles/detalleCurso/${curso.plantel_curso_id}`).subscribe({
            next: (data) => {
                this.cursoSeleccionado = data; // Asigna los detalles del curso
            },
            error: (err) => {
                console.error('Error al obtener los detalles del curso:', err);
            },
        });
    }

    cerrarDetalleModal(): void {
        this.mostrarDetalleModal = false;
        this.plantelSeleccionado = null;
        this.cursosSolicitados = []; // Limpiar cursos al cerrar el modal
        this.cursosNoValidados = [];
        this.cursoSeleccionado = null; // Limpiar la selección del curso
    }

    actualizarEstatusSolicitud(id: number, estatus: boolean, sugerencia: string, observacion?: string): void {
        console.log('ID de la solicitud a actualizar:', id);
        const body = {
            estatus,
            sugerencia,
            observacion
        };

        this.http.put(`${this.apiUrl}/plantelesCursos/${id}`, body).subscribe({
            next: (response) => {
                console.log('Estatus de la solicitud actualizado correctamente:', response);

                // Encuentra el curso actualizado
                const curso = this.cursosSolicitados.find(c => c.plantel_curso_id === id);
                if (curso) {
                    curso.estatus = estatus;
                    curso.sugerencia = sugerencia;

                    if (estatus) {
                        // Mover a validados
                        if (!this.cursosValidados.some(c => c.plantel_curso_id === id)) {
                            this.cursosValidados.push(curso);
                        }
                        this.cursosNoValidados = this.cursosNoValidados.filter(c => c.plantel_curso_id !== id);

                        // Eliminar el plantel si no tiene más cursos no validados
                        const tienePendientes = this.plantelesCursosNoValidados.some(
                            c => c.plantel_nombre === curso.plantel_nombre && !c.estatus
                        );
                        if (!tienePendientes) {
                            this.plantelesCursosNoValidados = this.plantelesCursosNoValidados.filter(
                                c => c.plantel_nombre !== curso.plantel_nombre
                            );
                        }
                    } else {
                        // Mover a no validados
                        this.cursosNoValidados.push(curso);
                        this.cursosValidados = this.cursosValidados.filter(c => c.plantel_curso_id !== id);

                        // Reagregar el plantel si vuelve a tener pendientes
                        const yaExiste = this.plantelesCursosNoValidados.some(
                            c => c.plantel_nombre === curso.plantel_nombre
                        );
                        if (!yaExiste) {
                            this.plantelesCursosNoValidados.push(curso);
                        }
                    }
                }
            },
            error: (err) => {
                console.error('Error al actualizar el estatus de la solicitud:', err);
                alert('Error al actualizar el estatus. Inténtalo de nuevo.');
            }
        });
    }


    logout(): void {
        const request = indexedDB.open('authDB'); // Nombre de la base de datos
    
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction('tokens', 'readwrite'); // Nombre de la tabla/almacén
          const store = transaction.objectStore('tokens');
    
          // Eliminar el token
          const deleteRequest = store.delete('authToken'); // Clave del token
    
          deleteRequest.onsuccess = () => {
            console.log('Token eliminado correctamente.');
            this.router.navigate(['/']); // Redirige al login
          };
    
          deleteRequest.onerror = (error) => {
            console.error('Error al eliminar el token:', error);
          };
        };
    
        request.onerror = (error) => {
          console.error('Error al abrir la base de datos:', error);
        };
      }

    cargarPlantelesUnicos(): void {
        this.http.get<{ plantel_id: number; plantel_nombre: string; plantel_curso_id: number }[]>(`${this.apiUrl}/planteles/solicitudes`).subscribe({
            next: (data) => {
                this.plantelesUnicos = data.filter(
                    (value, index, self) =>
                        self.findIndex((t) => t.plantel_id === value.plantel_id) === index
                );
                console.log('Planteles únicos cargados:', this.plantelesUnicos);
            },
            error: (err) => {
                console.error('Error al cargar la lista de planteles únicos:', err);
            },
        });
    }

    cargarCursosPorPlantel(plantelId: number): void {
        console.log('Plantel ID recibido:', plantelId);
        this.http.get<PlantelCurso[]>(`${this.apiUrl}/planteles/cursosporplantel/${plantelId}`).subscribe({
            next: (data) => {
                this.cursosSolicitados = data;
                console.log(`Cursos del plantel ${plantelId} cargados:`, this.cursosSolicitados);
            },
            error: (err) => {
                console.error(`Error al cargar los cursos del plantel ${plantelId}:`, err);
            },
        });
    }
    
    regresarAlPanel() {
        this.router.navigate(['/panel-validaciones']); // Ajusta la ruta según tu configuración
    }
    // Método para manejar la validación del curso
    validarCurso(): void {
        if (this.cursoSeleccionado) {
            const nuevoEstatus = !this.cursoSeleccionado.estatus;
            this.actualizarEstatusSolicitud(this.cursoSeleccionado.plantel_curso_id, nuevoEstatus, this.sugerencia);
            alert(`El curso ha sido ${nuevoEstatus ? 'validado' : 'desvalidado'} correctamente.`);

        }
    }
     // Método para manejar el evento input y actualizar la sugerencia
     enviarSugerencia(): void {
        if (this.cursoSeleccionado) {
            const body = {
                sugerencia: this.sugerencia
            };
    
            this.http.put(`${this.apiUrl}/plantelesCursos/${this.cursoSeleccionado.plantel_curso_id}`, body).subscribe({
                next: (response) => {
                    console.log('Sugerencia enviada correctamente:', response);
                    alert('Sugerencia enviada correctamente.');
                },
                error: (err) => {
                    console.error('Error al enviar la sugerencia:', err);
                    alert('Error al enviar la sugerencia. Inténtalo de nuevo.');
                }
            });
        }
    }
};