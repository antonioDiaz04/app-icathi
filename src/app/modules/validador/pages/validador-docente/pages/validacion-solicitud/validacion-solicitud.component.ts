import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Curso, CursosService } from '../../../../../../shared/services/cursos.service';
import { SolicitudCursoApi, SolicitudesCursosService } from '../../../../../../shared/services/solicitudes-cursos.service';
import { Docente, DocenteService } from '../../../../../../shared/services/docente.service';
import { catchError, finalize, forkJoin, map, of, switchMap } from 'rxjs';
// import { DocenteHelper } from '../../../../../docente/commons/helpers/docente.helper';
import { AuthService } from '../../../../../../shared/services/auth.service';

type Estado = 'Pendiente' | 'En Revisión' | 'Aprobado' | 'Rechazado';
type Prioridad = 'Alta' | 'Media' | 'Baja';



@Component({
  selector: 'app-validacion-solicitud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './validacion-solicitud.component.html',
  styleUrl: './validacion-solicitud.component.scss'
})
export class ValidacionSolicitudComponent {
  // --- UI ---
  readonly tabs = ['dashboard', 'pendientes', 'revision', 'aprobadas', 'rechazadas'] as const;
  activeTab = signal<(typeof this.tabs)[number]>('dashboard');
  loading = signal(true);
  docenteData: any;
  // --- Datos (signals) ---
  solicitudes = signal<SolicitudCursoApi[]>([]);
  // loading: boolean = true;
  // Simula carga inicial
  docenteId: string = ''; // ID del docente obtenido de la URL
  // mostrar solicitudes1
  cursosMap = signal<Map<number, Curso>>(new Map());
  docentesMap = signal<Map<number, Docente>>(new Map());
  constructor(private authService: AuthService, private docenteService: DocenteService, private svc: SolicitudesCursosService, private cursosService: CursosService) {
    this.cargar()
  }
  q = signal(''); // <- antes era string plano

