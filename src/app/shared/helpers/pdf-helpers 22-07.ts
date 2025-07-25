// import { signal } from '@angular/core';
// import { SafeResourceUrl } from '@angular/platform-browser';
// import jsPDF from 'jspdf';
// import { CursoPdfData } from '../types/curso-pdf-data.type';
// import autoTable from 'jspdf-autotable';
// interface SectionConfig {
//   title: string;
//   content: string;
//   type?: 'paragraph' | 'list' | 'bibliography' | 'indented';
//   lineHeight?: number;
//   paragraphSpacing?: number;
//   firstLineIndent?: number;
// }

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
//         doc.setFontSize(11);
//         const centerText = (text: string, offset = 18) => {
//           doc.text(text, pageWidth / 2, y, { align: 'center' });
//           y += offset;
//         };
//         centerText('PROGRAMA DE ESTUDIO');
//         break;
//       }
//     }
//   }



//   // drawCourseDetailsTipoRegular(doc: jsPDF, data: CursoPdfData): void {
//   //   const marginLeft = 71; // ≈ 2.5 cm
//   //   const marginRight = doc.internal.pageSize.getWidth() - marginLeft;
//   //   const maxTextWidth = 420;
//   //   const lineHeight = 13;

//   //   let y = 120;

//   //   // Espacio extra si es tipo curso 4
//   //   if (data.TIPO_CURSO_ID === 4) {
//   //     y += 60;
//   //   }

//   //   // ======= NOMBRE =======
//   //   doc.setFont('helvetica', 'bold');
//   //   doc.setFontSize(18);
//   //   const nombre = data.NOMBRE || '';
//   //   const nombreLines = doc.splitTextToSize(nombre, maxTextWidth);
//   //   nombreLines.forEach((line: string | string[]) => {
//   //     doc.text(line, marginRight, y, { align: 'right' });
//   //     y += lineHeight;
//   //   });
//   //   y += 5; // Espacio debajo de nombre

//   //   // ======= CLAVE =======
//   //   doc.setFont('helvetica', 'bold');
//   //   doc.setFontSize(12);
//   //   const clave = `CLAVE: ${data.CLAVE?.toUpperCase() || ''}`;
//   //   doc.text(clave, marginRight, y, { align: 'right' });
//   //   y += 15; // Reducido ligeramente

//   //   // ======= LÍNEAS =======
//   //   doc.setDrawColor(0, 100, 0); // Verde oscuro
//   //   doc.setLineWidth(1.5);
//   //   doc.line(marginLeft, y, marginRight, y);
//   //   y += 5;

//   //   doc.setDrawColor(150); // Gris claro
//   //   doc.setLineWidth(1.5);
//   //   doc.line(marginLeft, y, marginRight, y);
//   //   y += 30; // Espacio después de líneas

//   //   // ======= ÁREA (MISMA LÍNEA) =======
//   //   doc.setFont('helvetica', 'normal');
//   //   doc.setFontSize(11);
//   //   const areaLabel = 'ÁREA:';
//   //   doc.text(areaLabel, marginLeft, y);

//   //   const areaText = data.AREA_NOMBRE?.toUpperCase() || '';
//   //   doc.setFont('helvetica', 'bold');
//   //   doc.text(areaText, marginLeft + doc.getTextWidth(areaLabel) + 5, y);

//   //   y += lineHeight + 5;

//   //   // ======= ESPECIALIDAD (MISMA LÍNEA) =======
//   //   doc.setFont('helvetica', 'normal');
//   //   const espLabel = 'ESPECIALIDAD:';
//   //   doc.text(espLabel, marginLeft, y);

//   //   const espText = data.ESPECIALIDAD_NOMBRE?.toUpperCase() || '';
//   //   doc.setFont('helvetica', 'bold');
//   //   doc.text(espText, marginLeft + doc.getTextWidth(espLabel) + 5, y);
//   // }

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

//     let boxY = 340;
//     if (data.TIPO_CURSO_ID !== 4) {
//       boxY = 260; // Posición calculada
//     }

//     const contentMarginTop = 15;

//     if (data.TIPO_CURSO_ID === 4) {
//       // y += 60;
//       doc.setFontSize(12);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(160); // Gris claro
//       doc.text('FICHA TECNICA DE CURSO REGULAR', pageWidth / 2, boxY - 3, { align: 'center' });

