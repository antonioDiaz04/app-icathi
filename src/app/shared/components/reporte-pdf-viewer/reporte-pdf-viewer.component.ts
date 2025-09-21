import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AreasService } from '../../services/areas.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, of } from 'rxjs';
import { CursosService } from '../../services/cursos.service';
import { PdfFormatService } from '../../services/pdf-format.service';
import { PdfHelpers } from '../../helpers/pdf-helpers';

@Component({
  selector: 'app-reporte-pdf-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reporte-pdf-viewer.component.html',
  styleUrls: ['./reporte-pdf-viewer.component.scss']
})
export class ReportePdfViewerComponent implements OnInit {
  // Signals
  pdfUrl = signal<SafeResourceUrl | null>(null);
  cursoData = signal<any>(null);
  id = signal<string>('');
  AREA_NOMBRE = signal<string>('');
  ESPECIALIDAD_NOMBRE = signal<string>('');

  // Constructor
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private areaService: AreasService,
    private cursosService: CursosService,
    private pdfFormatService: PdfFormatService,
  ) { }

  // Lifecycle hooks
  ngOnInit(): void {
    this.id.set(this.route.snapshot.paramMap.get('id')!);
    this.cargarDetallesCurso();
  }

cargarDetallesCurso(): void {
  const url = `${environment.api}/cursos/reporte/${this.id()}`;

  this.http.get(url).subscribe({
    next: (data: any) => {
      const areaId = Number(data.AREA_ID);
      const especialidadId = Number(data.ESPECIALIDAD_ID);

      const area$ = this.areaService.getAreaDetailsById(areaId).pipe(
        catchError(err => {
          console.error("Error al obtener área:", err);
          return of(null);
        })
      );

      const especialidades$ = this.cursosService.getEspecialidadesByAreaId(areaId).pipe(
        catchError(err => {
          console.error("Error al obtener especialidades:", err);
          return of([]);
        })
      );

      forkJoin([area$, especialidades$]).subscribe(([areaData, especialidades]) => {
        if (areaData) {
          this.AREA_NOMBRE.set(areaData.area_nombre);
        }

        const especialidadSeleccionada = especialidades.find((e: any) => e.id === especialidadId);
        if (especialidadSeleccionada) {
          this.ESPECIALIDAD_NOMBRE.set(especialidadSeleccionada.nombre);
        }

        this.cursoData.set({
          ...data,
          AREA_NOMBRE: this.AREA_NOMBRE(),
          ESPECIALIDAD_NOMBRE: this.ESPECIALIDAD_NOMBRE(),
        });

        console.log("this.cursoData", this.cursoData());
        this.generarPDF();
      });
    },
    error: (error) => {
      console.error('Error al cargar los detalles del curso:', error);
    }
  });
}


generarPDF(): void {
  const modalidad = this.cursoData().TIPO_CURSO_ID;
  console.log("modalidad", modalidad);

  let doc: jsPDF;

  if (modalidad === 4 || modalidad === 5) {
    doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'letter'
    });
  } else {
    doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter'
    });
  }

  const strategy = this.pdfFormatService.getStrategy(modalidad);
  const helpers = new PdfHelpers((finalDoc) => this.finalizePDF(finalDoc));
  strategy.generate(doc, this.cursoData(), helpers);
}


  private finalizePDF(doc: jsPDF): void {
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    this.pdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl));
  }

regresar(): void {
  // 1) state
  const s = history.state as { returnUrl?: string };
  if (s?.returnUrl) {
    this.router.navigateByUrl(s.returnUrl);
    return;
  }
  // 2) query param
  const qp = this.route.snapshot.queryParamMap.get('returnUrl');
  if (qp) {
    this.router.navigateByUrl(qp);
    return;
  }
  // 3) default de la ruta
  const def = this.route.snapshot.data?.['defaultReturn'] as string | undefined;
  if (def) {
    this.router.navigateByUrl(def);
    return;
  }
  // 4) heurística por prefijo actual
  const url = this.router.url;
  this.router.navigateByUrl(
    url.startsWith('/docente') ? '/docente/perfil' :
    url.startsWith('/validador') ? '/validador/docente/solicitudes-cursos' :
    '/oferta-educativa'
  );
}


}