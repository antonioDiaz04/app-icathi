// import { signal } from '@angular/core';
// import { SafeResourceUrl } from '@angular/platform-browser';
// import jsPDF from 'jspdf';
// import { CursoPdfData } from '../types/curso-pdf-data.type';
// import autoTable from 'jspdf-autotable';

// export class PdfHelpers {
//   constructor(private finalizeCallback: (doc: jsPDF) => void) { }

//   logoUrl = 'https://res.cloudinary.com/dvvhnrvav/image/upload/v1736174056/icathi/tsi14aynpqjer8fthxtz.png';

//   drawBackground(doc: jsPDF, img: HTMLImageElement) {
//     doc.addImage(img, 'PNG', 0, 0, 612, 792);
//   }
//   drawBackgroundTipoRegular_SEP(doc: jsPDF, img: HTMLImageElement) {
//     // Landscape letter: 792 pt de ancho x 612 pt de alto
//     doc.addImage(img, 'PNG', 0, 0, 792, 612);
//   }



//   drawHeader(doc: jsPDF, data: CursoPdfData): void {
//     console.log("data", data);
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(12);

//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
//     let y = pageHeight / 2 - 260;

//     const centerText = (text: string, offset = 18) => {
//       doc.text(text, pageWidth / 2, y, { align: 'center' });
//       y += offset;
//     };

//     switch (data.TIPO_CURSO_ID) {
//       case 1:
//         centerText('PROGRAMA DE ESTUDIO');
//         centerText('CURSO DE CAPACITACIÓN ACELERADA ESPECÍFICA');
//         centerText(`"${data.TIPO_CURSO.toUpperCase()}"`);
//         break;

//       case 2:
//         centerText('CURSO DE CAPACITACIÓN');
//         centerText(`"${data.TIPO_CURSO.toUpperCase()}"`);
//         break;

//       case 3:
//         const text = 'ESCUELA DE PINTURA ARTÍSTICA';
//         const textWidth = doc.getTextWidth(text);
//         doc.text(text, pageWidth / 2, y, { align: 'center' });
//         doc.line((pageWidth - textWidth) / 2, y + 2, (pageWidth + textWidth) / 2, y + 2);
//         y += 18;
//         centerText('PROGRAMA DE ESTUDIO');
//         break;
//     }
//   }

//   drawHeaderTipoRegular_SEP(doc: jsPDF, data: CursoPdfData): void {
//     console.log("data", data);

//     doc.setFont('helvetica', 'bold');
//     const pageWidth = doc.internal.pageSize.getWidth();   // 792 en landscape
//     const pageHeight = doc.internal.pageSize.getHeight(); // 612 en landscape

//     let y = 140;

//     switch (data.TIPO_CURSO_ID) {
//       case 4: {
//         const marginLeft = 71;
//         doc.setFontSize(24);
//         doc.text('Oferta Educativa ICATHI', marginLeft, y);
//         break;
//       }

//       case 5: {
//         doc.setFontSize(14);
//         const centerText = (text: string, offset = 18) => {
//           doc.text(text, pageWidth / 2, y, { align: 'center' });
//           y += offset;
//         };
//         centerText('PROGRAMA DE ESTUDIO');
//         centerText(`"${data.TIPO_CURSO.toUpperCase()}"`);
//         break;
//       }
//     }
//   }



//   drawCourseDetailsTipoRegular(doc: jsPDF, data: CursoPdfData): void {
//     const marginLeft = 71; // ≈ 2.5 cm
//     const marginRight = doc.internal.pageSize.getWidth() - marginLeft;
//     const maxTextWidth = 420;
//     const lineHeight = 13;

//     let y = 120;

//     // Espacio extra si es tipo curso 4
//     if (data.TIPO_CURSO_ID === 4) {
//       y += 60;
//     }

//     // ======= NOMBRE =======
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(18);
//     const nombre = data.NOMBRE || '';
//     const nombreLines = doc.splitTextToSize(nombre, maxTextWidth);
//     nombreLines.forEach((line: string | string[]) => {
//       doc.text(line, marginRight, y, { align: 'right' });
//       y += lineHeight;
//     });
//     y += 5; // Espacio debajo de nombre

//     // ======= CLAVE =======
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(12);
//     const clave = `CLAVE: ${data.CLAVE?.toUpperCase() || ''}`;
//     doc.text(clave, marginRight, y, { align: 'right' });
//     y += 15; // Reducido ligeramente

