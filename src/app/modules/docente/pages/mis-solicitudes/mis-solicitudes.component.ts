import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { SolicitudCursoApi, SolicitudesCursosService } from '../../../../shared/services/solicitudes-cursos.service';
import { catchError, finalize, forkJoin, map, of, switchMap } from 'rxjs';
import { Curso, CursosService } from '../../../../shared/services/cursos.service';
import { DocenteHelper } from '../../commons/helpers/docente.helper';
import { AuthService } from '../../../../shared/services/auth.service';
import { DocenteService } from '../../../../shared/services/docente.service';
import { Router } from '@angular/router';

type Estado = 'Pendiente' | 'En Revisión' | 'Aprobado' | 'Rechazado';
type Prioridad = 'Prioridad Baja' | 'Prioridad Media' | 'Prioridad Alta';

type PrioridadUi = 'Prioridad Baja' | 'Prioridad Media' | 'Prioridad Alta';

interface Respuesta {
  mensaje: string;
  evaluador: string;
  fechaISO: string;
}


@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-solicitudes.component.html',
  styleUrl: './mis-solicitudes.component.scss'
})
export class MisSolicitudesComponent {
  // ---- estado de vista
  loading = signal<boolean>(true);
  errorMsg = signal<string | null>(null);

  // ---- datos
  solicitudes = signal<SolicitudCursoApi[]>([]);
  total = signal<number>(0);

  // ---- filtros locales
  activo = signal<'ALL' | Estado>('ALL');

  // ---- paginación
  page = signal<number>(1);
  pageSize = signal<number>(20);
private pendingLoads = 2;

  // Cambia este valor según el usuario autenticado
  docenteId = 0;
  // mapa de cursos por id (para no tocar el tipo de SolicitudCursoApi)
  cursosMap = signal<Map<number, Curso>>(new Map());

  filtros = [
    { key: 'ALL' as const, label: 'Todas' },
    { key: 'Pendiente' as Estado, label: 'Pendientes' },
    { key: 'En Revisión' as Estado, label: 'En Revisión' },
    { key: 'Aprobado' as Estado, label: 'Aprobadas' },
    { key: 'Rechazado' as Estado, label: 'Rechazadas' },
  ];
  docenteData: any;
  constructor(     private router: Router,
   private authService: AuthService,
    private docenteService: DocenteService,private svc: SolicitudesCursosService,private cursosService :CursosService) {}

  ngOnInit(): void {
    this.cargar();
    this.obtenerDatosDocenteYCursos();
  }
  async obtenerDatosDocenteYCursos(): Promise<void> {
   this.docenteData = await DocenteHelper.obtenerDatosDocenteYCursos(
      this.authService,
      this.docenteService
    );
    // console.log("this.docenteData",this.docenteData)
    this.docenteId=this.docenteData.id
    console.log("this.docenteId",this.docenteId)
  }
  cargar(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.svc.listarSolicitudes({
      docenteId: this.docenteId,
      estado: this.activo() === 'ALL' ? undefined : this.activo(),
      page: this.page(),
      pageSize: this.pageSize(),
    })
    .pipe(
      switchMap((res) => {
        const solicitudes = res.solicitudes as SolicitudCursoApi[];
        this.solicitudes.set(solicitudes);
        this.total.set(res.total ?? solicitudes.length);

        // IDs de curso únicos
        const uniqueIds = Array.from(
          new Set(
            solicitudes
              .map(s => s.cursoId)
              .filter((id): id is number => typeof id === 'number')
          )
        );

        if (uniqueIds.length === 0) {
          // No hay cursos, vaciamos el mapa y seguimos
          this.cursosMap.set(new Map());
          return of(null);
        }

        // Pedimos todos los cursos en paralelo
        const peticiones = uniqueIds.map(id => this.cursosService.getCursoById(id));

        return forkJoin(peticiones).pipe(
          map((cursos: Curso[]) => {
            const mapa = new Map<number, Curso>(cursos.map(c => [c.id, c]));
            this.cursosMap.set(mapa);
            return null;
          })
        );
      }),
      catchError(err => {
        console.error('Error al cargar:', err);
        this.errorMsg.set('No se pudieron cargar las solicitudes o los cursos.');
        // en caso de error, mantenemos datos previos
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    )
    .subscribe(() => {
      // listo
      console.log('Solicitudes:', this.solicitudes());
      // console.log('CursosMap:', this.cursosMap());
    });
  }



  setFiltro(key: 'ALL' | Estado) {
    this.activo.set(key);
    this.page.set(1); // reset paginación
    this.cargar();
  }

  // Contadores por estado (sobre el dataset cargado)
  count(key: 'ALL' | Estado): number {
    const data = this.solicitudes();
    if (key === 'ALL') return this.total(); // contador global del backend
    return data.filter(s => s.estado === key).length;
  }

  // Formato UI
  fechaCorta(iso: string | null | undefined) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  // Badges
  badgeEstadoClass(estado: Estado) {
    switch (estado) {
      case 'Pendiente':   return 'bg-amber-100 text-amber-800';
      case 'En Revisión': return 'bg-sky-100 text-sky-800';
      case 'Aprobado':    return 'bg-emerald-100 text-emerald-800';
      case 'Rechazado':   return 'bg-rose-100 text-rose-800';
    }
  }

  // El API manda prioridad "Baja/Media/Alta"; la UI muestra "Prioridad X"
  prioridadUi(p: 'Baja' | 'Media' | 'Alta'): PrioridadUi {
    return p === 'Alta' ? 'Prioridad Alta' : p === 'Media' ? 'Prioridad Media' : 'Prioridad Baja';
  }
  badgePrioridadClass(p: 'Baja' | 'Media' | 'Alta') {
    switch (p) {
      case 'Alta':  return 'bg-rose-100 text-rose-800';
      case 'Media': return 'bg-amber-100 text-amber-800';
      case 'Baja':  return 'bg-slate-100 text-slate-700';
    }
  }

  // Acciones UI
  nuevaSolicitud() { 
            this.router.navigate(["/docente/cursos-solitud"])

    /* navegación o modal */ }
  volver() { /* navegación atrás */ }

  // Paginación simple
  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  prevPage() { if (this.page() > 1) { this.page.update(p => p - 1); this.cargar(); } }
  nextPage() { if (this.page() < this.totalPages()) { this.page.update(p => p + 1); this.cargar(); } }
}
