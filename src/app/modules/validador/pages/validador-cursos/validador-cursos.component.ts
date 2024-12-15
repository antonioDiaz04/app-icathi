import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.prod';

interface PlantelCurso {
    id: number; // ID de la relación plantel_curso
    plantel_id: number;
    plantel_nombre: string;
    curso_id: number;
    curso_nombre: string;
    curso_validado: boolean; // Para saber si está validado
}

@Component({
    selector: 'app-validador-cursos',
    templateUrl: './validador-cursos.component.html',
    styleUrls: ['./validador-cursos.component.scss']
})
export class ValidadorCursosComponent implements OnInit {
    plantelesCursosNoValidados: PlantelCurso[] = [];
    plantelesCursosValidados: PlantelCurso[] = [];
    plantelSeleccionado: string | null = null; // Solo el nombre del plantel
    cursosSolicitados: PlantelCurso[] = [];
    cursosNoValidados: PlantelCurso[] = []; // Para almacenar cursos no validados
    cursosValidados: PlantelCurso[] = []; // Para almacenar cursos validados
    plantelesConCursosValidados: Set<string> = new Set(); // Para almacenar los nombres de planteles con cursos validados
    mostrarDetalleModal: boolean = false;
    mostrarCursosValidadosModal: boolean = false; // Para mostrar el modal de cursos validados
    private apiUrl = `${environment.api}`;

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.cargarPlantelesCursosNoValidados();
        this.cargarPlantelesCursosValidados();
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
                // Inicializar la lista de cursos validados
                this.cursosValidados = [...this.plantelesCursosValidados]; // Mantener los cursos validados
                this.plantelesCursosValidados.forEach(pc => {
                    this.plantelesConCursosValidados.add(pc.plantel_nombre); // Agregar planteles a la lista
                });
            },
            error: (err) => {
                console.error('Error al cargar los planteles y cursos validados:', err);
            },
        });
    }

    seleccionarPlantel(plantel_nombre: string): void {
        this.plantelSeleccionado = plantel_nombre;

        // Filtrar solo los cursos del plantel seleccionado
        this.cursosSolicitados = [
            ...this.plantelesCursosNoValidados.filter(pc => pc.plantel_nombre === plantel_nombre),
            ...this.plantelesCursosValidados.filter(pc => pc.plantel_nombre === plantel_nombre) // Usar cursos validados
        ];

        // Filtrar cursos no validados
        this.cursosNoValidados = this.cursosSolicitados.filter(c => !c.curso_validado);

        // Filtrar cursos validados solo para el plantel seleccionado
        this.cursosValidados = this.plantelesCursosValidados.filter(pc => pc.plantel_nombre === plantel_nombre);

        console.log('Cursos solicitados:', this.cursosSolicitados);
        this.mostrarDetalleModal = true; // Mostrar el modal
    }

    cerrarDetalleModal(): void {
        this.mostrarDetalleModal = false;
        this.plantelSeleccionado = null;
        this.cursosSolicitados = []; // Limpiar cursos al cerrar el modal
        this.cursosNoValidados = [];
    }

    mostrarCursosValidados(): void {
        this.mostrarCursosValidadosModal = true; // Mostrar el modal de cursos validados
    }

    cerrarCursosValidadosModal(): void {
        this.mostrarCursosValidadosModal = false; // Cerrar el modal de cursos validados
    }

   actualizarEstatusSolicitud(id: number, estatus: boolean, observacion?: string): void {
    console.log('ID de la solicitud a actualizar:', id);
    const body = {
        estatus,
        observacion
    };

    this.http.put(`${this.apiUrl}/plantelesCursos/${id}`, body).subscribe({
        next: (response) => {
            console.log('Estatus de la solicitud actualizado correctamente:', response);

            // Encuentra el curso actualizado
            const curso = this.cursosSolicitados.find(c => c.id === id);
            if (curso) {
                curso.curso_validado = estatus;

                if (estatus) {
                    // Mover a validados
                    if (!this.cursosValidados.some(c => c.id === id)) {
                        this.cursosValidados.push(curso);
                    }
                    this.cursosNoValidados = this.cursosNoValidados.filter(c => c.id !== id);

                    // Eliminar el plantel si no tiene más cursos no validados
                    const tienePendientes = this.plantelesCursosNoValidados.some(
                        c => c.plantel_nombre === curso.plantel_nombre && !c.curso_validado
                    );
                    if (!tienePendientes) {
                        this.plantelesCursosNoValidados = this.plantelesCursosNoValidados.filter(
                            c => c.plantel_nombre !== curso.plantel_nombre
                        );
                    }
                } else {
                    // Mover a no validados
                    this.cursosNoValidados.push(curso);
                    this.cursosValidados = this.cursosValidados.filter(c => c.id !== id);

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

}