//       // Restaurar color y tamaño para contenido
//     }
//     doc.setTextColor(0);
//     doc.setFontSize(8.5);
//     // === TÍTULO CENTRAL SUPERIOR EN GRIS CLARO ===

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
//     const marginLeft = 130; // 2.5 cm
//     const maxTextWidth = 420;
//     const lineHeight = 13;
//     let y = 210; // Aumenté este valor para bajar un poco toda la sección

//     const renderField = (label: string, value: string) => {
//       doc.setFont('helvetica', 'bold');
//       doc.setFontSize(14);

//       // Combinar label y valor en la misma línea
//       const fullText = `${label}: ${value.toUpperCase()}`;

//       // Dividir el texto en líneas si es necesario
//       const lines = doc.splitTextToSize(fullText, maxTextWidth);
//       lines.forEach((line: string) => {
//         doc.text(line, marginLeft, y);
//         y += lineHeight;
//       });

//       y += 10; // Espacio entre campos (reducido de 24 a 10)
//     };

//     renderField('CURSO', data.NOMBRE || '');
//     renderField('CLAVE DEL CURSO', data.CLAVE || '');

//     // Ajustar posición Y después de todos los campos si es necesario
//     y += 10;
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

//   // drawSignatureSectionRegular(doc: jsPDF, data: CursoPdfData): void {
//   //   let y = 400; // 🔼 Subido un poco más (antes 550)
//   //   const marginLeft = 71; // Posicionado a la izquierda
//   //   const posX = marginLeft;

//   //   const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
//   //     const tempDoc = new jsPDF();
//   //     tempDoc.setFontSize(fontSize);
//   //     return tempDoc.splitTextToSize(text, maxWidth);
//   //   };

//   //   const drawSignature = (title: string, nombre: string, cargo: string) => {
//   //     const maxWidth = 120;
//   //     const fontSize = 9;

//   //     doc.setFontSize(fontSize);
//   //     doc.setFont('helvetica', 'bold');
//   //     doc.text(title, posX, y, { align: 'left' });
//   //     y += 10;

//   //     doc.setFont('helvetica', 'normal');
//   //     if (nombre) {
//   //       doc.text(nombre, posX, y, { align: 'left' });
//   //       y += 10;
//   //     }

//   //     if (cargo) {
//   //       const lines = wrapText(cargo, maxWidth, fontSize);
//   //       lines.forEach(line => {
//   //         doc.text(line, posX, y, { align: 'left' });
//   //         y += 8;
//   //       });
//   //     } else {
//   //       doc.text('No disponible', posX, y, { align: 'left' });
//   //       y += 10;
//   //     }

//   //     y += 18;
//   //   };

//   //   drawSignature(
//   //     'Elaborado por:',
//   //     data.firmas.ELABORADO_POR.nombre,
//   //     data.firmas.ELABORADO_POR.cargo
//   //   );

//   //   drawSignature(
//   //     'Revisado por:',
//   //     data.firmas.REVISADO_POR.nombre,
//   //     data.firmas.REVISADO_POR.cargo
//   //   );

//   //   drawSignature(
//   //     'Autorizado por:',
//   //     data.firmas.AUTORIZADO_POR.nombre,
//   //     data.firmas.AUTORIZADO_POR.cargo
//   //   );
//   // }
//   drawSignatureSectionRegular(doc: jsPDF, data: CursoPdfData): void {
//     let y = 400;
//     let marginLeft = 71; // Valor por defecto

//     if (data.TIPO_CURSO_ID === 5) {
//       marginLeft = 130;
//       y = 280;
//     }

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
//       data.firmas.ELABORADO_POR?.nombre ?? '',
//       data.firmas.ELABORADO_POR?.cargo ?? ''
//     );

//     drawSignature(
//       'Revisado por:',
//       data.firmas.REVISADO_POR?.nombre ?? '',
//       data.firmas.REVISADO_POR?.cargo ?? ''
//     );

//     drawSignature(
//       'Autorizado por:',
//       data.firmas.AUTORIZADO_POR?.nombre ?? '',
//       data.firmas.AUTORIZADO_POR?.cargo ?? ''
//     );
//   }
// // interface SectionConfig {
// //   title: string;
// //   content: string;
// //   type?: 'paragraph' | 'list' | 'bibliography' | 'indented';
// //   lineHeight?: number;
// //   paragraphSpacing?: number;
// //   firstLineIndent?: number;
// // }