  cargar(): void {
    this.loading.set(true);

    this.svc.listarSolicitudes()
      .pipe(
        switchMap((res) => {
          const solicitudes = res.solicitudes ?? [];
          this.solicitudes.set(solicitudes);

          // IDs únicos de cursos y docentes
          const cursoIds = Array.from(new Set(
            solicitudes.map(s => s.cursoId).filter((id): id is number => typeof id === 'number')
          ));
          const docenteIds = Array.from(new Set(
            solicitudes.map(s => s.docenteId).filter((id): id is number => typeof id === 'number' && id > 0)
          ));

          // Arma peticiones en paralelo (cursos + docentes)
          const reqCursos = cursoIds.length
            ? forkJoin(cursoIds.map(id => this.cursosService.getCursoById(id)))
            : of<Curso[]>([]);

          const reqDocentes = docenteIds.length
            ? forkJoin(docenteIds.map(id => this.docenteService.getById(id)))
            : of<Docente[]>([]);

          return forkJoin([reqCursos, reqDocentes]).pipe(
            map(([cursos, docentes]) => {
              // Map de cursos
              const cursosM = new Map<number, Curso>(cursos.map(c => [c.id, c]));
              this.cursosMap.set(cursosM);

              const docentesM = new Map<number, Docente>(docentes.map(d => [d.id, d]));
              this.docentesMap.set(docentesM);

              return null;
            })
          );
        }),
        catchError(err => {
          console.error('Error al cargar:', err);
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe();
  }

  resumen = computed(() => {
    const arr = this.solicitudes();
    return {
      total: arr.length,
      pendientes: arr.filter(s => s.estado === 'Pendiente').length,
      revision: arr.filter(s => s.estado === 'En Revisión').length,
      aprobadas: arr.filter(s => s.estado === 'Aprobado').length,
      rechazadas: arr.filter(s => s.estado === 'Rechazado').length,
    };
  });
   filtradas = computed(() => {
    const tab = this.activeTab();
    const arr = this.solicitudes();

    const q = this.q().toLowerCase(); // <- lee la signal

    // 1) Filtrar por estado según tab
    let byTab = arr;
    if (tab === 'pendientes') byTab = arr.filter(s => s.estado === 'Pendiente');
    else if (tab === 'revision') byTab = arr.filter(s => s.estado === 'En Revisión');
    else if (tab === 'aprobadas') byTab = arr.filter(s => s.estado === 'Aprobado');
    else if (tab === 'rechazadas') byTab = arr.filter(s => s.estado === 'Rechazado');

    if (!q) return byTab;

    // 2) Búsqueda por docente/curso
    const dMap = this.docentesMap();
    const cMap = this.cursosMap();

    return byTab.filter(s => {
      const d = dMap.get(s.docenteId);
      const c = cMap.get(s.cursoId);

      const docenteStr = [
        d?.nombre ?? '',
        (d as any)?.apellidos ?? '',
        d?.email ?? ''
      ].join(' ').toLowerCase();

      const cursoStr = [
        c?.nombre ?? '',
        c?.tipo_curso_nombre ?? '',
        c?.area_nombre ?? ''
      ].join(' ').toLowerCase();

      return docenteStr.includes(q) || cursoStr.includes(q);
    });
  });
  // --- Acciones ---
  setTab(tab: (typeof this.tabs)[number]) {
    this.activeTab.set(tab);
    // Puedes re-simular carga por tab si quieres:
    // this.loading.set(true); setTimeout(() => this.loading.set(false), 500);
  }

  cambiarEstado(id: number, estado: Estado) {
    this.solicitudes.update(list =>
      list.map(s => (s.id === id ? { ...s, estado } : s)),
    );
  }

  getIniciales(nombre: string) {
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(n => n[0]?.toUpperCase())
      .join('');
  }

  prioridadClasses(p: Prioridad): string {
    switch (p) {
      case 'Alta':
        return 'bg-red-50 text-red-700 ring-1 ring-red-200';
      case 'Media':
        return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
    }
  }

  estadoClasses(e: Estado): string {
    switch (e) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'En Revisión':
        return 'bg-indigo-100 text-indigo-800';
      case 'Aprobado':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-rose-100 text-rose-800';
    }
  }

  // trackById = (_: number, s: Solicitud) => s.id;
  // --- UI búsqueda ---
  // q = ''; // ngModel del input
  onSearch(value: string) {
    this.q.set((value || '').trim());
  }

  clearSearch() {
    this.q.set('');
  }
  // Etiqueta amigable para el tab actual (solo vista)
  labelTab(tab: (typeof this.tabs)[number]) {
    return tab === 'dashboard' ? 'Todos'
      : tab === 'pendientes' ? 'Pendientes'
        : tab === 'revision' ? 'En Revisión'
          : tab === 'aprobadas' ? 'Aprobadas'
            : 'Rechazadas';
  }


  


  // --- Guardado/Loading por solicitud ---
private savingIds = signal<Set<number>>(new Set());

isSaving(id: number) {
  return this.savingIds().has(id);
}
private get evaluadorId(): number | undefined {
  try {
    // ej.: this.authService.userValue?.id || this.authService.usuario?.id
    const u: any = (this.authService as any)?.user || (this.authService as any)?.usuario || null;
    return u?.id ?? u?.userId ?? undefined;
  } catch { return undefined; }
}

private setSaving(id: number, saving: boolean) {
  const set = new Set(this.savingIds());
  if (saving) set.add(id); else set.delete(id);
  this.savingIds.set(set);
}

// Botón principal
onActualizar(s: SolicitudCursoApi) {
  // Optimista: ya tienes s.estado y s.respuestaMensaje en el modelo
  this.setSaving(s.id, true);
  console.log(  s.estado,
     s.respuestaMensaje,
     this.evaluadorId )
  // 1) Cambiar estado en su endpoint
  this.svc.cambiarEstado(s.id, {   estado: s.estado,
    respuestaMensaje: s.respuestaMensaje ?? '',
    evaluadorId: this.evaluadorId })
    .pipe(
      // 2) Guardar respuestaMensaje si existe (o vacía)
      switchMap(() => this.svc.actualizarSolicitud(s.id, {
        respuestaMensaje: s.respuestaMensaje ?? ''
      })),
      finalize(() => this.setSaving(s.id, false)),
      catchError(err => {
        console.error('Error al actualizar solicitud', err);
        // revertir si quieres (ejemplo simple: recargar)
        // this.cargar();
        return of(null);
      })
    )
    .subscribe(resp => {
      // Si tu API regresa el recurso actualizado, sincroniza el arreglo local:
      if (resp) {
        this.solicitudes.update(list =>
          list.map(it => it.id === s.id ? { ...it, ...resp } as any : it)
        );
      }
    });
}
// --- debajo de las otras signals ---
brokenAvatars = signal<Set<number>>(new Set());

// --- helpers de avatar ---
hasFoto(d: Partial<Docente> | undefined | null): boolean {
  if (!d || !d.foto_url) return false;
  return !this.brokenAvatars().has(Number(d.id));
}

onImgError(id?: number) {
  if (!id) return;
  // mutación segura del Set dentro de la signal
  this.brokenAvatars.update(prev => {
    const next = new Set(prev);
    next.add(Number(id));
    return next;
  });
}

}