//     // ======= LÍNEAS =======
//     doc.setDrawColor(0, 100, 0); // Verde oscuro
//     doc.setLineWidth(1.5);
//     doc.line(marginLeft, y, marginRight, y);
//     y += 5;

//     doc.setDrawColor(150); // Gris claro
//     doc.setLineWidth(1.5);
//     doc.line(marginLeft, y, marginRight, y);
//     y += 30; // Espacio después de líneas

//     // ======= ÁREA (MISMA LÍNEA) =======
//     doc.setFont('helvetica', 'normal');
//     doc.setFontSize(11);
//     const areaLabel = 'ÁREA:';
//     doc.text(areaLabel, marginLeft, y);

//     const areaText = data.AREA_NOMBRE?.toUpperCase() || '';
//     doc.setFont('helvetica', 'bold');
//     doc.text(areaText, marginLeft + doc.getTextWidth(areaLabel) + 5, y);

//     y += lineHeight + 5;

//     // ======= ESPECIALIDAD (MISMA LÍNEA) =======
//     doc.setFont('helvetica', 'normal');
//     const espLabel = 'ESPECIALIDAD:';
//     doc.text(espLabel, marginLeft, y);

//     const espText = data.ESPECIALIDAD_NOMBRE?.toUpperCase() || '';
//     doc.setFont('helvetica', 'bold');
//     doc.text(espText, marginLeft + doc.getTextWidth(espLabel) + 5, y);
//   }
//   drawValidityBoxTipoRegular_SEP(doc: jsPDF, data: CursoPdfData): void {
//     const pageWidth = doc.internal.pageSize.getWidth(); // 792 en landscape
//     const marginRight = 71;
//     const boxWidth = 120;

//     const offsetRight = 55; // Posición más a la derecha
//     const boxX = pageWidth - marginRight - boxWidth + offsetRight;

//     const boxY = 340; // 🔽 Antes: 260 → ahora todo baja 20 unidades
//     const contentMarginTop = 15;

//     // === TÍTULO CENTRAL SUPERIOR EN GRIS CLARO ===
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(160); // Gris claro
//     doc.text('FICHA TECNICA DE CURSO REGULAR', pageWidth / 2, boxY - 3, { align: 'center' });

//     // Restaurar color y tamaño para contenido
//     doc.setTextColor(0);
//     doc.setFontSize(8.5);

//     // ==== VIGENCIA ====
//     doc.setFont('helvetica', 'bold');
//     doc.text('VIGENCIA A PARTIR DE:', boxX + boxWidth / 2, boxY + contentMarginTop, { align: 'right' });

//     doc.setFont('helvetica', 'normal');
//     doc.text(
//       data.VIGENCIA_INICIO?.split('T')[0] || '2011-11-18',
//       boxX + boxWidth / 2,
//       boxY + contentMarginTop + 10,
//       { align: 'right' }
//     );

//     // ==== PUBLICACIÓN ====
//     doc.setFont('helvetica', 'bold');
//     doc.text(
//       'PUBLICACIÓN:',
//       boxX + boxWidth / 2,
//       boxY + contentMarginTop + 35,
//       { align: 'right' }
//     );

//     doc.setFont('helvetica', 'normal');
//     doc.text(
//       data.FECHA_PUBLICACION?.split('T')[0] || '2011-11-18',
//       boxX + boxWidth / 2,
//       boxY + contentMarginTop + 45,
//       { align: 'right' }
//     );
//   }



//   drawCourseDetailsTipoSEP(doc: jsPDF, data: CursoPdfData): void {
//     const marginLeft = 71; // 2.5 cm
//     const maxTextWidth = 420;
//     const lineHeight = 13;
//     let y = 120;

//     const renderField = (label: string, value: string) => {
//       doc.setFont('helvetica', 'bold');
//       doc.setFontSize(11);
//       const labelText = `${label}:`;
//       doc.text(labelText, marginLeft, y);
//       y += lineHeight;

//       doc.setFont('helvetica', 'normal');
//       const lines = doc.splitTextToSize(value, maxTextWidth);
//       lines.forEach((line: string | string[]) => {
//         doc.text(line, marginLeft, y);
//         y += lineHeight;
//       });

//       y += 24;
//     };

