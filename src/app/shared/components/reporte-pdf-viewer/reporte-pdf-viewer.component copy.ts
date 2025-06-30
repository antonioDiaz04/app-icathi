// import { Component, OnInit, signal } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../../environments/environment.prod';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { AreasService } from '../../services/areas.service';
// import { toSignal } from '@angular/core/rxjs-interop';
// import { catchError, forkJoin, of } from 'rxjs';
// import { CursosService } from '../../services/cursos.service';

// @Component({
//   selector: 'app-reporte-pdf-viewer',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './reporte-pdf-viewer.component.html',
//   styleUrls: ['./reporte-pdf-viewer.component.scss']
// })
// export class ReportePdfViewerComponent implements OnInit {
//   // Signals
//   pdfUrl = signal<SafeResourceUrl | null>(null);
//   cursoData = signal<any>(null);
//   id = signal<string>('');
//   AREA_NOMBRE = signal<string>('');
//   ESPECIALIDAD_NOMBRE = signal<string>('');

//   // Constructor
//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private sanitizer: DomSanitizer,
//     private http: HttpClient,
//     private areaService: AreasService,
//     private cursosService: CursosService,
//   ) { }

//   // Lifecycle hooks
//   ngOnInit(): void {
//     this.id.set(this.route.snapshot.paramMap.get('id')!);
//     this.cargarDetallesCurso();
//   }


//   cargarDetallesCurso(): void {
//     const url = `${environment.api}/cursos/reporte/${this.id()}`;

//     this.http.get(url).subscribe({
//       next: (data: any) => {
//         this.cursoData.set(data);
//         console.log("this.cursoData", this.cursoData())
//         const areaId = Number(data.AREA_ID);
//         const especialidadId = Number(data.ESPECIALIDAD_ID);

//         const area$ = this.areaService.getAreaDetailsById(areaId).pipe(
//           catchError(err => {
//             console.error("Error al obtener área:", err);
//             return of(null);
//           })
//         );

//         const especialidades$ = this.cursosService.getEspecialidadesByAreaId(areaId).pipe(
//           catchError(err => {
//             console.error("Error al obtener especialidades:", err);
//             return of([]);
//           })
//         );

//         // Ejecutar ambas llamadas en paralelo y esperar que ambas terminen
//         forkJoin([area$, especialidades$]).subscribe(([areaData, especialidades]) => {
//           if (areaData) {
//             this.AREA_NOMBRE.set(areaData.area_nombre);
//           }

//           const especialidadSeleccionada = especialidades.find((e: any) => e.id === especialidadId);
//           if (especialidadSeleccionada) {
//             this.ESPECIALIDAD_NOMBRE.set(especialidadSeleccionada.nombre);
//           }

//           // ✅ Solo generar el PDF cuando ya se tengan los datos de área y especialidad
//           this.generarPDF();
//         });
//       },
//       error: (error) => {
//         console.error('Error al cargar los detalles del curso:', error);
//       }
//     });
//   }

//   // PDF generation methods
//   generarPDF(): void {
//     const doc = this.configureDocument();
//     const imageUrl = 'https://res.cloudinary.com/dvvhnrvav/image/upload/v1736174056/icathi/tsi14aynpqjer8fthxtz.png';
//     const img = new Image();

//     img.crossOrigin = 'anonymous';
//     img.src = imageUrl;

//     img.onload = () => {
//       this.drawBackground(doc, img);
//       this.drawHeader(doc);
//       this.drawCourseDetails(doc);
//       this.drawValidityBox(doc);
//       this.drawSignatureSection(doc);

//       this.agregarFichaTecnica(doc);
//       this.agregarContenidoProgramatico(doc);
//       this.agregarTablaMateriales(doc);
//       this.agregarTablaEquipamiento(doc);
//       const totalPages = doc.getNumberOfPages();
//       for (let i = 2; i <= totalPages; i++) {
//         doc.setPage(i);
//         this.drawFooter(doc);
//       }
//       this.finalizePDF(doc);
//     };
//   }

