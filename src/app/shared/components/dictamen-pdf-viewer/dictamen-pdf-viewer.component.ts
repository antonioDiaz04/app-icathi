import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DictamenValidacionService, DictamenPayload } from '../../services/dictamen-validacion.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-dictamen-pdf-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dictamen-pdf-viewer.component.html',
  styleUrls: ['./dictamen-pdf-viewer.component.scss'],
  // providers:[Location]
})
export class DictamenPdfViewerComponent implements OnInit {
  pdfUrl = signal<SafeResourceUrl | null>(null);
  data = signal<DictamenPayload | null>(null);
  // todo privado; el template sólo llama a back()
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private dictamenService = inject(DictamenValidacionService);
  // private locationSvc = inject(Location);
  // constructor(
  //   private route: ActivatedRoute,
  //   private router: Router,
  //   private sanitizer: DomSanitizer,
  //   private dictamenService: DictamenValidacionService,
  // ) {}

  ngOnInit(): void {
    const solicitudId = this.route.snapshot.paramMap.get('solicitudId')!;
    this.load(solicitudId);
  }

  private load(solicitudId: string) {
    this.dictamenService.getBySolicitudId(solicitudId).subscribe({
      next: (res) => {
        this.data.set(res.data);
        this.generatePDF();
      },
      error: (e) => console.error('Error dictamen:', e),
    });
  }

  private generatePDF() {
    const d = this.data()!;
    const doc = new jsPDF({ unit: 'pt', format: 'letter' }); // 612x792

    const pageW = doc.internal.pageSize.getWidth();
    const margin = 40;
    const cursor = { x: margin, y: margin };

    // ===== Encabezado =====
    // Logo (opcional): doc.addImage(logoBase64, 'PNG', margin, margin-10, 100, 40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('DICTAMEN DE VALIDACIÓN', pageW / 2, cursor.y, { align: 'center' });
    cursor.y += 14;

    doc.setFont('helvetica', 'normal');
    autoTable(doc, {
      startY: cursor.y,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 4 },
      body: [
        ['INSTITUTO DE CAPACITACIÓN PARA EL TRABAJO DEL ESTADO DE HIDALGO'],
        ['DIRECCIÓN ACADÉMICA'],
        ['PROCESO DE VALIDACIÓN DE LAS Y LOS INSTRUCTORES'],
      ],
      didDrawCell: () => {},
    });
    cursor.y = (doc as any).lastAutoTable.finalY + 10;

    // Folio y “Notifico que el C.”
    autoTable(doc, {
      startY: cursor.y,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 4 },
      columnStyles: { 0: { cellWidth: pageW - margin * 2 } },
      body: [
        [`No. DE FOLIO:     ${d.folio}                                                             NOTIFICO QUE EL C.`],
      ],
      didDrawCell: () => {},
    });
    cursor.y = (doc as any).lastAutoTable.finalY + 6;

    // Nombre del candidato
    autoTable(doc, {
      startY: cursor.y,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 4 },
      body: [[`Nombre de la o el candidato:   ${d.candidatoNombreCompleto}`]],
    });
    cursor.y = (doc as any).lastAutoTable.finalY + 6;

    // Indicaciones + Validado/No validado
    autoTable(doc, {
      startY: cursor.y,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 4 },
      body: [[`Indicaciones: Marcar con una X, el dictamen de validación.`]],
    });
    cursor.y = (doc as any).lastAutoTable.finalY;

    const validadoMark = d.validado ? 'X' : '';
    const noValidadoMark = !d.validado ? 'X' : '';
    autoTable(doc, {
      startY: cursor.y,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 6, halign: 'left' },
      columnStyles: { 0: { cellWidth: pageW / 2 - margin }, 1: { cellWidth: pageW / 2 - margin } },
      body: [
        [`Validado:  ${validadoMark}`, `No validado:  ${noValidadoMark}`],
      ],
    });
    cursor.y = (doc as any).lastAutoTable.finalY + 6;

    // Cursos
    autoTable(doc, {
      startY: cursor.y,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 4 },
      body: [[`En el / los siguiente(s) curso(s):   ${d.curso.nombre} ${d.curso.clave ? ` (Clave: ${d.curso.clave})` : ''}`]],
    });
    cursor.y = (doc as any).lastAutoTable.finalY + 6;

    // Convocó el día / Alta en el SCE
    autoTable(doc, {
      startY: cursor.y,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 4 },
      body: [
        [`Para el que convocó el día:   ${d.fechaConvoco}`],
        [`Alta en el Sistema de Control Escolar Computarizado, el día:   ${d.fechaRespuesta || '_____/_____/_____'} `],
      ],
    });
    cursor.y = (doc as any).lastAutoTable.finalY + 8;

    // Criterio
    autoTable(doc, {
      startY: cursor.y,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 6, valign: 'middle' },
      columnStyles: {
        0: { cellWidth: pageW * 0.35 - margin },
        1: { cellWidth: pageW * 0.65 - margin },
      },
      head: [['Criterio para el dictamen de validado o no validado.', '']],
      body: [
        ['Validación de primera vez: revisión, evaluación y revalidación.', d.criterioPrimera],
        ['Validación de segunda vez: revaluación y revalidación.', d.criterioSegunda],
      ],
    });
    cursor.y = (doc as any).lastAutoTable.finalY + 8;

    // En caso de “no validado”, reforzar temas
    const reforzarTitulo = 'En caso de que el dictamen sea “no validado”, se recomienda a la persona evaluada reforzar los siguientes temas, para un proceso de validación de reevaluación:';
    autoTable(doc, {
      startY: cursor.y,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 6 },
      body: [[reforzarTitulo]],
    });
    cursor.y = (doc as any).lastAutoTable.finalY;

    autoTable(doc, {
      startY: cursor.y,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 10, minCellHeight: 80 },
      body: [[d.reforzarTemas || '']],
    });
    cursor.y = (doc as any).lastAutoTable.finalY + 14;

    // “Quedo a sus órdenes.”
    doc.setFontSize(9);
    doc.text('Quedo a sus órdenes.', margin, cursor.y);
    cursor.y += 30;

    // Pie institucional
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Validación de las y los instructores', pageW / 2, cursor.y, { align: 'center' });
    cursor.y += 14;
    doc.setFont('helvetica', 'normal');
    doc.text('ICATHI Dirección Académica', pageW / 2, cursor.y, { align: 'center' });

    // Número de página (simple)
    const pageNumber = (doc as any).internal.getCurrentPageInfo().pageNumber;
    doc.setFontSize(8);
    doc.text(`Hoja: ${pageNumber} de ${doc.getNumberOfPages()}`, pageW - margin, 780, { align: 'right' });

    // Finalizar en visor
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    this.pdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl));
  }

 back(): void {
    // 1) Prioridad: returnUrl enviado en el state
    const returnUrl = (history.state && history.state.returnUrl) as string | undefined;
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
      return;
    }

    // 2) Fallback desde la configuración de ruta
    const defaultReturn = this.route.snapshot.data?.['defaultReturn'] as string | undefined;
    if (defaultReturn) {
      this.router.navigateByUrl(defaultReturn);
      return;
    }


    // 4) Deducción por prefijo de URL actual
    const url = this.router.url;
    if (url.startsWith('/validador')) {
      this.router.navigateByUrl('/validador/docente/solicitudes-cursos');
    } else if (url.startsWith('/docente')) {
      this.router.navigateByUrl('/docente/mis-solicitudes'); // o tu ruta real
    } else {
      this.router.navigateByUrl('/'); // último recurso
    }
  }
}