//     renderField('NOMBRE DEL CURSO', data.NOMBRE.toUpperCase() || '');
//     renderField('CLAVE DEL CURSO', data.CLAVE?.toUpperCase() || '');
//     renderField('DURACIÓN DEL CURSO', `${(data.CONTENIDOPROGRAMATICO || []).reduce((total: number, tema: any) => total + (parseInt(tema.tiempo) || 0), 0)} HORAS`);
//     renderField('ÁREA FORMATIVA', data.AREA_NOMBRE?.toUpperCase() || '');
//   }

//   drawCourseDetailsESCUELA(doc: jsPDF, data: CursoPdfData): void {
//     const labelX = 50;
//     const maxTextWidth = 360;
//     const lineHeight = 13;
//     let y = 260;

//     const renderField = (label: string, value: string) => {
//       doc.setFont('helvetica', 'bold');
//       doc.setFontSize(11);
//       const labelText = `${label}:`;
//       doc.text(labelText, labelX, y);

//       y += lineHeight;

//       doc.setFont('helvetica', 'normal');
//       const lines = doc.splitTextToSize(value, maxTextWidth);

//       for (let i = 0; i < lines.length; i++) {
//         doc.text(lines[i], labelX, y);
//         y += lineHeight;
//       }

//       y += 24;
//     };

//     renderField('NOMBRE DEL CURSO', data.NOMBRE.toUpperCase() || '');
//     renderField('CLAVE DEL CURSO', data.CLAVE?.toUpperCase() || '');
//     renderField('DURACIÓN DEL CURSO', `${(data.CONTENIDOPROGRAMATICO || []).reduce((total: number, tema: any) => total + (parseInt(tema.tiempo) || 0), 0)} HORAS`);
//   }
//   drawCourseDetails(doc: jsPDF, data: CursoPdfData): void {
//     const labelX = 50;
//     const maxTextWidth = 360;
//     const lineHeight = 13;
//     let y = 260;

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

//       y += lineHeight + 8;
//     };

//     renderField('ÁREA OCUPACIONAL', data.AREA_NOMBRE.toUpperCase() || '');
//     renderField('ESPECIALIDAD', data.ESPECIALIDAD_NOMBRE.toUpperCase() || '');
//     renderField('CURSO', data.NOMBRE.toUpperCase() || '');
//     renderField('CLAVE DEL CURSO', data.CLAVE?.toUpperCase() || '');
//     renderField('DURACIÓN', `${(data.CONTENIDOPROGRAMATICO || []).reduce((total: number, tema: any) => total + (parseInt(tema.tiempo) || 0), 0)} HORAS`);
//   }

//   drawValidityBox(doc: jsPDF, data: CursoPdfData): void {
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
//     doc.text(data.VIGENCIA_INICIO?.split('T')[0] || '2011-11-18', boxX + boxWidth / 2, boxY + contentMarginTop + 10, { align: 'center' });

//     // Second section (Publication)
//     doc.setFont('helvetica', 'bold');
//     doc.text('PUBLICACIÓN:', boxX + boxWidth / 2, boxY + boxHeight / 2 + contentMarginTop, { align: 'center' });
//     doc.setFont('helvetica', 'normal');
//     doc.text(data.FECHA_PUBLICACION?.split('T')[0] || '2011-11-18', boxX + boxWidth / 2, boxY + boxHeight / 2 + contentMarginTop + 10, { align: 'center' });
//   }



//   // 'left'
//   drawSignatureSection(doc: jsPDF, data: CursoPdfData): void {
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

//       y += 18;
//     };


//     drawSignature(
//       'Elaborado por:',
//       data.firmas.ELABORADO_POR.nombre,
//       data.firmas.ELABORADO_POR.cargo
//     );

//     drawSignature(
//       'Revisado por:',
//       data.firmas.REVISADO_POR.nombre,
//       data.firmas.REVISADO_POR.cargo
//     );

//     drawSignature(
//       'Autorizado por:',
//       data.firmas.AUTORIZADO_POR.nombre,
//       data.firmas.AUTORIZADO_POR.cargo
//     );
//   }
//   drawSignatureSectionRegular(doc: jsPDF, data: CursoPdfData): void {
//     let y = 400; // 🔼 Subido un poco más (antes 550)
//     const marginLeft = 71; // Posicionado a la izquierda
//     const posX = marginLeft;

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
//       doc.text(title, posX, y, { align: 'left' });
//       y += 10;