//  FichaTecnicaSEP(doc: jsPDF, data: CursoPdfData, img: HTMLImageElement): void {
//   const ficha = data.FICHA_TECNICA;
//   const etiquetas = ficha?.ETIQUETAS || [];

//   doc.setFont('helvetica', 'normal');

//   // Configuración de página
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const marginTop = 30;
//   const marginSide = 40;
//   const maxWidth = pageWidth - marginSide * 2;

//   // Configuración por defecto
//   const defaultLineHeight = 6.5;
//   const defaultParagraphSpacing = 10;
//   const defaultFirstLineIndent = 15;
//   let y = marginTop;

//   // Función para manejar saltos de página
//   const checkPageBreak = (spaceNeeded: number) => {
//     if (y + spaceNeeded > pageHeight - marginTop) {
//       doc.addPage('landscape');
//       doc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);
//       y = marginTop;
//     }
//   };

//   // Función para procesar diferentes tipos de contenido
//   const processContent = (text: string, config: {
//     type?: 'paragraph' | 'list' | 'bibliography' | 'indented';
//     lineHeight?: number;
//     paragraphSpacing?: number;
//     firstLineIndent?: number;
//   }) => {
//     const {
//       type = 'paragraph',
//       lineHeight = defaultLineHeight,
//       paragraphSpacing = defaultParagraphSpacing,
//       firstLineIndent = defaultFirstLineIndent
//     } = config;

//     // Normalizar texto
//     const normalizedText = text.replace(/\s*\n\s*/g, ' ').trim();
//     const paragraphs = normalizedText.split(/\n{2,}/);

//     paragraphs.forEach((paragraph: string) => {
//       const cleanParagraph = paragraph.replace(/\s+/g, ' ').trim();
      
//       if (type === 'list' || type === 'bibliography') {
//         // Procesar elementos de lista
//         const items = cleanParagraph.split(/\n(?=\s*[-•♦]|\d+\.)/); // Detecta viñetas o números
//         items.forEach((item, index) => {
//           if (item.trim() === '') return;
          
//           const bullet = type === 'bibliography' ? '' : (item.match(/^(\s*[-•♦]|\d+\.)/)?.[0] || '• ');
//           const itemText = type === 'bibliography' ? item : item.replace(/^(\s*[-•♦]|\d+\.)/, '').trim();
          
//           const lines = doc.splitTextToSize(bullet + itemText, maxWidth - (type === 'bibliography' ? 0 : 10));
          
//           lines.forEach((line: string, lineIndex: number) => {
//             checkPageBreak(lineHeight);
//             const x = marginSide + (lineIndex === 0 ? 0 : 10);
//             doc.text(line, x, y, { align: type === 'bibliography' ? 'justify' : 'left' });
//             y += lineHeight;
//           });
          
//           if (index < items.length - 1) {
//             y += lineHeight * 0.5; // Espacio reducido entre items
//           }
//         });
//       } else {
//         // Procesar párrafos normales
//         const lines = doc.splitTextToSize(cleanParagraph, maxWidth - (type === 'indented' ? firstLineIndent : 0));
        
//         lines.forEach((line: string, lineIndex: number) => {
//           checkPageBreak(lineHeight);
//           const x = marginSide + (lineIndex === 0 && type === 'indented' ? firstLineIndent : 0);
//           doc.text(line, x, y, { align: 'justify' });
//           y += lineHeight;
//         });
//       }
      
//       y += paragraphSpacing;
//     });
//   };

//   // Crear página inicial
//   doc.addPage('landscape');
//   doc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);

//   // Configuración de secciones
//   const sections: SectionConfig[] = [
//     { 
//       title: 'JUSTIFICACIÓN', 
//       content: data.objetivo_especialidad,
//       type: 'paragraph'
//     },
//     { 
//       title: 'PRESENTACIÓN', 
//       content: data.presentacion,
//       type: 'paragraph'
//     },
//     { 
//       title: 'OBJETIVO GENERAL DEL CURSO', 
//       content: ficha.OBJETIVO,
//       type: 'paragraph'
//     },
//     { 
//       title: 'PERFIL DE INGRESO', 
//       content: ficha.PERFIL_INGRESO,
//       type: 'paragraph'
//     },
//     { 
//       title: 'PERFIL DE EGRESO', 
//       content: ficha.PERFIL_EGRESO,
//       type: 'paragraph'
//     },
//     { 
//       title: 'PERFIL DEL INSTRUCTOR / DOCENTE', 
//       content: ficha.PERFIL_DEL_DOCENTE,
//       type: 'paragraph'
//     },
//     { 
//       title: 'METODOLOGÍA DE CAPACITACIÓN', 
//       content: ficha.METODOLOGIA,
//       type: 'paragraph'
//     },
//     // Para etiquetas, puedes especificar el tipo según el contenido
//     ...etiquetas.map((e: any) => ({
//       title: e.NOMBRE.toUpperCase(),
//       content: e.DATO,
//       type: e.NOMBRE.includes('BIBLIOGRAFÍA') ? 'bibliography' as 'bibliography'
//         : e.NOMBRE.includes('CONTENIDO') ? 'list' as 'list'
//         : 'paragraph' as 'paragraph'
//     }))
//   ];

