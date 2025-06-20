import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { HttpClient } from '@angular/common/http';
import { signal, computed, effect } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';

declare module "jspdf" {
  interface jsPDF {
    autoTable: any;
  }
}

@Component({
  selector: 'app-pdf-generate',
  // standalone: true,

  // imports: [],
  templateUrl: './pdf-generate.component.html',
  styleUrl: './pdf-generate.component.scss'
})
export class PdfGenerateComponent {
  private http = inject(HttpClient);

  @Input({ required: true }) set generarReportePdfCursoId(value: number) {
    this.cursoId.set(value);
    console.log("this.cursoId",this.cursoId())
    if (value) {
      this.loadCourseData(value);
    }
  }
  @Output() cerrarModalEvent = new EventEmitter<boolean>();

  // Signals
  cursoId = signal<number | null>(null);
  cursoData = signal<any>(null);
  generando = signal(false);
  error = signal<string | null>(null);

  // Computed values
  hasCursoData = computed(() => this.cursoData() !== null);

  constructor() {
    // Effect to generate PDF when cursoData changes
    effect(() => {
      const data = this.cursoData();
      if (data) {
        this.createPDF(data);
      }
    });
  }

  private async loadCourseData(cursoId: number) {
    this.generando.set(true);
    this.error.set(null);

    try {
      const url = `${environment.api}/cursos/reporte/${cursoId}`;
      const data = await this.http.get(url).toPromise();
      this.cursoData.set(data);
    } catch (err) {
      console.error("Error al cargar los detalles del curso:", err);
      this.error.set('Error al cargar los detalles del curso');
    } finally {
      this.generando.set(false);
    }
  }

  private createPDF(data: any) {
    const doc = new jsPDF();

    // Add background image only on the first page
    const imageUrl = "https://res.cloudinary.com/dvvhnrvav/image/upload/v1736174056/icathi/tsi14aynpqjer8fthxtz.png";
    doc.addImage(
      imageUrl,
      "PNG",
      0,
      0,
      doc.internal.pageSize.width,
      doc.internal.pageSize.height
    );

    // Add course data to the PDF
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text(`Reporte del Curso: ${data.nombre || 'Sin nombre'}`, 15, 30);

    // Add course details
    doc.setFontSize(12);
    doc.text(`Código: ${data.codigo || 'N/A'}`, 15, 40);
    doc.text(`Fecha de inicio: ${data.fechaInicio || 'N/A'}`, 15, 50);
    doc.text(`Fecha de fin: ${data.fechaFin || 'N/A'}`, 15, 60);

    // Add participants table if available
    if (data.participantes && data.participantes.length > 0) {
      doc.text('Participantes:', 15, 80);
      
      const participantesData = data.participantes.map((p: any) => [
        p.nombre || 'N/A',
        p.email || 'N/A',
        p.rol || 'N/A'
      ]);

      (doc as any).autoTable({
        startY: 85,
        head: [['Nombre', 'Email', 'Rol']],
        body: participantesData,
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255
        }
      });
    }

    // Save the PDF
    doc.save(`reporte-curso-${data?.codigo || 'reporte'}.pdf`);
    this.cerrarModalEvent.emit(true);
  }
}