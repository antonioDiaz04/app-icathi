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
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const modalidad = this.cursoData().TIPO_CURSO_ID;
    const strategy = this.pdfFormatService.getStrategy(modalidad);

    const helpers = new PdfHelpers((finalDoc) => this.finalizePDF(finalDoc));

    strategy.generate(doc, this.cursoData(), helpers);
  }


  private finalizePDF(doc: jsPDF): void {
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    this.pdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl));
  }

  // Navigation methods
  regresar(): void {
    this.router.navigate(['/oferta-educativa']);
  }


}