//   // Procesar cada sección
//   sections.forEach(({ title, content, type, lineHeight, paragraphSpacing, firstLineIndent }) => {
//     checkPageBreak(25);

//     // Título de la sección
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(13);
//     doc.text(title, pageWidth / 2, y, { align: 'center' });
//     y += 10;

//     // Contenido de la sección
//     doc.setFont('helvetica', 'normal');
//     doc.setFontSize(11);
    
//     processContent(content, {
//       type,
//       lineHeight,
//       paragraphSpacing,
//       firstLineIndent
//     });

//     y += 10; // Espacio entre secciones
//   });
// }
//   // FichaTecnicaSEP(doc: jsPDF, data: CursoPdfData, img: HTMLImageElement): void {
//   //   const ficha = data.FICHA_TECNICA;
//   //   const etiquetas = ficha?.ETIQUETAS || [];

//   //   doc.setFont('helvetica', 'normal');

//   //   const pageWidth = doc.internal.pageSize.getWidth();
//   //   const pageHeight = doc.internal.pageSize.getHeight();
//   //   const margin = 40;
//   //   const maxWidth = pageWidth - margin * 2;
//   //   const lineHeight = 7;
//   //   const paragraphSpacing = 10;
//   //   const firstLineIndent = 12;
//   //   let y = margin;

//   //   const checkPageBreak = (requiredSpace: number) => {
//   //     if (y + requiredSpace > pageHeight - margin) {
//   //       doc.addPage();
//   //       doc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);
//   //       y = margin;
//   //     }
//   //   };

//   //   doc.addPage();
//   //   doc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);

//   //   const content = [
//   //     { titulo: 'JUSTIFICACIÓN', texto: data.objetivo_especialidad },
//   //     { titulo: 'PRESENTACIÓN', texto: data.presentacion},
//   //     { titulo: 'OBJETIVO GENERAL DEL CURSO', texto: ficha.OBJETIVO },
//   //     { titulo: 'PERFIL DE INGRESO', texto: ficha.PERFIL_INGRESO },
//   //     { titulo: 'PERFIL DE EGRESO', texto: ficha.PERFIL_EGRESO },
//   //     { titulo: 'PERFIL DEL INSTRUCTOR / DOCENTE', texto: ficha.PERFIL_DEL_DOCENTE },
//   //     { titulo: 'METODOLOGÍA DE CAPACITACIÓN', texto: ficha.METODOLOGIA },
//   //     ...etiquetas.map((e: any) => ({
//   //       titulo: e.NOMBRE.toUpperCase(),
//   //       texto: e.DATO
//   //     }))
//   //   ];

//   //   content.forEach(({ titulo, texto }) => {
//   //     checkPageBreak(30);

//   //     // Título centrado
//   //     doc.setFont('helvetica', 'bold');
//   //     doc.setFontSize(13);
//   //     doc.text(titulo, pageWidth / 2, y, { align: 'center' });
//   //     y += 15;

//   //     doc.setFont('helvetica', 'normal');
//   //     doc.setFontSize(11);

//   //     const paragraphs = texto.split('\n').filter((p: string) => p.trim() !== '');
//   //     paragraphs.forEach((paragraph: string) => {
//   //       const lines = doc.splitTextToSize(paragraph.trim(), maxWidth - firstLineIndent);

//   //       // Primera línea con sangría
//   //       if (lines.length > 0) {
//   //         checkPageBreak(lineHeight);
//   //         doc.text(lines[0], margin + firstLineIndent, y, { align: 'justify' });
//   //         y += lineHeight;

