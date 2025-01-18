import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.prod';
import { DomSanitizer } from '@angular/platform-browser'; // Importa DomSanitizer
import { Router } from '@angular/router';

interface PlantelCurso {
    id: number; // ID de la relación plantel_curso
    plantel_id: number;
    plantel_nombre: string;
    curso_id: number;
    curso_nombre: string;
    curso_validado: boolean; // Para saber si está validado
    horario?: string; // Agregado para evitar errores si no se proporciona
    cupo_maximo?: number; // Agregado para evitar errores si no se proporciona
    requisitos_extra?: string; // Agregado para evitar errores si no se proporciona
    fecha_inicio?: string; // Agregado para evitar errores si no se proporciona
    fecha_fin?: string; // Agregado para evitar errores si no se proporciona
    estatus?: boolean; // Agregado para evitar errores si no se proporciona
    temario_url?: string; // URL del temario
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
    private apiUrl = `${environment.api}`;
    public sanitizer: DomSanitizer; // Cambiado a public

    constructor(private http: HttpClient, sanitizer: DomSanitizer, private  router: Router) { 
        this.sanitizer = sanitizer; // Asigna el sanitizer en el constructor
    }

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
                // Inicializar la lista de planteles con cursos validados
                this.plantelesConCursosValidados = this.plantelesCursosValidados.map(pc => ({
                    id: pc.id, // Asegúrate de incluir el ID
                    plantel_id: pc.plantel_id, // Asegúrate de incluir el ID del plantel
                    plantel_nombre: pc.plantel_nombre,
                    curso_id: pc.curso_id, // Asegúrate de incluir el ID del curso
                    curso_nombre: pc.curso_nombre,
                    curso_validado: pc.curso_validado,
                    horario: pc.horario,
                    cupo_maximo: pc.cupo_maximo,
                    requisitos_extra: pc.requisitos_extra,
                    fecha_inicio: pc.fecha_inicio,
                    fecha_fin: pc.fecha_fin,
                    estatus: pc.estatus,
                    temario_url: pc.temario_url
                }));
            },
            error: (err) => {
                console.error('Error al cargar los planteles y cursos validados:', err);
            },
        });
    }

    verDetallesCurso(curso: PlantelCurso): void {
        this.cursoSeleccionado = curso; // Almacena el curso seleccionado
        this.mostrarDetalleModal = true; // Muestra el modal

        // Aquí se puede hacer una llamada a la API si se necesita obtener más detalles
        // En este caso, ya tenemos todos los detalles en el objeto `curso`
        // Si necesitas hacer una llamada a la API, descomenta la siguiente línea:
        
        this.http.get<PlantelCurso>(`${this.apiUrl}/plantelesCursos/curso/${curso.id}`).subscribe({
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
    
}