//       doc.setFont('helvetica', 'normal');
//       if (nombre) {
//         doc.text(nombre, posX, y, { align: 'left' });
//         y += 10;
//       }

//       if (cargo) {
//         const lines = wrapText(cargo, maxWidth, fontSize);
//         lines.forEach(line => {
//           doc.text(line, posX, y, { align: 'left' });
//           y += 8;
//         });
//       } else {
//         doc.text('No disponible', posX, y, { align: 'left' });
//         y += 10;
//       }

//       y += 18;
//     };

//     drawSignature(
//       'Elaborado por:',
//       data.firmas.ELABORADO_POR.nombre,
//       data.firmas.ELABORADO_POR.cargo
//     );

//     drawSignature(
//       'Revisado por:',
//       data.firmas.REVISADO_POR.nombre,
//       data.firmas.REVISADO_POR.cargo
//     );

//     drawSignature(
//       'Autorizado por:',
//       data.firmas.AUTORIZADO_POR.nombre,
//       data.firmas.AUTORIZADO_POR.cargo
//     );
//   }






//   FichaTecnica(doc: jsPDF, data: CursoPdfData): void {
//     const ficha = data.FICHA_TECNICA;
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


//   FichaTecnicaTipoRegular(doc: jsPDF, data: CursoPdfData): void {
//     const ficha = data.FICHA_TECNICA;
//     const etiquetas = ficha?.ETIQUETAS || [];
//     const marginLeft = 50;
//     const marginRight = 50;
//     const maxWidth = doc.internal.pageSize.getWidth() - marginLeft - marginRight;

//     const LINE_HEIGHT = 8;
//     const SECTION_SPACING = 18;
//     const TITLE_MARGIN_BOTTOM = 10;
//     const PARAGRAPH_LINE_SPACING = 6;
//     const HEADER_LOGO_SIZE = { width: 100, height: 50 };
//     const HEADER_TITLE_MARGIN_BOTTOM = 15;
//     const BULLET_POINT_INDENT = 15;

//     const LOGO_URL = 'https://res.cloudinary.com/da8iqyp0e/image/upload/v1753208164/Imagen2_emcpzp.jpg';

//     const drawLogo = (x: number, y: number, width = 80, height = 40) => {
//       doc.addImage(LOGO_URL, 'JPEG', x, y, width, height);
//     };

//     const drawEncabezadoFija = () => {
//       // Logo alineado a la izquierda
//       drawLogo(marginLeft, 20, HEADER_LOGO_SIZE.width, HEADER_LOGO_SIZE.height);

//       doc.setFont('helvetica', 'bold');
//       doc.setFontSize(16);
//       doc.setTextColor(40, 40, 40);
//       doc.text('FICHA TÉCNICA DE CURSO REGULAR', doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });

//       doc.setDrawColor(100, 100, 100);
//       doc.setLineWidth(0.5);
//       const lineY = 65 + HEADER_TITLE_MARGIN_BOTTOM;
//       // doc.line(marginLeft, lineY, doc.internal.pageSize.getWidth() - marginLeft, lineY);

//       return lineY + 10;
//     };
//     const drawEncabezado2 = () => {
//       // Logo alineado a la izquierda
//       drawLogo(marginLeft, 20, HEADER_LOGO_SIZE.width, HEADER_LOGO_SIZE.height);

//       doc.setFont('helvetica', 'bold');
//       doc.setFontSize(16);
//       doc.setTextColor(40, 40, 40);
//       // doc.text('FICHA TÉCNICA DE CURSO REGULAR', doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });

//       doc.setDrawColor(100, 100, 100);
//       doc.setLineWidth(0.5);
//       const lineY = 65 + HEADER_TITLE_MARGIN_BOTTOM;
//       // doc.line(marginLeft, lineY, doc.internal.pageSize.getWidth() - marginLeft, lineY);

//       return lineY + 10;
//     };

//     const formatContentWithBullets = (content: string): string[] => {
//       const lines = content.split('\n');
//       const formattedLines: string[] = [];
//       lines.forEach(line => {
//         if (line.trim().startsWith('-')) {
//           formattedLines.push('• ' + line.substring(1).trim());
//         } else {
//           formattedLines.push(line);
//         }
//       });
//       return formattedLines;
//     };
//     const drawSection = (title: string, content: string, yStart: number): number => {
//       let y = yStart;