//   private configureDocument(): jsPDF {
//     return new jsPDF({
//       orientation: 'portrait',
//       unit: 'pt',
//       format: 'letter'
//     });
//   }

//   private drawBackground(doc: jsPDF, img: HTMLImageElement): void {
//     doc.addImage(img, 'PNG', 0, 0, 612, 792);
//   }

//   private drawHeader(doc: jsPDF): void {
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(12);

//     let y = 140;
//     doc.text('PROGRAMA DE ESTUDIO', 210, y);
//     y += 18;
//     doc.text('CURSO DE CAPACITACIÓN ACELERADA ESPECÍFICA', 135, y);
//     y += 18;
//     doc.text('"CAE"', 280, y);
//   }

//   private drawCourseDetails(doc: jsPDF): void {
//     const labelX = 50;
//     const maxTextWidth = 360;
//     const lineHeight = 13;
//     let y = 200 + 60; // Starting position after header
//     const yStart = y;

//     // Field rendering function
//     const renderField = (label: string, value: string) => {
//       doc.setFont('helvetica', 'bold');
//       doc.setFontSize(11);
//       const labelText = `${label}:`;
//       const labelWidth = doc.getTextWidth(labelText);
//       const valueMaxWidth = maxTextWidth - labelWidth - 5;

//       const lines = doc.splitTextToSize(value, valueMaxWidth);
//       const totalHeight = Math.max(lines.length * lineHeight, lineHeight) + 4;

//       doc.text(labelText, labelX, y);
//       doc.setFont('helvetica', 'normal');
//       doc.text(lines[0], labelX + labelWidth + 5, y);

//       for (let i = 1; i < lines.length; i++) {
//         y += lineHeight;
//         doc.text(lines[i], labelX + labelWidth + 5, y);
//       }

//       y += lineHeight + 4;
//     };

//     // Render fields
//     // renderField('ÁREA OCUPACIONAL', this.AREA_NOMBRE());
//     renderField('ÁREA OCUPACIONAL', this.AREA_NOMBRE().toUpperCase());
//     renderField('ESPECIALIDAD', this.ESPECIALIDAD_NOMBRE().toUpperCase());
//     renderField('CURSO', this.cursoData().NOMBRE.toUpperCase());

//     // renderField('CURSO', 'ADMINISTRACIÓN DE ARCHIVOS Y HERRAMIENTAS OFIMÁTICAS EN LA NUBE');
//     renderField('CLAVE DEL CURSO', this.cursoData().CLAVE.toUpperCase());
//     // renderField('DURACIÓN', `${this.cursoData()?.DURACION_HORAS || 210} HORAS`);
//     renderField('DURACIÓN', `${this.cursoData().CONTENIDOPROGRAMATICO.reduce((total: number, tema: any) => total + (parseInt(tema.tiempo) || 0), 0).toString() || 210} HORAS`);
//     // contenidoProgramatico.reduce((total: number, tema: any) => total + (parseInt(tema.tiempo) || 0), 0).toString(),

//   }

//   private drawValidityBox(doc: jsPDF): void {
//     const boxX = 430; // 400 + 30 offset
//     const boxY = 260; // Calculated position
//     const boxWidth = 120;
//     const boxHeight = 90;
//     const radius = 10;

//     // Draw box
//     doc.setDrawColor(0);
//     doc.setLineWidth(1.2);
//     doc.roundedRect(boxX, boxY, boxWidth, boxHeight, radius, radius);
//     doc.line(boxX, boxY + boxHeight / 2, boxX + boxWidth, boxY + boxHeight / 2);

//     // Box content
//     doc.setFontSize(8.5);
//     const contentMarginTop = 15;

//     // First section (Validity)
//     doc.setFont('helvetica', 'bold');
//     doc.text('VIGENCIA A PARTIR DE:', boxX + boxWidth / 2, boxY + contentMarginTop, { align: 'center' });
//     doc.setFont('helvetica', 'normal');
//     doc.text(this.cursoData()?.VIGENCIA_INICIO?.split('T')[0] || '2011-11-18', boxX + boxWidth / 2, boxY + contentMarginTop + 10, { align: 'center' });