//   //         // Líneas subsiguientes sin sangría
//   //         for (let i = 1; i < lines.length; i++) {
//   //           checkPageBreak(lineHeight);
//   //           doc.text(lines[i], margin, y, { align: 'justify' });
//   //           y += lineHeight;
//   //         }
//   //       }

//   //       y += paragraphSpacing;
//   //     });

//   //     y += 15; // Espacio entre secciones
//   //   });
//   // }

//   // FichaTecnicaSEP(doc: jsPDF, data: CursoPdfData, img: HTMLImageElement): void {
//   //   const ficha = data.FICHA_TECNICA;
//   //   const etiquetas = ficha?.ETIQUETAS || [];

//   //   // Configuración tipográfica profesional
//   //   doc.setFont('helvetica', 'normal');

//   //   // Dimensiones y márgenes
//   //   const pageWidth = doc.internal.pageSize.getWidth();
//   //   const pageHeight = doc.internal.pageSize.getHeight();
//   //   const margin = 50;
//   //   const maxWidth = pageWidth - margin * 2;
//   //   let y = margin;

//   //   // Control de paginación
//   //   const checkPageBreak = (requiredSpace: number) => {
//   //     if (y + requiredSpace > pageHeight - margin) {
//   //       doc.addPage();
//   //       doc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);
//   //       y = margin;
//   //     }
//   //   };

//   //   // Página inicial
//   //   doc.addPage();
//   //   doc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);

//   //   // Contenido
//   //   const content = [
//   //     { titulo: 'JUSTIFICACIÓN', texto: data.objetivo_especialidad },
//   //     { titulo: 'PERFIL DE INGRESO', texto: ficha.PERFIL_INGRESO },
//   //     { titulo: 'PERFIL DE EGRESO', texto: ficha.PERFIL_EGRESO },
//   //     { titulo: 'PERFIL DEL INSTRUCTOR / DOCENTE', texto: ficha.PERFIL_DEL_DOCENTE },
//   //     { titulo: 'METODOLOGÍA DE CAPACITACIÓN', texto: ficha.METODOLOGIA },
//   //     ...etiquetas.map((e: any) => ({
//   //       titulo: e.NOMBRE.toUpperCase(),
//   //       texto: e.DATO
//   //     }))
//   //   ];

//   //   // Procesamiento de contenido con formato mejorado
//   //   content.forEach(({ titulo, texto }) => {
//   //     checkPageBreak(30);

//   //     // Estilo para títulos
//   //     doc.setFont('helvetica', 'bold');
//   //     doc.setFontSize(14);
//   //     doc.text(titulo, pageWidth / 2, y, { align: 'center' });
//   //     y += 20;

//   //     // Configuración avanzada de párrafos
//   //     const lineHeight = 7;
//   //     const paragraphSpacing = 12;
//   //     const firstLineIndent = 15;
//   //     const bulletIndent = 10;
//   //     const bulletSpacing = 5;

//   //     // Detectar si es una lista (bibliografía)
//   //     const isList = titulo === 'BIBLIOGRAFÍA' || texto.includes('•') || texto.includes('\n•');

//   //     if (isList) {
//   //       // Formato especial para listas/bibliografía
//   //       const items = texto.split(/\n•|\n \•|\n-\s|\n\*\s/).filter((item: string) => item.trim() !== '');

//   //       items.forEach((item: string) => {
//   //         checkPageBreak(lineHeight * 3);

//   //         // Viñeta o bullet point
//   //         doc.setFont('helvetica', 'bold');
//   //         doc.text('•', margin + bulletIndent, y + lineHeight/2);

//   //         // Texto del item
//   //         doc.setFont('helvetica', 'normal');
//   //         const lines = doc.splitTextToSize(item.trim(), maxWidth - bulletIndent - 5);

//   //         lines.forEach((line: string, index: number) => {
//   //           checkPageBreak(lineHeight);
//   //           const xPos = index === 0 ? margin + bulletIndent + 5 : margin + bulletIndent + 5;
//   //           doc.text(line, xPos, y, {
//   //             align: 'left',
//   //             maxWidth: maxWidth - bulletIndent - 5
//   //           });
//   //           y += lineHeight;
//   //         });

//   //         y += bulletSpacing;
//   //       });
//   //     } else {
//   //       // Formato estándar para párrafos normales
//   //       const paragraphs = texto.split('\n').filter((p: string) => p.trim() !== '');

//   //       paragraphs.forEach((paragraph: string) => {
//   //         const lines = doc.splitTextToSize(paragraph.trim(), maxWidth - 