//       const sectionHeaderHeight = 40;
//       const sectionImageHeight = 22;
//       const sectionImageWidth = doc.internal.pageSize.getWidth() - marginLeft - marginRight;

//       // Dibujar imagen de fondo degradado
//       const gradientImageBase64 = 'https://res.cloudinary.com/da8iqyp0e/image/upload/v1753227103/finalgrad_xoy34s.png'; // <- pega aquí tu imagen

//       doc.addImage(gradientImageBase64, 'PNG', marginLeft, y, sectionImageWidth, sectionImageHeight);

//       // Título encima de la imagen
//       doc.setFont('helvetica', 'bold');
//       doc.setFontSize(12.5);
//       doc.setTextColor(0, 0, 0);
//       doc.text(title, marginLeft + 2, y + 10); // Ajusta verticalmente

//       y += sectionHeaderHeight;

//       doc.setFont('helvetica', 'normal');
//       doc.setFontSize(11);
//       doc.setTextColor(20, 20, 20);
//       doc.setLineHeightFactor(1.4);

//       const formattedContent = formatContentWithBullets(content || 'No disponible');
//       const lines = doc.splitTextToSize(formattedContent.join('\n'), maxWidth);

//       lines.forEach((line: string) => {
//         if (line.startsWith('•')) {
//           doc.text('•', marginLeft, y);
//           doc.text(line.substring(1), marginLeft + BULLET_POINT_INDENT, y, {
//             maxWidth: maxWidth - BULLET_POINT_INDENT
//           });
//         } else {
//           doc.text(line, marginLeft, y, { maxWidth });
//         }

//         y += LINE_HEIGHT + PARAGRAPH_LINE_SPACING;
//         if (line.trim() === '') {
//           y += LINE_HEIGHT;
//         }
//       });

//       return y + SECTION_SPACING + 5;
//     };

//     // const drawSection = (title: string, content: string, yStart: number): number => {
//     //   let y = yStart;

//     //   doc.setFont('helvetica', 'bold');
//     //   doc.setFontSize(13);
//     //   doc.setTextColor(30, 30, 30);
//     //   doc.text(title, marginLeft, y);
//     //   y += TITLE_MARGIN_BOTTOM + 5;

//     //   doc.setDrawColor(180, 180, 180);
//     //   doc.setLineWidth(0.4);
//     //   doc.line(marginLeft, y, doc.internal.pageSize.getWidth() - marginLeft, y);
//     //   y += SECTION_SPACING;

//     //   doc.setFont('helvetica', 'normal');
//     //   doc.setFontSize(11);
//     //   doc.setTextColor(20, 20, 20);
//     //   doc.setLineHeightFactor(1.4);

//     //   const formattedContent = formatContentWithBullets(content || 'No disponible');
//     //   const lines = doc.splitTextToSize(formattedContent.join('\n'), maxWidth);

//     //   lines.forEach((line: string) => {
//     //     if (line.startsWith('•')) {
//     //       doc.text('•', marginLeft, y);
//     //       doc.text(line.substring(1), marginLeft + BULLET_POINT_INDENT, y, {
//     //         maxWidth: maxWidth - BULLET_POINT_INDENT
//     //       });
//     //     } else {
//     //       doc.text(line, marginLeft, y, { maxWidth });
//     //     }

//     //     y += LINE_HEIGHT + PARAGRAPH_LINE_SPACING;

//     //     if (line.trim() === '') {
//     //       y += LINE_HEIGHT;
//     //     }
//     //   });

//     //   return y + SECTION_SPACING + 5;
//     // };

//     // === Página 3: Presentación y Objetivo de la Especialidad ===
//     doc.addPage('l');
//     let y = drawEncabezado2() + 20;
//     y = drawSection('PRESENTACIÓN', data.presentacion, y);
//     y = drawSection('OBJETIVO DE LA ESPECIALIDAD', data.objetivo_especialidad, y);

//     // === Página 4: Objetivo del Curso y Perfil de Ingreso ===
//     doc.addPage('l');
//     y = drawEncabezadoFija() + 20;
//     y = drawSection('OBJETIVO DEL CURSO', ficha.OBJETIVO, y);
//     y = drawSection('PERFIL DE INGRESO', ficha.PERFIL_INGRESO, y);