//     // Second section (Publication)
//     doc.setFont('helvetica', 'bold');
//     doc.text('PUBLICACIÓN:', boxX + boxWidth / 2, boxY + boxHeight / 2 + contentMarginTop, { align: 'center' });
//     doc.setFont('helvetica', 'normal');
//     doc.text(this.cursoData()?.FECHA_PUBLICACION?.split('T')[0] || '2011-11-18', boxX + boxWidth / 2, boxY + boxHeight / 2 + contentMarginTop + 10, { align: 'center' });
//   }

//   private drawSignatureSection(doc: jsPDF): void {
//     let y = 550;
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const marginRight = 40;
//     const posX = pageWidth - marginRight;

//     const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
//       const tempDoc = new jsPDF();
//       tempDoc.setFontSize(fontSize);
//       return tempDoc.splitTextToSize(text, maxWidth);
//     };

//     const drawSignature = (title: string, nombre: string, cargo: string) => {
//       const maxWidth = 120;
//       const fontSize = 9;

//       doc.setFontSize(fontSize);
//       doc.setFont('helvetica', 'bold');
//       doc.text(title, posX, y, { align: 'right' });
//       y += 10;

//       doc.setFont('helvetica', 'normal');
//       if (nombre) {
//         doc.text(nombre, posX, y, { align: 'right' });
//         y += 10;
//       }

//       if (cargo) {
//         const lines = wrapText(cargo, maxWidth, fontSize);
//         lines.forEach(line => {
//           doc.text(line, posX, y, { align: 'right' });
//           y += 8;
//         });
//       } else {
//         doc.text('No disponible', posX, y, { align: 'right' });
//         y += 10;
//       }

//       y += 10;
//     };

//     // Signature blocks
//     // Signature blocks
//     drawSignature(
//       'Elaborado por:',
//       this.cursoData().firmas.ELABORADO_POR.nombre,
//       this.cursoData().firmas.ELABORADO_POR.cargo
//     );

//     drawSignature(
//       'Revisado por:',
//       this.cursoData().firmas.REVISADO_POR.nombre,
//       this.cursoData().firmas.REVISADO_POR.cargo
//     );

//     drawSignature(
//       'Autorizado por:',
//       this.cursoData().firmas.AUTORIZADO_POR.nombre,
//       this.cursoData().firmas.AUTORIZADO_POR.cargo
//     );
//   }




//   private agregarFichaTecnica(doc: jsPDF): void {
//     const ficha = this.cursoData().FICHA_TECNICA;
//     const etiquetas = ficha?.ETIQUETAS || [];
//     doc.addPage();
//     doc.setFont('helvetica', 'normal');

//     const rows: any[] = [
//       ['OBJETIVO DEL CURSO', ficha.OBJETIVO],
//       ['PERFIL DE INGRESO', ficha.PERFIL_INGRESO],
//       ['PERFIL DE EGRESO', ficha.PERFIL_EGRESO],
//       ['PERFIL DEL INSTRUCTOR / DOCENTE', ficha.PERFIL_DEL_DOCENTE],
//       ['METODOLOGÍA DE CAPACITACIÓN', ficha.METODOLOGIA],
//       ...etiquetas.map((e: any) => [e.NOMBRE.toUpperCase(), e.DATO])
//     ];

//     autoTable(doc, {
//       startY: 30,
//       body: rows,
//       theme: 'grid',
//       styles: {
//         fontSize: 10,
//         font: 'helvetica',
//         cellPadding: 5,
//         valign: 'top',
//         textColor: [0, 0, 0],
//         lineColor: [0, 0, 0],
//         lineWidth: 0.8,
//         overflow: 'linebreak'
//       },
//       didParseCell: (data) => {
//         if (data.row.index === 7 && data.column.index === 0) {
//           data.cell.styles.fontSize = 6;
//         }
//       },
//       columnStyles: {
//         0: {
//           fontStyle: 'bold',
//           fillColor: [180, 180, 180],
//           halign: 'center',
//           valign: 'middle',
//         },
//         1: {
//           fontStyle: 'normal',
//           halign: 'left',
//           valign: 'top',
//           cellWidth: 460,
//         }
//       },
//       margin: { top: 30, left: 30, right: 30 },


