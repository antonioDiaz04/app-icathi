import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CursosService, CursoDetallado, TipoCurso } from '../../../../shared/services/cursos.service';
import { SolicitudesCursosService } from '../../../../shared/services/solicitudes-cursos.service';
import { DocenteHelper } from '../../commons/helpers/docente.helper';
import { AuthService } from '../../../../shared/services/auth.service';
import { DocenteService } from '../../../../shared/services/docente.service';

@Component({
  selector: 'app-solicitar-curso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitar-curso.component.html',
  styleUrl: './solicitar-curso.component.scss'
})
export class SolicitarCursoComponent implements OnInit {
  docenteData: any;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cursosService = inject(CursosService);
  private solicitudesService = inject(SolicitudesCursosService);

  // Catálogos
  tipos: TipoCurso[] = [];
  cursosAll: CursoDetallado[] = [];

  // Derivados/estado UI
  cursosFiltrados: CursoDetallado[] = [];
  tipoSeleccionadoId: number | null = null;

  loading = true;

  // Prioridades mostradas al usuario (mapea a Alta/Media/Baja)
  prioridadesUi = [
    { label: 'Baja - Conveniente', value: 'Baja' as const },
    { label: 'Media - Importante', value: 'Media' as const },
    { label: 'Alta - Urgente', value: 'Alta' as const },
  ];

  // Estado del formulario
  formData = {
    cursoId: 0,
    prioridadUi: this.prioridadesUi[1].label, // default visible
    justificacion: ''
  };
trackById = (_: number, item: { id: number }) => item.id;

  // (Opcional) si manejas auth, pon aquí el docente logueado
  docenteId = 0; 
  private pendingLoads = 2;
 constructor(
    private authService: AuthService,
    private docenteService: DocenteService
  ) {}
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('idCurso');
    const idCurso = idParam ? Number(idParam) : null;

    // Disparamos ambas cargas en paralelo
    const subTipos = this.cursosService.getTiposCurso().subscribe(t => this.tipos = t ?? []);
    const subCursos = this.cursosService.getCursosDetallados().subscribe(data => {
      this.cursosAll = (data ?? []).filter(c => c.estatus === true); // solo activos
      // Si vino un curso en la URL, precargamos tipo + curso
      if (idCurso) {
        const encontrado = this.cursosAll.find(c => c.id === idCurso);
        if (encontrado) {
          this.tipoSeleccionadoId = encontrado.tipo_curso_id ?? null;
          this.aplicarFiltroCursos();
          this.formData.cursoId = encontrado.id;
        }
      }
      this.loading = false;

      // Si NO vino id por ruta, y no hay tipo aún, seleccionamos el primero disponible
      if (!idCurso) {
        // Si ya tenemos tipos, tomamos el primero; si no, cuando se carguen, el usuario elige
        if (this.tipos?.length) {
          this.tipoSeleccionadoId = this.tipos[0].id ?? null;
          this.aplicarFiltroCursos();
          // seleccionar el primer curso del tipo
          if (this.cursosFiltrados.length) {
            this.formData.cursoId = this.cursosFiltrados[0].id;
          }
        }
      }
    });
  this.obtenerDatosDocenteYCursos();
      // Nota: si los tipos llegan DESPUÉS que los cursos, y no hubo idRuta,
    // el usuario puede cambiar el tipo en el select; ahí recalculamos.
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
  /** Filtra cursos por tipo seleccionado (y estatus true) */
  aplicarFiltroCursos(): void {
    const tipoId = this.tipoSeleccionadoId;
    this.cursosFiltrados = this.cursosAll.filter(c => {
      const matchTipo = tipoId ? c.tipo_curso_id === tipoId : true;
      return c.estatus === true && matchTipo;
    });

    // Si el curso actualmente seleccionado no pertenece al filtro, ajustar
    if (this.formData.cursoId && !this.cursosFiltrados.some(c => c.id === this.formData.cursoId)) {
      this.formData.cursoId = this.cursosFiltrados[0]?.id ?? 0;
    }
  }

  /** Cambio manual del select de tipos */
  onTipoChange(): void {
    this.aplicarFiltroCursos();
  }
private doneLoad() {
  this.pendingLoads--;
  if (this.pendingLoads <= 0) this.loading = false;
}
  get cursoSeleccionado(): CursoDetallado | undefined {
    return this.cursosAll.find(c => c.id === Number(this.formData.cursoId));
  }

  fechaCorta(iso?: string) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  private prioridadBackFromUi(label: string): 'Alta' | 'Media' | 'Baja' {
    const found = this.prioridadesUi.find(p => p.label === label);
    return (found?.value ?? 'Media');
  }

  onSubmit(f: NgForm) {
    if (f.invalid || !this.formData.cursoId) return;

    const prioridad = this.prioridadBackFromUi(this.formData.prioridadUi);

    const payload = {
      cursoId: Number(this.formData.cursoId),
      docenteId: this.docenteId,       // <-- Aquí asigna el docente autenticado
      prioridad,                       // Alta | Media | Baja
      justificacion: this.formData.justificacion.trim()
    };

    this.solicitudesService.crearSolicitud(payload).subscribe({
      next: () => {
        alert('¡Solicitud enviada con éxito!');
        this.router.navigate(['/docente/mis-solicitudes']); // o la ruta que uses para el componente 2
      },
      error: (err) => {
        console.error(err);
        alert('No se pudo enviar la solicitud');
      }
    });
  }

  verCursos() {
    this.router.navigate(['/cursos']);
  }
}