//     // === Página 5: Perfil de Egreso ===
//     doc.addPage('l');
//     y = drawEncabezadoFija() + 20;
//     drawSection('PERFIL DE EGRESO', ficha.PERFIL_EGRESO, y);
//   }



//   FichaTecnicaVirtual(doc: jsPDF, data: CursoPdfData): void {
//     const ficha = data.FICHA_TECNICA;
//     const etiquetas = (ficha?.ETIQUETAS || []).filter((e: any) => e.NOMBRE.toUpperCase() !== 'BIBLIOGRAFÍA');

//     // const etiquetas = ficha?.ETIQUETAS || [];
//     doc.addPage();
//     doc.setFont('helvetica', 'normal');
//     console.log("ficha", ficha)
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
//         if (data.row.index === 6 && data.column.index === 0) {
//           data.cell.styles.fontSize = 8;
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









//   agregarContenidoProgramatico(doc: jsPDF, data: CursoPdfData): void {
//     const contenidoProgramatico = data.CONTENIDOPROGRAMATICO;

//     doc.addPage();
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(12);
//     doc.text('CONTENIDO PROGRAMÁTICO', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

//     if (!contenidoProgramatico || contenidoProgramatico.length === 0) {
//       doc.setFont('helvetica', 'normal');
//       doc.text('No se ha definido contenido programático para este curso.', 15, 40);
//       return;
//     }
//     const encabezados = data.TIPO_CURSO_ID === 2
//       ? [
//         ['NO. Y NOMBRE DEL TEMA', 'TIEMPO (HRS)', 'CRITERIOS DE EVALUACIÓN', 'EVIDENCIAS', 'ACTIVIDADES DE ENSEÑANZA-APRENDIZAJE']
//       ]
//       : [
//         ['NO. Y NOMBRE DEL TEMA', 'TIEMPO (HRS)', 'COMPETENCIAS A DESARROLLAR', 'INSTRUMENTOS DE EVALUACIÓN', 'ACTIVIDADES DE ENSEÑANZA-APRENDIZAJE']
//       ];
//     const body = contenidoProgramatico.map((tema: any) => [
//       (tema.tema_nombre || '').replace(/\n/g, '\n'),
//       tema.tiempo ? tema.tiempo.toString() : '0',
//       (tema.competencias || '').replace(/\n/g, '\n'),
//       (tema.evaluacion || '').replace(/\n/g, '\n'),
//       (tema.actividades || '')
//     ]);

//     const totalHoras = contenidoProgramatico
//       .reduce((total: number, tema: any) => total + (parseInt(tema.tiempo) || 0), 0)
//       .toString();

//     if (data.TIPO_CURSO_ID === 2) {
//       body.push(['Total horas', totalHoras, '', '', '']);
//     } else {
//       body.push(['Evaluacion', '2', '', '', '']);
//       body.push(['Total horas', totalHoras, '', '', '']);
//     }


//     const pageWidth = doc.internal.pageSize.getWidth();
//     const margin = 15;
//     const availableWidth = pageWidth - margin * 2;

//     autoTable(doc, {
//       startY: 30,
//       head: encabezados,
//       body,
//       theme: 'grid',
//       showHead: 'everyPage', // Mostrar encabezados en cada página
//       rowPageBreak: 'avoid', // Evitar dividir filas entre páginas
//       styles: {
//         fontSize: 10,
//         font: 'helvetica',
//         cellPadding: 3,
//         // minCellHeight: 10, // Altura mínima de celda

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
//       margin: { top: 50, left: margin, right: margin },
//       tableWidth: 'auto',
//       didDrawCell: (data) => {
//         // Aplicar estilo bold a las filas adicionales
//         if (data.row.index === body.length - 1 || data.row.index === body.length - 2) {
//           doc.setFont('helvetica', 'bold');
//         }
//       }
//     });
//   }






//   agregarTablaMateriales(doc: jsPDF, data: CursoPdfData): void {
//     const materiales = data.MATERIALES || [];
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
//         lineWidth: 0.5, fontStyle: 'bold'
//       },
//       columnStyles: {
//         0: { halign: 'left' }
//       },
//       theme: 'grid'
//     });
//     if (data.TIPO_CURSO_ID == 3) {
//       const finalY = (doc as any).lastAutoTable.finalY || 50;
//       this.agregarNotasMateriales(doc, data, finalY + 15);
//     }