//     });
//   }








//   private agregarContenidoProgramatico(doc: jsPDF): void {
//     const contenidoProgramatico = this.cursoData().CONTENIDOPROGRAMATICO;

//     doc.addPage();
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(12);
//     doc.text('CONTENIDO PROGRAMÁTICO', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

//     if (!contenidoProgramatico || contenidoProgramatico.length === 0) {
//       doc.setFont('helvetica', 'normal');
//       doc.text('No se ha definido contenido programático para este curso.', 15, 40);
//       return;
//     }

//     const encabezados = [[
//       'NO. Y NOMBRE DEL TEMA',
//       'TIEMPO (HRS)',
//       'COMPETENCIAS A DESARROLLAR',
//       'INSTRUMENTOS DE EVALUACIÓN',
//       'ACTIVIDADES DE ENSEÑANZA-APRENDIZAJE'
//     ]];

//     const body = contenidoProgramatico.map((tema: any) => [
//       (tema.tema_nombre || '').replace(/\n/g, '\n'),
//       tema.tiempo ? tema.tiempo.toString() : '0',
//       (tema.competencias || '').replace(/\n/g, '\n'),
//       (tema.evaluacion || '').replace(/\n/g, '\n'),
//       (tema.actividades || '')
//     ]);

//     // Agregar las filas adicionales al final del body
//     body.push([
//       'Evaluacion',
//       '2',
//       '',
//       '',
//       ''
//     ]);

//     body.push([
//       'Total horas',
//       contenidoProgramatico.reduce((total: number, tema: any) => total + (parseInt(tema.tiempo) || 0), 0).toString(),
//       '',
//       '',
//       ''
//     ]);

//     const pageWidth = doc.internal.pageSize.getWidth();
//     const margin = 15;
//     const availableWidth = pageWidth - margin * 2;

//     autoTable(doc, {
//       startY: 30,
//       head: encabezados,
//       body,
//       theme: 'grid',
//       styles: {
//         fontSize: 10,
//         font: 'helvetica',
//         cellPadding: 3,
//         valign: 'top',
//         overflow: 'linebreak',
//         textColor: [0, 0, 0],
//         lineColor: [0, 0, 0],
//         lineWidth: 0.5
//       },
//       headStyles: {
//         halign: 'center',
//         fillColor: [200, 200, 200],
//         textColor: [0, 0, 0],
//         fontStyle: 'bold'
//       },
//       columnStyles: {
//         0: { cellWidth: availableWidth * 0.25 },
//         1: { cellWidth: availableWidth * 0.10, halign: 'center' },
//         2: { cellWidth: availableWidth * 0.20 },
//         3: { cellWidth: availableWidth * 0.20 },
//         4: { cellWidth: availableWidth * 0.25 }
//       },
//       margin: { top: 30, left: margin, right: margin },
//       tableWidth: 'auto',
//       didDrawCell: (data) => {
//         // Aplicar estilo bold a las filas adicionales
//         if (data.row.index === body.length - 1 || data.row.index === body.length - 2) {
//           doc.setFont('helvetica', 'bold');
//         }
//       }
//     });
//   }




//   private agregarTablaMateriales(doc: jsPDF): void {
//     const materiales = this.cursoData().MATERIALES || [];
//     if (materiales.length === 0) return;

