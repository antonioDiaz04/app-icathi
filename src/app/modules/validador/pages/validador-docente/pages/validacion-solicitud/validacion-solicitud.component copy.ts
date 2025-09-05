// import { CommonModule } from '@angular/common';
// import { Component, computed, signal } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Curso, CursosService } from '../../../../../../shared/services/cursos.service';
// import { SolicitudCursoApi, SolicitudesCursosService } from '../../../../../../shared/services/solicitudes-cursos.service';
// import { DocenteService } from '../../../../../../shared/services/docente.service';
// import { catchError, finalize, forkJoin, map, of, switchMap } from 'rxjs';
// import { DocenteHelper } from '../../../../../docente/commons/helpers/docente.helper';
// import { AuthService } from '../../../../../../shared/services/auth.service';

// type Estado = 'Pendiente' | 'En Revisión' | 'Aprobado' | 'Rechazado';
// type Prioridad = 'Alta' | 'Media' | 'Baja';

// interface Solicitud {
//   id: number;
//   docente: {
//     nombre: string;
//     email: string;
//     telefono: string;
//     cedula: string;
//     experiencia: string;
//   };
//   curso: {
//     nombre: string;
//     modalidad: string;
//     categoria: string;
//     duracionHoras: number;
//   };
//   fecha: string; // ISO
//   prioridad: Prioridad;
//   estado: Estado;
//   justificacion: string;
//   comentarios?: string;
// }

// @Component({
//   selector: 'app-validacion-solicitud',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './validacion-solicitud.component.html',
//   styleUrl: './validacion-solicitud.component.scss'
// })
// export class ValidacionSolicitudComponent {
//   // --- UI ---
//   readonly tabs = ['dashboard', 'pendientes', 'revision', 'aprobadas', 'rechazadas'] as const;
//   activeTab = signal<(typeof this.tabs)[number]>('dashboard');
//   loading = signal(true);
//   docenteData: any;
//   // --- Datos (signals) ---
//   solicitudes = signal<SolicitudCursoApi[]>([]);
//   // loading: boolean = true;
//   // Simula carga inicial
//   docenteId: string = ''; // ID del docente obtenido de la URL

//   constructor(private authService: AuthService, private docenteService: DocenteService, private svc: SolicitudesCursosService, private cursosService: CursosService) {
//     this.cargar()
//   }
//   cargar(): void {
//     this.loading.set(true);;
//     // this.errorMsg=null;

//     this.svc.listarSolicitudes()
//       .pipe(
//         switchMap((res) => {
//           const solicitudes = res.solicitudes as SolicitudCursoApi[];
//           this.solicitudes.set(solicitudes);
//           // this.total.set(res.total ?? solicitudes.length);

//           // IDs de curso únicos
//           const uniqueIds = Array.from(
//             new Set(
//               solicitudes
//                 .map(s => s.cursoId)
//                 .filter((id): id is number => typeof id === 'number')
//             )
//           );

//           if (uniqueIds.length === 0) {
//             // No hay cursos, vaciamos el mapa y seguimos
//             this.cursosMap.set(new Map());
//             return of(null);
//           }

//           // Pedimos todos los cursos en paralelo
//           const peticiones = uniqueIds.map(id => this.cursosService.getCursoById(id));

//           return forkJoin(peticiones).pipe(
//             map((cursos: Curso[]) => {
//               const mapa = new Map<number, Curso>(cursos.map(c => [c.id, c]));
//               this.cursosMap.set(mapa);
//               return null;
//             })
//           );
//         }),
//         catchError(err => {
//           console.error('Error al cargar:', err);
//           // this.errorMsg.set('No se pudieron cargar las solicitudes o los cursos.');
//           // en caso de error, mantenemos datos previos
//           return of(null);
//         }),
//         finalize(() => this.loading.set(false))
//       )
//       .subscribe(() => {
//         // listo
//         console.log('Solicitudes:', this.solicitudes());
//         // console.log('CursosMap:', this.cursosMap());
//       });
//   }
//   // mostrar solicitudes1
//   cursosMap = signal<Map<number, Curso>>(new Map());
//   // asy
//   // --- Derivados (computed) ---
//   resumen = computed(() => {
//     const arr = this.solicitudes();
//     return {
//       total: arr.length,
//       pendientes: arr.filter(s => s.estado === 'Pendiente').length,
//       revision: arr.filter(s => s.estado === 'En Revisión').length,
//       aprobadas: arr.filter(s => s.estado === 'Aprobado').length,
//       rechazadas: arr.filter(s => s.estado === 'Rechazado').length,
//     };
//   });

//   filtradas = computed(() => {
//     const tab = this.activeTab();
//     const arr = this.solicitudes();
//     if (tab === 'dashboard') return arr;
//     if (tab === 'pendientes') return arr.filter(s => s.estado === 'Pendiente');
//     if (tab === 'revision') return arr.filter(s => s.estado === 'En Revisión');
//     if (tab === 'aprobadas') return arr.filter(s => s.estado === 'Aprobado');
//     return arr.filter(s => s.estado === 'Rechazado'); // 'rechazadas'
//   });

//   // --- Acciones ---
//   setTab(tab: (typeof this.tabs)[number]) {
//     this.activeTab.set(tab);
//     // Puedes re-simular carga por tab si quieres:
//     // this.loading.set(true); setTimeout(() => this.loading.set(false), 500);
//   }

//   cambiarEstado(id: number, estado: Estado) {
//     this.solicitudes.update(list =>
//       list.map(s => (s.id === id ? { ...s, estado } : s)),
//     );
//   }

//   getIniciales(nombre: string) {
//     return nombre
//       .split(' ')
//       .filter(Boolean)
//       .slice(0, 2)
//       .map(n => n[0]?.toUpperCase())
//       .join('');
//   }

//   prioridadClasses(p: Prioridad): string {
//     switch (p) {
//       case 'Alta':
//         return 'bg-red-50 text-red-700 ring-1 ring-red-200';
//       case 'Media':
//         return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
//       default:
//         return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
//     }
//   }

//   estadoClasses(e: Estado): string {
//     switch (e) {
//       case 'Pendiente':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'En Revisión':
//         return 'bg-indigo-100 text-indigo-800';
//       case 'Aprobado':
//         return 'bg-emerald-100 text-emerald-800';
//       default:
//         return 'bg-rose-100 text-rose-800';
//     }
//   }

//   trackById = (_: number, s: Solicitud) => s.id;
// }