//   }
//   agregarNotasMateriales(doc: jsPDF, data: CursoPdfData, startY: number): void {
//     const notaMateriales = data.NOTA_MATERIALES || data.NOTA_MATERIALES;
//     if (!notaMateriales) return;

//     // Asegurarse de que el texto tenga el formato correcto
//     const textoFormateado = notaMateriales.startsWith('*') ? notaMateriales : `*${notaMateriales}`;

//     // Dividir en líneas
//     const lineas = textoFormateado.split('\n');

//     // Configuración de estilo
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'normal');

//     // Ajustes de posición:
//     const margenIzquierdo = 25; // Aumentado a 25 para mayor margen izquierdo (más a la derecha)
//     const espacioEntreLineas = 8; // Aumentado a 8 para más espacio entre líneas

//     // Dibujar cada línea con sangría adicional si empieza con asterisco
//     lineas.forEach((linea, index) => {
//       const posicionX = linea.startsWith('*') ? margenIzquierdo : margenIzquierdo + 5;
//       doc.text(linea, posicionX, startY + (index * espacioEntreLineas));
//     });
//   }



//   agregarTablaEquipamiento(doc: jsPDF, data: CursoPdfData): void {
//     const equipos = data.EQUIPAMIENTO || [];
//     if (equipos.length === 0) return;

//     doc.addPage();
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.text('EQUIPAMIENTO', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

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
//       ],
//       body: equipos.map((e: any) => {
//         // Función para extraer el valor numérico aunque venga como objeto
//         const getCantidad = (obj: any): string => {
//           if (typeof obj === 'number') return obj.toString();
//           if (typeof obj === 'string') return obj;
//           if (obj && obj.value !== undefined) return obj.value.toString();
//           return '';
//         };

//         return [
//           e.equipamiento_descripcion,
//           e.equipamiento_unidad_de_medida,
//           getCantidad(e.equipamiento_cantidad_10),
//           getCantidad(e.equipamiento_cantidad_15),
//           getCantidad(e.equipamiento_cantidad_20)
//         ];
//       }),
//       styles: {
//         fontSize: 9,
//         cellPadding: 3,
//         lineColor: [0, 0, 0],  // Bordes negros
//         lineWidth: 0.5,        // Grosor del borde
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
//         lineWidth: 0.5, fontStyle: 'bold'
//       },
//       columnStyles: {
//         0: { halign: 'left' } // Descripción alineada a la izquierda
//       },
//       theme: 'grid'
//     });
//   }







//   formatDate(fechaIso: string): string {
//     const date = new Date(fechaIso);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   }





//   drawFooter(doc: jsPDF, data: CursoPdfData): void {
//     console.log("data", data);
//     const pageNumber = doc.getCurrentPageInfo().pageNumber;
//     const totalPages = doc.getNumberOfPages();
//     if (pageNumber <= 1) return;

//     const pageWidth = doc.internal.pageSize.width;
//     const pageHeight = doc.internal.pageSize.height;
//     const footerY = pageHeight - 40;

//     const marginX = 20;
//     const tableWidth = pageWidth - marginX * 2;
//     const topCellHeight = 12;
//     const bottomCellHeight = 24; // 🔹 Más alto para contener el nuevo espaciado
//     // const bottomCellHeight = 28; // 🔹 Más alto para contener el nuevo espaciado

//     const colWidths = [
//       tableWidth * 0.34,
//       tableWidth * 0.19,
//       tableWidth * 0.12,
//       tableWidth * 0.23,
//       tableWidth * 0.12
//     ];
//     const fields = [
//       {
//         title: 'Revisó y Aprobó:',
//         value: data.reviso_aprobo_texto || 'Coordinación de Gestión de la Calidad'
//       },
//       {
//         title: 'Código:',
//         value: data.codigo_formato || 'DA-PP-CAE-01'
//       },
//       {
//         title: 'Versión No:',
//         value: data.version_formato?.toString() || '1'
//       },
//       {
//         title: 'Fecha de Emisión:',
//         value: data.fecha_emision_formato
//           ? this.formatDate(data.fecha_emision_formato)
//           : '01/01/2024'
//       },
//       {
//         title: 'Hoja:',
//         value: `${pageNumber} de ${totalPages}`
//       }
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




//   finalize(doc: jsPDF) {
//     this.finalizeCallback(doc);
//   }
// }