//     doc.addPage();
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.text('MATERIAL', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

//     autoTable(doc, {
//       startY: 50,
//       head: [
//         [
//           { content: 'DESCRIPCIÓN', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
//           { content: 'UNIDAD DE MEDIDA', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
//           { content: 'CANTIDAD POR NÚMERO DE LAS Y/O LOS ALUMNOS', colSpan: 3, styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
//         ],
//         [
//           { content: '10', styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
//           { content: '15', styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
//           { content: '20', styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } }
//         ]
//       ]
//       ,

//       body: materiales.map((m: any) => [
//         m.material_descripcion,
//         m.material_unidad_de_medida,
//         m.material_cantidad_10 !== undefined ? String(m.material_cantidad_10) : '',
//         m.material_cantidad_15 !== undefined ? String(m.material_cantidad_15) : '',
//         m.material_cantidad_20 !== undefined ? String(m.material_cantidad_20) : ''
//       ]),
//       styles: {
//         fontSize: 9,
//         cellPadding: 3,
//         lineColor: [0, 0, 0],
//         lineWidth: 0.5,
//       },
//       headStyles: {
//         textColor: [0, 0, 0],
//         fontStyle: 'bold',
//         fillColor: [200, 200, 200],
//         halign: 'center',
//         valign: 'middle',
//         lineWidth: 0.5
//       },
//       bodyStyles: {
//         halign: 'center',
//         valign: 'middle',
//         lineWidth: 0.5,fontStyle: 'bold' 
//       },
//       columnStyles: {
//         0: { halign: 'left' }
//       },
//       theme: 'grid'
//     });
//   }

//   // private agregarTablaEquipamiento(doc: jsPDF): void {
//   //   const equipos = this.cursoData().EQUIPAMIENTO || [];
//   //   if (equipos.length === 0) return;

//   //   doc.addPage();
//   //   doc.setFontSize(12);
//   //   doc.setFont('helvetica', 'bold');
//   //   doc.text('EQUIPAMIENTO', 50, 50);

//   //   autoTable(doc, {
//   //     startY: 70,
//   //     head: [['Descripción', 'Unidad de Medida', 'Cantidad 10', 'Cantidad 15', 'Cantidad 20']],
//   //     body: equipos.map((e: any) => [
//   //       e.equipamiento_descripcion,
//   //       e.equipamiento_unidad_de_medida,
//   //       e.equipamiento_cantidad_10,
//   //       e.equipamiento_cantidad_15,
//   //       e.equipamiento_cantidad_20
//   //     ]),
//   //     styles: { fontSize: 9, cellPadding: 4 }
//   //   });
//   // }




// private agregarTablaEquipamiento(doc: jsPDF): void {
//   const equipos = this.cursoData().EQUIPAMIENTO || [];
//   if (equipos.length === 0) return;

//   doc.addPage();
//   doc.setFontSize(12);
//   doc.setFont('helvetica', 'bold');
//   doc.text('EQUIPAMIENTO', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

//   autoTable(doc, {
//     startY: 50,
//     head: [
//       [
//         { content: 'DESCRIPCIÓN', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
//         { content: 'UNIDAD DE MEDIDA', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
//         { content: 'CANTIDAD POR NÚMERO DE LAS Y/O LOS ALUMNOS', colSpan: 3, styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
//       ],
//       [
//         { content: '10', styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
//         { content: '15', styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
//         { content: '20', styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } }
//       ]
//     ],
//     body: equipos.map((e: any) => {
//       // Función para extraer el valor numérico aunque venga como objeto
//       const getCantidad = (obj: any): string => {
//         if (typeof obj === 'number') return obj.toString();
//         if (typeof obj === 'string') return obj;
//         if (obj && obj.value !== undefined) return obj.value.toString();
//         return '';
//       };

//       return [
//         e.equipamiento_descripcion,
//         e.equipamiento_unidad_de_medida,
//         getCantidad(e.equipamiento_cantidad_10),
//         getCantidad(e.equipamiento_cantidad_15),
//         getCantidad(e.equipamiento_cantidad_20)
//       ];
//     }),
//     styles: {
//       fontSize: 9,
//       cellPadding: 3,
//       lineColor: [0, 0, 0],  // Bordes negros
//       lineWidth: 0.5,        // Grosor del borde
//     },
//     headStyles: {
//       textColor: [0, 0, 0],
//       fontStyle: 'bold',
//       fillColor: [200, 200, 200],
//       halign: 'center',
//       valign: 'middle',
//       lineWidth: 0.5
//     },
//     bodyStyles: {
//       halign: 'center',
//       valign: 'middle',
//       lineWidth: 0.5,fontStyle: 'bold' 
//     },
//     columnStyles: {
//       0: { halign: 'left' } // Descripción alineada a la izquierda
//     },
//     theme: 'grid'
//   });
// }













//   private drawFooter(doc: jsPDF): void {
//     const pageNumber = doc.getCurrentPageInfo().pageNumber;
//     const totalPages = doc.getNumberOfPages();
//     if (pageNumber <= 1) return;

//     const pageWidth = doc.internal.pageSize.width;
//     const pageHeight = doc.internal.pageSize.height;
//     const footerY = pageHeight - 50;

//     const marginX = 20;
//     const tableWidth = pageWidth - marginX * 2;
//     const topCellHeight = 12;
//     const bottomCellHeight = 28; // 🔹 Más alto para contener el nuevo espaciado

//     const colWidths = [
//       tableWidth * 0.34,
//       tableWidth * 0.19,
//       tableWidth * 0.12,
//       tableWidth * 0.23,
//       tableWidth * 0.12
//     ];

//     const fields = [
//       { title: 'Revisó y Aprobó:', value: 'Coordinación de Gestión de la Calidad' },
//       { title: 'Código:', value: 'DA-PP-CAE-01' },
//       { title: 'Versión No:', value: '2' },
//       { title: 'Fecha de Emisión:', value: '01/10/2018' },
//       { title: 'Hoja:', value: `${pageNumber} de ${totalPages}` }
//     ];

//     // 🔹 Texto superior en negro
//     const topText = doc.splitTextToSize(
//       'El usuario es responsable de consultar e imprimir la versión vigente de este formato',
//       tableWidth - 40
//     );
//     const topTextY = footerY + (topCellHeight - 4) / 2 + 4;

//     doc.setDrawColor(150);
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(0);
//     doc.rect(marginX, footerY, tableWidth, topCellHeight);
//     doc.text(topText, pageWidth / 2, topTextY, {
//       align: 'center',
//       lineHeightFactor: 1.5
//     });

//     // 🔹 Segunda fila
//     const secondRowY = footerY + topCellHeight;
//     let currentX = marginX;

//     fields.forEach((field, i) => {
//       const colWidth = colWidths[i];
//       const padding = 3;
//       const textWidth = colWidth - 2 * padding;
//       const lineHeight = 3;
//       const lineGap = 3; // 🔸 espacio entre título y valor
//       const lineHeightFactor = 2.0; // 🔸 mayor separación entre líneas

//       doc.rect(currentX, secondRowY, colWidth, bottomCellHeight);

//       const titleLines = doc.splitTextToSize(field.title, textWidth);
//       const valueLines = doc.splitTextToSize(field.value, textWidth);

//       const totalHeight =
//         titleLines.length * lineHeight * lineHeightFactor +
//         valueLines.length * lineHeight * lineHeightFactor +
//         lineGap;

//       const startY = secondRowY + (bottomCellHeight - totalHeight) / 2 + lineHeight;

//       // Título
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(0);
//       doc.text(titleLines, currentX + colWidth / 2, startY, {
//         align: 'center',
//         lineHeightFactor: lineHeightFactor
//       });

//       // Valor
//       const valueY = startY + titleLines.length * lineHeight * lineHeightFactor + lineGap;
//       doc.setFont('helvetica', 'normal');
//       doc.text(valueLines, currentX + colWidth / 2, valueY, {
//         align: 'center',
//         lineHeightFactor: lineHeightFactor
//       });

//       currentX += colWidth;
//     });
//   }











//   private finalizePDF(doc: jsPDF): void {
//     const blob = doc.output('blob');
//     const blobUrl = URL.createObjectURL(blob);
//     this.pdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl));
//   }

//   // Navigation methods
//   regresar(): void {
//     this.router.navigate(['/oferta-educativa']);
//   }


// }