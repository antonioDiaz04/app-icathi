import { signal } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import { CursoPdfData } from '../types/curso-pdf-data.type';
import autoTable from 'jspdf-autotable';

export class PdfHelpers {
  constructor(private finalizeCallback: (doc: jsPDF) => void) { }

  logoUrl = 'https://res.cloudinary.com/dvvhnrvav/image/upload/v1736174056/icathi/tsi14aynpqjer8fthxtz.png';

  drawBackground(doc: jsPDF, img: HTMLImageElement) {
    doc.addImage(img, 'PNG', 0, 0, 612, 792);
  }
  drawBackgroundTipoRegular_SEP(doc: jsPDF, img: HTMLImageElement) {
    // Landscape letter: 792 pt de ancho x 612 pt de alto
    doc.addImage(img, 'PNG', 0, 0, 792, 612);
  }



  drawHeader(doc: jsPDF, data: CursoPdfData): void {
    console.log("data", data);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = pageHeight / 2 - 260;

    const centerText = (text: string, offset = 18) => {
      doc.text(text, pageWidth / 2, y, { align: 'center' });
      y += offset;
    };

    switch (data.TIPO_CURSO_ID) {
      case 1:
        centerText('PROGRAMA DE ESTUDIO');
        centerText('CURSO DE CAPACITACIÓN ACELERADA ESPECÍFICA');
        centerText(`"${data.TIPO_CURSO.toUpperCase()}"`);
        break;

      case 2:
        centerText('CURSO DE CAPACITACIÓN');
        centerText(`"${data.TIPO_CURSO.toUpperCase()}"`);
        break;

      case 3:
        const text = 'ESCUELA DE PINTURA ARTÍSTICA';
        const textWidth = doc.getTextWidth(text);
        doc.text(text, pageWidth / 2, y, { align: 'center' });
        doc.line((pageWidth - textWidth) / 2, y + 2, (pageWidth + textWidth) / 2, y + 2);
        y += 18;
        centerText('PROGRAMA DE ESTUDIO');
        break;
    }
  }



  drawHeaderTipoRegular_SEP(doc: jsPDF, data: CursoPdfData): void {
    console.log("data", data);

    doc.setFont('helvetica', 'bold');
    const pageWidth = doc.internal.pageSize.getWidth();   // 792 en landscape
    const pageHeight = doc.internal.pageSize.getHeight(); // 612 en landscape

    let y = 140;

    switch (data.TIPO_CURSO_ID) {
      case 4: {
        const marginLeft = 71;
        doc.setFontSize(24);
        doc.text('Oferta Educativa ICATHI', marginLeft, y);
        break;
      }

      case 5: {
        doc.setFontSize(11);
        const centerText = (text: string, offset = 18) => {
          doc.text(text, pageWidth / 2, y, { align: 'center' });
          y += offset;
        };
        centerText('PROGRAMA DE ESTUDIO');
        break;
      }
    }
  }



  // drawCourseDetailsTipoRegular(doc: jsPDF, data: CursoPdfData): void {
  //   const marginLeft = 71; // ≈ 2.5 cm
  //   const marginRight = doc.internal.pageSize.getWidth() - marginLeft;
  //   const maxTextWidth = 420;
  //   const lineHeight = 13;

  //   let y = 120;

  //   // Espacio extra si es tipo curso 4
  //   if (data.TIPO_CURSO_ID === 4) {
  //     y += 60;
  //   }

  //   // ======= NOMBRE =======
  //   doc.setFont('helvetica', 'bold');
  //   doc.setFontSize(18);
  //   const nombre = data.NOMBRE || '';
  //   const nombreLines = doc.splitTextToSize(nombre, maxTextWidth);
  //   nombreLines.forEach((line: string | string[]) => {
  //     doc.text(line, marginRight, y, { align: 'right' });
  //     y += lineHeight;
  //   });
  //   y += 5; // Espacio debajo de nombre

  //   // ======= CLAVE =======
  //   doc.setFont('helvetica', 'bold');
  //   doc.setFontSize(12);
  //   const clave = `CLAVE: ${data.CLAVE?.toUpperCase() || ''}`;
  //   doc.text(clave, marginRight, y, { align: 'right' });
  //   y += 15; // Reducido ligeramente

  //   // ======= LÍNEAS =======
  //   doc.setDrawColor(0, 100, 0); // Verde oscuro
  //   doc.setLineWidth(1.5);
  //   doc.line(marginLeft, y, marginRight, y);
  //   y += 5;

  //   doc.setDrawColor(150); // Gris claro
  //   doc.setLineWidth(1.5);
  //   doc.line(marginLeft, y, marginRight, y);
  //   y += 30; // Espacio después de líneas

  //   // ======= ÁREA (MISMA LÍNEA) =======
  //   doc.setFont('helvetica', 'normal');
  //   doc.setFontSize(11);
  //   const areaLabel = 'ÁREA:';
  //   doc.text(areaLabel, marginLeft, y);

  //   const areaText = data.AREA_NOMBRE?.toUpperCase() || '';
  //   doc.setFont('helvetica', 'bold');
  //   doc.text(areaText, marginLeft + doc.getTextWidth(areaLabel) + 5, y);

  //   y += lineHeight + 5;

  //   // ======= ESPECIALIDAD (MISMA LÍNEA) =======
  //   doc.setFont('helvetica', 'normal');
  //   const espLabel = 'ESPECIALIDAD:';
  //   doc.text(espLabel, marginLeft, y);

  //   const espText = data.ESPECIALIDAD_NOMBRE?.toUpperCase() || '';
  //   doc.setFont('helvetica', 'bold');
  //   doc.text(espText, marginLeft + doc.getTextWidth(espLabel) + 5, y);
  // }

  drawCourseDetailsTipoRegular(doc: jsPDF, data: CursoPdfData): void {
    const marginLeft = 71; // ≈ 2.5 cm
    const marginRight = doc.internal.pageSize.getWidth() - marginLeft;
    const maxTextWidth = 420;
    const lineHeight = 13;

    let y = 120;

    // Espacio extra si es tipo curso 4
    if (data.TIPO_CURSO_ID === 4) {
      y += 60;
    }

    // ======= NOMBRE =======
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    const nombre = data.NOMBRE || '';
    const nombreLines = doc.splitTextToSize(nombre, maxTextWidth);
    nombreLines.forEach((line: string | string[]) => {
      doc.text(line, marginRight, y, { align: 'right' });
      y += lineHeight;
    });
    y += 5; // Espacio debajo de nombre

    // ======= CLAVE =======
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    const clave = `CLAVE: ${data.CLAVE?.toUpperCase() || ''}`;
    doc.text(clave, marginRight, y, { align: 'right' });
    y += 15; // Reducido ligeramente

    // ======= LÍNEAS =======
    doc.setDrawColor(0, 100, 0); // Verde oscuro
    doc.setLineWidth(1.5);
    doc.line(marginLeft, y, marginRight, y);
    y += 5;

    doc.setDrawColor(150); // Gris claro
    doc.setLineWidth(1.5);
    doc.line(marginLeft, y, marginRight, y);
    y += 30; // Espacio después de líneas

    // ======= ÁREA (MISMA LÍNEA) =======
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const areaLabel = 'ÁREA:';
    doc.text(areaLabel, marginLeft, y);

    const areaText = data.AREA_NOMBRE?.toUpperCase() || '';
    doc.setFont('helvetica', 'bold');
    doc.text(areaText, marginLeft + doc.getTextWidth(areaLabel) + 5, y);

    y += lineHeight + 5;

    // ======= ESPECIALIDAD (MISMA LÍNEA) =======
    doc.setFont('helvetica', 'normal');
    const espLabel = 'ESPECIALIDAD:';
    doc.text(espLabel, marginLeft, y);

    const espText = data.ESPECIALIDAD_NOMBRE?.toUpperCase() || '';
    doc.setFont('helvetica', 'bold');
    doc.text(espText, marginLeft + doc.getTextWidth(espLabel) + 5, y);
  }

  drawValidityBoxTipoRegular_SEP(doc: jsPDF, data: CursoPdfData): void {
    const pageWidth = doc.internal.pageSize.getWidth(); // 792 en landscape
    const marginRight = 71;
    const boxWidth = 120;

    const offsetRight = 55; // Posición más a la derecha
    const boxX = pageWidth - marginRight - boxWidth + offsetRight;

    let boxY = 340;
    if (data.TIPO_CURSO_ID !== 4) {
      boxY = 260; // Posición calculada
    }

    const contentMarginTop = 15;

    if (data.TIPO_CURSO_ID === 4) {
      // y += 60;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(160); // Gris claro
      doc.text('FICHA TECNICA DE CURSO REGULAR', pageWidth / 2, boxY - 3, { align: 'center' });

      // Restaurar color y tamaño para contenido
    }
    doc.setTextColor(0);
    doc.setFontSize(8.5);
    // === TÍTULO CENTRAL SUPERIOR EN GRIS CLARO ===

    // ==== VIGENCIA ====
    doc.setFont('helvetica', 'bold');
    doc.text('VIGENCIA A PARTIR DE:', boxX + boxWidth / 2, boxY + contentMarginTop, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.text(
      data.VIGENCIA_INICIO?.split('T')[0] || '2011-11-18',
      boxX + boxWidth / 2,
      boxY + contentMarginTop + 10,
      { align: 'right' }
    );

    // ==== PUBLICACIÓN ====
    doc.setFont('helvetica', 'bold');
    doc.text(
      'PUBLICACIÓN:',
      boxX + boxWidth / 2,
      boxY + contentMarginTop + 35,
      { align: 'right' }
    );

    doc.setFont('helvetica', 'normal');
    doc.text(
      data.FECHA_PUBLICACION?.split('T')[0] || '2011-11-18',
      boxX + boxWidth / 2,
      boxY + contentMarginTop + 45,
      { align: 'right' }
    );
  }


  drawCourseDetailsTipoSEP(doc: jsPDF, data: CursoPdfData): void {
    const marginLeft = 130; // 2.5 cm
    const maxTextWidth = 420;
    const lineHeight = 13;
    let y = 210; // Aumenté este valor para bajar un poco toda la sección

    const renderField = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);

      // Combinar label y valor en la misma línea
      const fullText = `${label}: ${value.toUpperCase()}`;

      // Dividir el texto en líneas si es necesario
      const lines = doc.splitTextToSize(fullText, maxTextWidth);
      lines.forEach((line: string) => {
        doc.text(line, marginLeft, y);
        y += lineHeight;
      });

      y += 10; // Espacio entre campos (reducido de 24 a 10)
    };

    renderField('CURSO', data.NOMBRE || '');
    renderField('CLAVE DEL CURSO', data.CLAVE || '');

    // Ajustar posición Y después de todos los campos si es necesario
    y += 10;
  }

  drawCourseDetailsESCUELA(doc: jsPDF, data: CursoPdfData): void {
    const labelX = 50;
    const maxTextWidth = 360;
    const lineHeight = 13;
    let y = 260;

    const renderField = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      const labelText = `${label}:`;
      doc.text(labelText, labelX, y);

      y += lineHeight;

      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(value, maxTextWidth);

      for (let i = 0; i < lines.length; i++) {
        doc.text(lines[i], labelX, y);
        y += lineHeight;
      }

      y += 24;
    };

    renderField('NOMBRE DEL CURSO', data.NOMBRE.toUpperCase() || '');
    renderField('CLAVE DEL CURSO', data.CLAVE?.toUpperCase() || '');
    renderField('DURACIÓN DEL CURSO', `${(data.CONTENIDOPROGRAMATICO || []).reduce((total: number, tema: any) => total + (parseInt(tema.tiempo) || 0), 0)} HORAS`);
  }
  drawCourseDetails(doc: jsPDF, data: CursoPdfData): void {
    const labelX = 50;
    const maxTextWidth = 360;
    const lineHeight = 13;
    let y = 260;

    const renderField = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      const labelText = `${label}:`;
      const labelWidth = doc.getTextWidth(labelText);
      const valueMaxWidth = maxTextWidth - labelWidth - 5;

      const lines = doc.splitTextToSize(value, valueMaxWidth);
      const totalHeight = Math.max(lines.length * lineHeight, lineHeight) + 4;

      doc.text(labelText, labelX, y);
      doc.setFont('helvetica', 'normal');
      doc.text(lines[0], labelX + labelWidth + 5, y);

      for (let i = 1; i < lines.length; i++) {
        y += lineHeight;
        doc.text(lines[i], labelX + labelWidth + 5, y);
      }

      y += lineHeight + 8;
    };

    renderField('ÁREA OCUPACIONAL', data.AREA_NOMBRE.toUpperCase() || '');
    renderField('ESPECIALIDAD', data.ESPECIALIDAD_NOMBRE.toUpperCase() || '');
    renderField('CURSO', data.NOMBRE.toUpperCase() || '');
    renderField('CLAVE DEL CURSO', data.CLAVE?.toUpperCase() || '');
    renderField('DURACIÓN', `${(data.CONTENIDOPROGRAMATICO || []).reduce((total: number, tema: any) => total + (parseInt(tema.tiempo) || 0), 0)} HORAS`);
  }

  drawValidityBox(doc: jsPDF, data: CursoPdfData): void {
    const boxX = 430; // 400 + 30 offset
    const boxY = 260; // Calculated position
    const boxWidth = 120;
    const boxHeight = 90;
    const radius = 10;

    // Draw box
    doc.setDrawColor(0);
    doc.setLineWidth(1.2);
    doc.roundedRect(boxX, boxY, boxWidth, boxHeight, radius, radius);
    doc.line(boxX, boxY + boxHeight / 2, boxX + boxWidth, boxY + boxHeight / 2);

    // Box content
    doc.setFontSize(8.5);
    const contentMarginTop = 15;

    // First section (Validity)
    doc.setFont('helvetica', 'bold');
    doc.text('VIGENCIA A PARTIR DE:', boxX + boxWidth / 2, boxY + contentMarginTop, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text(data.VIGENCIA_INICIO?.split('T')[0] || '2011-11-18', boxX + boxWidth / 2, boxY + contentMarginTop + 10, { align: 'center' });

    // Second section (Publication)
    doc.setFont('helvetica', 'bold');
    doc.text('PUBLICACIÓN:', boxX + boxWidth / 2, boxY + boxHeight / 2 + contentMarginTop, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text(data.FECHA_PUBLICACION?.split('T')[0] || '2011-11-18', boxX + boxWidth / 2, boxY + boxHeight / 2 + contentMarginTop + 10, { align: 'center' });
  }



  // 'left'
  drawSignatureSection(doc: jsPDF, data: CursoPdfData): void {
    let y = 550;
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginRight = 40;
    const posX = pageWidth - marginRight;

    const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
      const tempDoc = new jsPDF();
      tempDoc.setFontSize(fontSize);
      return tempDoc.splitTextToSize(text, maxWidth);
    };

    const drawSignature = (title: string, nombre: string, cargo: string) => {
      const maxWidth = 120;
      const fontSize = 9;

      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'bold');
      doc.text(title, posX, y, { align: 'right' });
      y += 10;

      doc.setFont('helvetica', 'normal');
      if (nombre) {
        doc.text(nombre, posX, y, { align: 'right' });
        y += 10;
      }

      if (cargo) {
        const lines = wrapText(cargo, maxWidth, fontSize);
        lines.forEach(line => {
          doc.text(line, posX, y, { align: 'right' });
          y += 8;
        });
      } else {
        doc.text('No disponible', posX, y, { align: 'right' });
        y += 10;
      }

      y += 18;
    };


    drawSignature(
      'Elaborado por:',
      data.firmas.ELABORADO_POR.nombre,
      data.firmas.ELABORADO_POR.cargo
    );

    drawSignature(
      'Revisado por:',
      data.firmas.REVISADO_POR.nombre,
      data.firmas.REVISADO_POR.cargo
    );

    drawSignature(
      'Autorizado por:',
      data.firmas.AUTORIZADO_POR.nombre,
      data.firmas.AUTORIZADO_POR.cargo
    );
  }

  // drawSignatureSectionRegular(doc: jsPDF, data: CursoPdfData): void {
  //   let y = 400; // 🔼 Subido un poco más (antes 550)
  //   const marginLeft = 71; // Posicionado a la izquierda
  //   const posX = marginLeft;

  //   const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
  //     const tempDoc = new jsPDF();
  //     tempDoc.setFontSize(fontSize);
  //     return tempDoc.splitTextToSize(text, maxWidth);
  //   };

  //   const drawSignature = (title: string, nombre: string, cargo: string) => {
  //     const maxWidth = 120;
  //     const fontSize = 9;

  //     doc.setFontSize(fontSize);
  //     doc.setFont('helvetica', 'bold');
  //     doc.text(title, posX, y, { align: 'left' });
  //     y += 10;

  //     doc.setFont('helvetica', 'normal');
  //     if (nombre) {
  //       doc.text(nombre, posX, y, { align: 'left' });
  //       y += 10;
  //     }

  //     if (cargo) {
  //       const lines = wrapText(cargo, maxWidth, fontSize);
  //       lines.forEach(line => {
  //         doc.text(line, posX, y, { align: 'left' });
  //         y += 8;
  //       });
  //     } else {
  //       doc.text('No disponible', posX, y, { align: 'left' });
  //       y += 10;
  //     }

  //     y += 18;
  //   };

  //   drawSignature(
  //     'Elaborado por:',
  //     data.firmas.ELABORADO_POR.nombre,
  //     data.firmas.ELABORADO_POR.cargo
  //   );

  //   drawSignature(
  //     'Revisado por:',
  //     data.firmas.REVISADO_POR.nombre,
  //     data.firmas.REVISADO_POR.cargo
  //   );

  //   drawSignature(
  //     'Autorizado por:',
  //     data.firmas.AUTORIZADO_POR.nombre,
  //     data.firmas.AUTORIZADO_POR.cargo
  //   );
  // }
  drawSignatureSectionRegular(doc: jsPDF, data: CursoPdfData): void {
    let y = 400;
    let marginLeft = 71; // Valor por defecto

    if (data.TIPO_CURSO_ID === 5) {
      marginLeft = 130;
      y = 280;
    }

    const posX = marginLeft;

    const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
      const tempDoc = new jsPDF();
      tempDoc.setFontSize(fontSize);
      return tempDoc.splitTextToSize(text, maxWidth);
    };

    const drawSignature = (title: string, nombre: string, cargo: string) => {
      const maxWidth = 120;
      const fontSize = 9;

      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'bold');
      doc.text(title, posX, y, { align: 'left' });
      y += 10;

      doc.setFont('helvetica', 'normal');
      if (nombre) {
        doc.text(nombre, posX, y, { align: 'left' });
        y += 10;
      }

      if (cargo) {
        const lines = wrapText(cargo, maxWidth, fontSize);
        lines.forEach(line => {
          doc.text(line, posX, y, { align: 'left' });
          y += 8;
        });
      } else {
        doc.text('No disponible', posX, y, { align: 'left' });
        y += 10;
      }

      y += 18;
    };

    drawSignature(
      'Elaborado por:',
      data.firmas.ELABORADO_POR?.nombre ?? '',
      data.firmas.ELABORADO_POR?.cargo ?? ''
    );

    drawSignature(
      'Revisado por:',
      data.firmas.REVISADO_POR?.nombre ?? '',
      data.firmas.REVISADO_POR?.cargo ?? ''
    );

    drawSignature(
      'Autorizado por:',
      data.firmas.AUTORIZADO_POR?.nombre ?? '',
      data.firmas.AUTORIZADO_POR?.cargo ?? ''
    );
  }



/**
 * Genera la ficha técnica SEP en un documento PDF
 * @param doc Instancia de jsPDF
 * @param data Datos del curso
 * @param img Imagen de fondo para las páginas
 */
 FichaTecnicaSEP(doc: jsPDF, data: CursoPdfData, img: HTMLImageElement): void {
  // Configuraciones iniciales
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = {
    left: 50,
    right: 40,
    top: 50,
    bottom: 40
  };
  const usableWidth = pageWidth - margin.left - margin.right;
  const lineHeight = 7;
  const sectionSpacing = 15;
  const paragraphSpacing = 10;
  
  // Establecer fuente por defecto
  doc.setFont('helvetica');
  doc.setTextColor(0, 0, 0); // Color negro

  /**
   * Escribe un título centrado
   * @param title Texto del título
   * @param y Posición vertical inicial
   * @returns Nueva posición vertical
   */
  const writeTitle = (title: string, y: number): number => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(title.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    return y + sectionSpacing;
  };

  /**
   * Escribe un párrafo normal
   * @param text Texto del párrafo
   * @param y Posición vertical inicial
   * @param options Opciones adicionales
   * @returns Nueva posición vertical
   */
  const writeParagraph = (
    text: string, 
    y: number, 
    options: { indent?: number; align?: 'left' | 'center' | 'right' | 'justify' } = {}
  ): number => {
    const { indent = 0, align = 'left' } = options;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    const lines = doc.splitTextToSize(text, usableWidth - indent);
    doc.text(lines, margin.left + indent, y, { align });
    
    return y + (lines.length * lineHeight) + paragraphSpacing;
  };

  /**
   * Escribe una lista con viñetas
   * @param items Elementos de la lista
   * @param y Posición vertical inicial
   * @param options Opciones adicionales
   * @returns Nueva posición vertical
   */
  const writeBullets = (
    items: string[], 
    y: number,
    options: { bulletChar?: string; indent?: number } = {}
  ): number => {
    const { bulletChar = '•', indent = 15 } = options;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    items.forEach((item) => {
      // Agregar viñeta al inicio
      const bulletText = `${bulletChar} ${item}`;
      const lines = doc.splitTextToSize(bulletText, usableWidth - indent);
      
      lines.forEach((line: string | string[], idx: number) => {
        const bulletPos = idx === 0 ? margin.left : margin.left + indent;
        doc.text(line, bulletPos, y);
        y += lineHeight;
      });
      
      y += 2; // Espacio extra entre elementos
    });
    
    return y;
  };

  /**
   * Escribe un párrafo con formato especial (ejemplo en negritas)
   * @param text Texto del párrafo
   * @param y Posición vertical inicial
   * @returns Nueva posición vertical
   */
  const writeFormattedParagraph = (text: string, y: number): number => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    // Procesar texto para formato especial
    const paragraphs = text.split('\n\n');
    
    paragraphs.forEach(paragraph => {
      const lines = doc.splitTextToSize(paragraph, usableWidth);
      
      lines.forEach((line: string) => {
        // Dividir la línea en partes para formato especial
        const parts = line.split(/(\*ejemplo\*)/gi);
        let x = margin.left;
        
        parts.forEach(part => {
          if (part.toLowerCase() === '*ejemplo*') {
            doc.setFont('helvetica', 'bold');
            doc.text(part.replace(/\*/g, ''), x, y);
            x += doc.getTextWidth(part.replace(/\*/g, ''));
            doc.setFont('helvetica', 'normal');
          } else {
            doc.text(part, x, y);
            x += doc.getTextWidth(part);
          }
        });
        
        y += lineHeight;
      });
      
      y += paragraphSpacing;
    });
    
    return y;
  };

  /**
   * Añade una nueva página con fondo
   * @param y Posición vertical inicial (opcional)
   * @returns Posición vertical inicial
   */
  const addPageWithBackground = (initialY?: number): number => {
    doc.addPage();
    doc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);
    return initialY || margin.top;
  };

  // --- Generación del contenido ---

  // Página 2: Justificación, Presentación y Objetivo
  let y = addPageWithBackground(120);
  
  y = writeTitle('Justificación', y);
  y = writeFormattedParagraph(
    `Existen elementos fundamentales para el correcto funcionamiento en una organización, uno que resulta imprescindible, es la comunicación 
asertiva, considerada como una herramienta clave, para que los empleados sean capaces de expresar ideas y opiniones de manera clara y respetuosa, 
creando un ambiente propicio para la colaboración e innovación.

La comunicación asertiva permite la evolución constante de las personas, la sociedad y las organizaciones. El identificar la importancia de la 
comunicación asertiva, abre las oportunidades para que un administrador pueda acercarse de manera segura y efectiva a su capital humano, 
potencializando las fortalezas de cada uno, empoderándolo en los procesos administrativos y asegurando que la identidad corporativa se enfoca hacia 
el logro de los objetivos y el éxito.`, y);

  y = writeTitle('Presentación', y);
  y = writeFormattedParagraph(
    `El programa "Comunicación asertiva en la organización", surge como respuesta a la necesidad de fortalecer las habilidades comunicativas del personal...`, y);

  y = writeTitle('Objetivo General del Curso', y);
  y = writeFormattedParagraph(
    `Al finalizar el curso, los participantes tendrán los conocimientos necesarios para aplicar herramientas de comunicación efectiva en su entorno laboral.`, y);

  // Página 3: Requisitos, Acreditación y Reconocimiento
  y = addPageWithBackground();
  
  y = writeTitle('Requisitos de Admisión', y);
  y = writeParagraph(
    `La persona que desee ingresar al curso de Comunicación Asertiva deberá contar con escolaridad mínima de nivel medio superior.`, 
    y + 5
  );
  
  y = writeTitle('Acreditación', y);
  y = writeParagraph(
    `Para la acreditación de este curso, el alumno deberá asistir al 90% de las sesiones y entregar las actividades asignadas.`, 
    y + 5
  );
  
  y = writeTitle('Reconocimiento al Alumno', y);
  y = writeParagraph(
    `Al concluir y aprobar el curso, la persona egresada recibirá un reconocimiento oficial expedido por el ICATHI.`, 
    y + 5
  );

  // Página 4: Metodología
  y = addPageWithBackground();
  
  y = writeTitle('Metodología de Capacitación', y);
  y = writeParagraph(
    `El proceso de capacitación del ICATHI deberá considerar un enfoque práctico, centrado en el desarrollo de competencias y basado en aprendizaje significativo.`, 
    y + 5
  );

  const bullets = [
    "El proceso de enseñanza y aprendizaje deberá realizarse aplicando 80 % práctico y 20 % teórico.",
    "El Docente/Instructor deberá actuar como facilitador del aprendizaje y adaptarse a los distintos estilos de los participantes.",
    "El Docente/Instructor será responsable de atender los procesos de evaluación diagnóstica, formativa y sumativa.",
    "Es responsabilidad del Docente/Instructor establecer las acciones correctivas necesarias durante el desarrollo del curso.",
    "El Docente/Instructor deberá cumplir con la normatividad institucional vigente."
  ];
  
  y = writeBullets(bullets, y, { bulletChar: 'A)', indent: 10 });
}
  // FichaTecnicaSEP(doc: jsPDF, data: CursoPdfData,img: HTMLImageElement): void {
  //    doc.addImage(img, 'PNG', 0, 0, 792, 612);
  //   doc.setFont('helvetica', 'bold');

  // }


  FichaTecnica(doc: jsPDF, data: CursoPdfData): void {
    const ficha = data.FICHA_TECNICA;
    const etiquetas = ficha?.ETIQUETAS || [];
    doc.addPage();
    doc.setFont('helvetica', 'normal');

    const rows: any[] = [
      ['OBJETIVO DEL CURSO', ficha.OBJETIVO],
      ['PERFIL DE INGRESO', ficha.PERFIL_INGRESO],
      ['PERFIL DE EGRESO', ficha.PERFIL_EGRESO],
      ['PERFIL DEL INSTRUCTOR / DOCENTE', ficha.PERFIL_DEL_DOCENTE],
      ['METODOLOGÍA DE CAPACITACIÓN', ficha.METODOLOGIA],
      ...etiquetas.map((e: any) => [e.NOMBRE.toUpperCase(), e.DATO])
    ];

    autoTable(doc, {
      startY: 30,
      body: rows,
      theme: 'grid',
      styles: {
        fontSize: 10,
        font: 'helvetica',
        cellPadding: 5,

        valign: 'top',
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.8,
        overflow: 'linebreak'
      },
      didParseCell: (data) => {
        if (data.row.index === 7 && data.column.index === 0) {
          data.cell.styles.fontSize = 6;
        }
      },
      columnStyles: {
        0: {
          fontStyle: 'bold',
          fillColor: [180, 180, 180],
          halign: 'center',
          valign: 'middle',
        },
        1: {
          fontStyle: 'normal',
          halign: 'left',
          valign: 'top',
          cellWidth: 460,
        }
      },
      margin: { top: 30, left: 30, right: 30 },


    });
  }

  FichaTecnicaTipoRegular(doc: jsPDF, data: CursoPdfData): void {
    const ficha = data.FICHA_TECNICA;
    const marginLeft = 50;
    const marginRight = 50;
    const maxWidth = doc.internal.pageSize.getWidth() - marginLeft - marginRight;

    // Constantes optimizadas
    const LINE_HEIGHT = 14;
    const SECTION_SPACING = 20;
    const TITLE_MARGIN_BOTTOM = 12;
    const PARAGRAPH_LINE_SPACING = 8;
    const HEADER_LOGO_SIZE = { width: 100, height: 50 };
    const HEADER_TITLE_MARGIN_BOTTOM = 15;
    const BULLET_POINT_INDENT = 15;
    const TEXT_INDENT = 25;
    const COLON_SPACING = 14;
    const BOX_PADDING = 15;
    const BOX_RADIUS = 8;
    const BULLET_SPACING = 5;
    const LONG_TEXT_INDENT = 10;
    const MIN_BOX_HEIGHT = 40; // Altura mínima del recuadro

    const LOGO_URL = 'https://res.cloudinary.com/da8iqyp0e/image/upload/v1753208164/Imagen2_emcpzp.jpg';

    const drawLogo = (x: number, y: number, width = 80, height = 40) => {
      doc.addImage(LOGO_URL, 'JPEG', x, y, width, height);
    };

    const drawEncabezado = (isFirstPage: boolean = false) => {
      drawLogo(marginLeft, 20, HEADER_LOGO_SIZE.width, HEADER_LOGO_SIZE.height);

      if (!isFirstPage) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text('FICHA TÉCNICA DE CURSO REGULAR', doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
      }

      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.5);
      return 65 + HEADER_TITLE_MARGIN_BOTTOM + 10;
    };

    const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
      doc.setDrawColor(0, 0, 0);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, y, width, height, radius, radius, 'FD');
    };

    const calculateContentHeight = (content: string, isBoxed: boolean): number => {
      const availableWidth = isBoxed ? maxWidth - 2 * BOX_PADDING : maxWidth - TEXT_INDENT;
      let totalHeight = 0;
      const lines = content.split('\n');

      lines.forEach(line => {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('-')) {
          const bulletText = trimmedLine.substring(1);
          const textLines = doc.splitTextToSize(bulletText, availableWidth - BULLET_POINT_INDENT);
          totalHeight += (textLines.length * LINE_HEIGHT) + BULLET_SPACING;
        }
        else if (trimmedLine.endsWith(':')) {
          totalHeight += LINE_HEIGHT + COLON_SPACING;
        }
        else if (trimmedLine) {
          const textLines = doc.splitTextToSize(trimmedLine, availableWidth);
          totalHeight += (textLines.length * LINE_HEIGHT) + PARAGRAPH_LINE_SPACING;
        }
        else {
          totalHeight += LINE_HEIGHT;
        }
      });

      return Math.max(totalHeight, MIN_BOX_HEIGHT);
    };

    const drawBulletItem = (text: string, x: number, y: number, availableWidth: number): number => {
      const bulletText = text.substring(1).trim();
      const lines = doc.splitTextToSize(bulletText, availableWidth - BULLET_POINT_INDENT);

      doc.setFont('helvetica', 'bold');
      doc.text('•', x, y + 2);

      lines.forEach((line: string | string[], index: number) => {
        const lineY = y + (index * LINE_HEIGHT);
        doc.text(line, x + BULLET_POINT_INDENT, lineY, {
          maxWidth: availableWidth - BULLET_POINT_INDENT,
          lineHeightFactor: 1.8
        });

        if (index > 0) {
          doc.text('→', x + LONG_TEXT_INDENT, lineY + 2);
        }
      });

      doc.setFont('helvetica', 'normal');
      return lines.length;
    };

    const drawSection = (title: string, content: string, yStart: number): number => {
      let y = yStart;

      // Encabezado de sección
      const sectionHeaderHeight = 42;
      const sectionImageHeight = 24;
      const sectionImageWidth = doc.internal.pageSize.getWidth() - marginLeft - marginRight;

      // Fondo de sección
      const gradientImageBase64 = 'https://res.cloudinary.com/da8iqyp0e/image/upload/v1753227103/finalgrad_xoy34s.png';
      doc.addImage(gradientImageBase64, 'PNG', marginLeft, y, sectionImageWidth, sectionImageHeight);

      // Título
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(0, 0, 0);
      doc.text(title, marginLeft + 5, y + 12);

      y += sectionHeaderHeight;

      // Configuración común de texto
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(25, 25, 25);
      doc.setLineHeightFactor(1.8);

      // Determinar si la sección va en recuadro
      const boxedSections = ['OBJETIVO DEL CURSO', 'PERFIL DE EGRESO'];
      const isBoxed = boxedSections.includes(title);

      // Calcular altura del contenido para el recuadro
      let contentHeight = 0;
      if (isBoxed) {
        contentHeight = calculateContentHeight(content, true);
        drawRoundedRect(marginLeft, y, maxWidth, contentHeight + 2 * BOX_PADDING, BOX_RADIUS);
      }

      let currentY = isBoxed ? y + BOX_PADDING : y;
      const availableWidth = isBoxed ? maxWidth - 2 * BOX_PADDING : maxWidth - TEXT_INDENT;
      const startX = isBoxed ? marginLeft + BOX_PADDING : marginLeft + TEXT_INDENT;

      // Procesar cada línea del contenido
      content.split('\n').forEach(line => {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('-')) {
          const linesCount = drawBulletItem(trimmedLine, startX, currentY, availableWidth);
          currentY += (linesCount * LINE_HEIGHT) + BULLET_SPACING;
        }
        else if (trimmedLine.endsWith(':')) {
          doc.setFont('helvetica', 'bold');
          doc.text(trimmedLine, startX, currentY);
          currentY += LINE_HEIGHT + COLON_SPACING;
          doc.setFont('helvetica', 'normal');
        }
        else if (trimmedLine) {
          const lines = doc.splitTextToSize(trimmedLine, availableWidth);
          lines.forEach((lineText: string | string[], i: number) => {
            doc.text(lineText, startX, currentY + (i * LINE_HEIGHT), {
              maxWidth: availableWidth,
              lineHeightFactor: 1.8
            });
          });
          currentY += (lines.length * LINE_HEIGHT) + PARAGRAPH_LINE_SPACING;
        }
        else {
          currentY += LINE_HEIGHT;
        }
      });

      return isBoxed
        ? y + contentHeight + 2 * BOX_PADDING + SECTION_SPACING
        : currentY + SECTION_SPACING;
    };

    // === Generación del documento ===
    doc.addPage('l');
    let y = drawEncabezado(true) + 20;
    y = drawSection('PRESENTACIÓN', data.presentacion, y);
    y = drawSection('OBJETIVO DE LA ESPECIALIDAD', data.objetivo_especialidad, y);

    doc.addPage('l');
    y = drawEncabezado() + 20;
    y = drawSection('OBJETIVO DEL CURSO', ficha.OBJETIVO, y);


    // === Título "DEL ALUMNO" centrado con líneas decorativas ===
    const alumnoTitle = 'DEL ALUMNO';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Verde oscuro

    const centerX = doc.internal.pageSize.getWidth() / 2;
    doc.text(alumnoTitle, centerX, y, { align: 'center' });

    // Medir el ancho del texto
    const textWidth = doc.getTextWidth(alumnoTitle);

    // Líneas debajo del texto
    const lineY = y + 4;
    const lineGap = 4;

    // Línea gris oscuro debajo del texto
    doc.setDrawColor(90, 90, 90);
    doc.setLineWidth(0.7);
    doc.line(centerX - textWidth / 2, lineY, centerX + textWidth / 2, lineY);

    // Segunda línea más abajo
    doc.line(centerX - textWidth / 2, lineY + lineGap, centerX + textWidth / 2, lineY + lineGap);

    // Incrementar Y para evitar solapamientos
    y += 20;

    y = drawSection('PERFIL DE INGRESO', ficha.PERFIL_INGRESO, y);

    doc.addPage('l');
    y = drawEncabezado() + 20;
    drawSection('PERFIL DE EGRESO', ficha.PERFIL_EGRESO, y);

    doc.addPage('l');
    y = drawEncabezado() + 20;
    y = drawSection('APLICACIÓN LABORAL', data.aplicacion_laboral, y);
    // Buscar los datos de acreditación dentro de las etiquetas
    const etiquetaAcreditacion = ficha.ETIQUETAS.find(e => e.NOMBRE === 'CRITERIOS DE ACREDITACIÓN');
    const textoAcreditacion = etiquetaAcreditacion?.DATO || 'Información no disponible';

    y = drawSection('CRITERIOS DE ACREDITACIÓN', textoAcreditacion, y);
    const etiquetaRECONOCIMIENTO = ficha.ETIQUETAS.find(e => e.NOMBRE === 'RECONOCIMIENTO A LA PERSONA EGRESADA');
    const textoRECONOCIMIENTO = etiquetaRECONOCIMIENTO?.DATO || 'Información no disponible';

    y = drawSection('RECONOCIMIENTO', textoRECONOCIMIENTO, y);



    //***[[[[[]]]]]
    doc.addPage('l');
    y = drawEncabezado() + 20;
    const docenteTitle = 'DEL DOCENTE ';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Verde oscuro

    const _centerX = doc.internal.pageSize.getWidth() / 2;
    doc.text(docenteTitle, _centerX, y, { align: 'center' });

    // Medir el ancho del texto
    const _textWidth = doc.getTextWidth(docenteTitle);

    // Líneas debajo del texto
    const _lineY = y + 4;
    const _lineGap = 4;

    // Línea gris oscuro debajo del texto
    doc.setDrawColor(90, 90, 90);
    doc.setLineWidth(0.7);
    doc.line(_centerX - _textWidth / 2, _lineY, _centerX + _textWidth / 2, _lineY);

    // Segunda línea más abajo
    doc.line(_centerX - _textWidth / 2, _lineY + _lineGap, _centerX + _textWidth / 2, _lineY + _lineGap);

    // Incrementar Y para evitar solapamientos
    y += 20;

    y = drawSection('PERFIL', ficha.PERFIL_DEL_DOCENTE, y);

    doc.addPage('l');
    y = drawEncabezado() + 20;

    const drawSectionWithIncisos = (title: string, content: string, yStart: number): number => {
      let y = yStart;

      // Encabezado de sección
      const sectionHeaderHeight = 42;
      const sectionImageHeight = 24;
      const sectionImageWidth = doc.internal.pageSize.getWidth() - marginLeft - marginRight;

      // Fondo de sección
      const gradientImageBase64 = 'https://res.cloudinary.com/da8iqyp0e/image/upload/v1753227103/finalgrad_xoy34s.png';
      doc.addImage(gradientImageBase64, 'PNG', marginLeft, y, sectionImageWidth, sectionImageHeight);

      // Título
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(0, 0, 0);
      doc.text(title, marginLeft + 5, y + 12);

      y += sectionHeaderHeight;

      // Configuración común de texto
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(25, 25, 25);
      doc.setLineHeightFactor(1.5);

      // Procesar el contenido
      const lines = content.split('\n');
      let currentY = y;
      const availableWidth = maxWidth - TEXT_INDENT;
      const startX = marginLeft + TEXT_INDENT;

      // Variables para control de incisos
      let isIncisoSection = false;
      const incisoPattern = /^([A-Za-z]\))\s+(.*)/;

      for (const line of lines) {
        const trimmedLine = line.trim();

        if (!trimmedLine) {
          currentY += LINE_HEIGHT / 2; // Espacio entre párrafos
          continue;
        }

        // Detectar si es un inciso (A), B), etc.)
        const incisoMatch = trimmedLine.match(incisoPattern);

        if (incisoMatch) {
          isIncisoSection = true;
          const [_, inciso, text] = incisoMatch;

          // Dibujar el inciso en negrita
          doc.setFont('helvetica', 'bold');
          doc.text(inciso, startX, currentY);

          // Calcular posición del texto después del inciso
          const incisoWidth = doc.getTextWidth(inciso);
          const textStartX = startX + incisoWidth + 5;
          const textAvailableWidth = availableWidth - incisoWidth - 5;

          // Dibujar el texto del inciso
          doc.setFont('helvetica', 'normal');
          const textLines = doc.splitTextToSize(text, textAvailableWidth);

          // Primera línea
          doc.text(textLines[0], textStartX, currentY);

          // Líneas siguientes con sangría
          if (textLines.length > 1) {
            for (let i = 1; i < textLines.length; i++) {
              currentY += LINE_HEIGHT;
              doc.text(textLines[i], textStartX + 10, currentY);
            }
          }

          currentY += LINE_HEIGHT + (textLines.length > 1 ? 0 : PARAGRAPH_LINE_SPACING);
        }
        else if (isIncisoSection && (trimmedLine.startsWith(' ') || trimmedLine.startsWith('\t'))) {
          // Texto con sangría adicional para continuaciones dentro de un inciso
          const textLines = doc.splitTextToSize(trimmedLine.trim(), availableWidth - 20);
          for (const lineText of textLines) {
            currentY += LINE_HEIGHT;
            doc.text(lineText, startX + 20, currentY);
          }
          currentY += PARAGRAPH_LINE_SPACING;
        }
        else {
          isIncisoSection = false;
          // Texto normal sin formato de inciso
          const textLines = doc.splitTextToSize(trimmedLine, availableWidth);
          doc.text(textLines, startX, currentY);
          currentY += (textLines.length * LINE_HEIGHT) + PARAGRAPH_LINE_SPACING;
        }
      }

      return currentY + SECTION_SPACING;
    };
    // y = drawSection('METODOLOGÍA DE CAPACITACIÓN', ficha.METODOLOGIA, y);
    y = drawSectionWithIncisos('METODOLOGÍA DE CAPACITACIÓN', ficha.METODOLOGIA, y);







    // BIBLIOGRAFÍA
    const drawBibliographySection = (title: string, content: string, yStart: number): number => {
      let y = yStart;

      // Section header configuration
      const sectionHeaderHeight = 42;
      const sectionImageHeight = 24;
      const sectionImageWidth = doc.internal.pageSize.getWidth() - marginLeft - marginRight;

      // Section background
      const gradientImageBase64 = 'https://res.cloudinary.com/da8iqyp0e/image/upload/v1753227103/finalgrad_xoy34s.png';
      doc.addImage(gradientImageBase64, 'PNG', marginLeft, y, sectionImageWidth, sectionImageHeight);

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(0, 0, 0);
      doc.text(title, marginLeft + 5, y + 12);

      y += sectionHeaderHeight;

      // Common text configuration
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(25, 25, 25);
      doc.setLineHeightFactor(1.5);

      // Process content
      const entries = content.split('\n').filter(entry => entry.trim() !== '');
      let currentY = y;
      const availableWidth = maxWidth - TEXT_INDENT;
      const startX = marginLeft + TEXT_INDENT;
      const marginTop = 50; // Define top margin for new page
      const marginBottom = 50; // Define bottom margin for page break

      // Regular expressions for different entry types
      const bookPattern = /^([^0-9(]+)\s*(\((\d{4})\))?\s*(.*)/;
      const urlPattern = /(https?:\/\/[^\s]+)/;
      const extensionPattern = /chrome-extension:\/\/[^\s]+/;

      for (const entry of entries) {
        const trimmedEntry = entry.trim();

        // Skip empty lines unless they're intentional spacing
        if (!trimmedEntry) {
          currentY += LINE_HEIGHT / 2;
          continue;
        }

        // Check for bullet point
        const isBullet = trimmedEntry.startsWith('o ');
        const entryText = isBullet ? trimmedEntry.substring(2) : trimmedEntry;

        // Check if we need a page break before adding new content
        if (currentY > doc.internal.pageSize.height - marginBottom) {
          doc.addPage();
          currentY = marginTop;
        }

        // Draw bullet if needed
        if (isBullet) {
          doc.setFont('helvetica', 'bold');
          doc.text('•', startX, currentY + 2);
          doc.setFont('helvetica', 'normal');
        }

        // Text starting position (with indentation if bulleted)
        const textStartX = isBullet ? startX + 8 : startX;

        // Process different entry types
        if (urlPattern.test(entryText) || extensionPattern.test(entryText)) {
          // Formatting for URLs/web references
          const parts = entryText.split(urlPattern);

          let accumulatedY = currentY;
          let linePositionX = textStartX;

          for (const part of parts) {
            if (!part) continue;

            if (urlPattern.test(part)) {
              // URL in blue and underlined
              doc.setTextColor(0, 0, 255);

              // Check if URL fits on current line
              const urlWidth = doc.getTextWidth(part);
              if (linePositionX + urlWidth > marginLeft + maxWidth) {
                accumulatedY += LINE_HEIGHT;
                linePositionX = textStartX;
              }

              doc.textWithLink(part, linePositionX, accumulatedY, { url: part });
              linePositionX += urlWidth;
              doc.setTextColor(25, 25, 25);
            } else {
              // Normal text
              const remainingWidth = marginLeft + maxWidth - linePositionX;
              const lines = doc.splitTextToSize(part, remainingWidth);

              // First line uses current position
              doc.text(lines[0], linePositionX, accumulatedY);

              // Subsequent lines start from beginning
              if (lines.length > 1) {
                for (let i = 1; i < lines.length; i++) {
                  accumulatedY += LINE_HEIGHT;
                  doc.text(lines[i], textStartX, accumulatedY);
                }
                linePositionX = textStartX + doc.getTextWidth(lines[lines.length - 1]);
              } else {
                linePositionX += doc.getTextWidth(lines[0]);
              }
            }
          }
          currentY = accumulatedY + LINE_HEIGHT;
        } else {
          // Traditional bibliography formatting
          const bookMatch = entryText.match(bookPattern);

          if (bookMatch) {
            const [_, authors, , year, titleAndPublisher] = bookMatch;
            const authorsText = authors.trim();

            // Calculate widths
            const authorsWidth = doc.getTextWidth(authorsText);
            const yearText = year ? ` ${year} ` : '';
            const yearWidth = doc.getTextWidth(yearText);

            // Check if the first part fits on the line
            if (textStartX + authorsWidth + yearWidth > marginLeft + maxWidth) {
              // Doesn't fit - wrap
              const authorsLines = doc.splitTextToSize(authorsText, availableWidth);

              // First line of authors
              doc.setFont('helvetica', 'bold');
              doc.text(authorsLines[0], textStartX, currentY);

              // Subsequent lines
              if (authorsLines.length > 1) {
                for (let i = 1; i < authorsLines.length; i++) {
                  currentY += LINE_HEIGHT;
                  doc.text(authorsLines[i], textStartX, currentY);
                }
              }

              // Year on next line if needed
              if (year) {
                currentY += LINE_HEIGHT;
                doc.setFont('helvetica', 'normal');
                doc.text(yearText, textStartX, currentY);
              }

              // Title and publisher
              const titleLines = doc.splitTextToSize(titleAndPublisher, availableWidth);
              currentY += LINE_HEIGHT;
              doc.text(titleLines, textStartX, currentY);

              if (titleLines.length > 1) {
                currentY += (titleLines.length - 1) * LINE_HEIGHT;
              }
            } else {
              // Fits on one line
              doc.setFont('helvetica', 'bold');
              doc.text(authorsText, textStartX, currentY);

              if (year) {
                doc.setFont('helvetica', 'normal');
                doc.text(yearText, textStartX + authorsWidth, currentY);
              }

              // Title and publisher
              const remainingWidth = availableWidth - authorsWidth - yearWidth;
              const titleLines = doc.splitTextToSize(titleAndPublisher, remainingWidth);

              // First line continues from current position
              doc.text(titleLines[0], textStartX + authorsWidth + yearWidth, currentY);

              // Subsequent lines start from beginning
              if (titleLines.length > 1) {
                for (let i = 1; i < titleLines.length; i++) {
                  currentY += LINE_HEIGHT;
                  doc.text(titleLines[i], textStartX, currentY);
                }
              }
            }
          } else {
            // Unrecognized format - normal text
            const lines = doc.splitTextToSize(entryText, availableWidth);
            doc.text(lines[0], textStartX, currentY);

            if (lines.length > 1) {
              for (let i = 1; i < lines.length; i++) {
                currentY += LINE_HEIGHT;
                doc.text(lines[i], textStartX, currentY);
              }
            }
          }

          currentY += LINE_HEIGHT;
        }

        // Additional space between entries
        currentY += PARAGRAPH_LINE_SPACING;
      }

      return currentY + SECTION_SPACING;
    };

    doc.addPage('l');
    y = drawEncabezado() + 20;
    const etiquetaBibliografia = ficha.ETIQUETAS.find(e => e.NOMBRE === 'BIBLIOGRAFÍA');
    const textoBibliografia = etiquetaBibliografia?.DATO || 'Información no disponible';
    y = drawBibliographySection('BIBLIOGRAFÍA / WEBGRAFÍA', textoBibliografia, y);
    doc.addPage('l');
    y = drawEncabezado() + 20;

    y = drawSection('DIRECTORIO', data.directorio, y);

  }



  FichaTecnicaVirtual(doc: jsPDF, data: CursoPdfData): void {
    const ficha = data.FICHA_TECNICA;
    const etiquetas = (ficha?.ETIQUETAS || []).filter((e: any) => e.NOMBRE.toUpperCase() !== 'BIBLIOGRAFÍA');

    // const etiquetas = ficha?.ETIQUETAS || [];
    doc.addPage();
    doc.setFont('helvetica', 'normal');
    console.log("ficha", ficha)
    const rows: any[] = [
      ['OBJETIVO DEL CURSO', ficha.OBJETIVO],
      ['PERFIL DE INGRESO', ficha.PERFIL_INGRESO],
      ['PERFIL DE EGRESO', ficha.PERFIL_EGRESO],
      ['PERFIL DEL INSTRUCTOR / DOCENTE', ficha.PERFIL_DEL_DOCENTE],
      ['METODOLOGÍA DE CAPACITACIÓN', ficha.METODOLOGIA],
      ...etiquetas.map((e: any) => [e.NOMBRE.toUpperCase(), e.DATO])
    ];

    autoTable(doc, {
      startY: 30,
      body: rows,
      theme: 'grid',
      styles: {
        fontSize: 10,
        font: 'helvetica',
        cellPadding: 5,

        valign: 'top',
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.8,
        overflow: 'linebreak'
      },
      didParseCell: (data) => {
        if (data.row.index === 6 && data.column.index === 0) {
          data.cell.styles.fontSize = 8;
        }
      },
      columnStyles: {
        0: {
          fontStyle: 'bold',
          fillColor: [180, 180, 180],
          halign: 'center',
          valign: 'middle',
        },
        1: {
          fontStyle: 'normal',
          halign: 'left',
          valign: 'top',
          cellWidth: 460,
        }
      },
      margin: { top: 30, left: 30, right: 30 },


    });
  }

  // /**
  //  * Función reutilizable para dibujar el encabezado en documentos PDF
  //  * @param doc Instancia de jsPDF
  //  * @param title Título a mostrar en el encabezado
  //  * @param options Opciones de configuración del encabezado
  //  */
  //  drawEncabezado(
  //   doc: jsPDF,
  //   title: string,
  //   options?: {
  //     logoUrl?: string;
  //     logoSize?: { width: number; height: number };
  //     logoPosition?: { x: number; y: number };
  //     titleFontSize?: number;
  //     showLine?: boolean;
  //     lineColor?: [number, number, number];
  //     lineWidth?: number;
  //   }
  // ): void {
  //   // Configuración por defecto
  //   const config = {
  //     logoUrl: 'https://res.cloudinary.com/da8iqyp0e/image/upload/v1753208164/Imagen2_emcpzp.jpg',
  //     logoSize: { width: 100, height: 50 },
  //     logoPosition: { x: 55, y: 20 },
  //     titleFontSize: 16,
  //     showLine: true,
  //     lineColor: [100, 100, 100] as [number, number, number],
  //     lineWidth: 0.5,
  //     ...options
  //   };

  //   // Dibujar logo
  //   if (config.logoUrl) {
  //     doc.addImage(
  //       config.logoUrl,
  //       'JPEG',
  //       config.logoPosition.x,
  //       config.logoPosition.y,
  //       config.logoSize.width,
  //       config.logoSize.height
  //     );
  //   }

  //   // Dibujar título
  //   doc.setFont('helvetica', 'bold');
  //   doc.setFontSize(config.titleFontSize);
  //   doc.setTextColor(40, 40, 40);
  //   doc.text(title, doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });

  //   // Dibujar línea separadora
  //   if (config.showLine) {
  //     doc.setDrawColor(...config.lineColor);
  //     doc.setLineWidth(config.lineWidth);
  //     // doc.line(
  //     //   config.logoPosition.x,
  //     //   65,
  //     //   doc.internal.pageSize.getWidth() - config.logoPosition.x,
  //     //   65
  //     // );
  //   }
  // }



  agregarContenidoProgramaticoTipoRegular(doc: jsPDF, data: CursoPdfData): void {
    const contenidoProgramatico = data.CONTENIDOPROGRAMATICO;
    const LOGO_URL = 'https://res.cloudinary.com/da8iqyp0e/image/upload/v1753208164/Imagen2_emcpzp.jpg';
    const HEADER_LOGO_SIZE = { width: 100, height: 50 };
    const margin = 15;

    // Función para dibujar el encabezado en cada página
    const drawHeader = (isFirstPage: boolean = false) => {
      // Dibujar logo
      doc.addImage(LOGO_URL, 'JPEG', 55, 20, HEADER_LOGO_SIZE.width, HEADER_LOGO_SIZE.height);

      // Título del contenido programático (siempre visible)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text('CONTENIDO PROGRAMÁTICO', doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });


    };

    // Crear nueva página y dibujar encabezado
    doc.addPage();
    drawHeader(true);

    if (!contenidoProgramatico || contenidoProgramatico.length === 0) {
      doc.setFont('helvetica', 'normal');
      doc.text('No se ha definido contenido programático para este curso.', margin, 80);
      return;
    }

    const encabezados = [
      ['NO. Y NOMBRE DEL TEMA', 'TIEMPO (HRS)', 'COMPETENCIAS A DESARROLLAR',
        'INSTRUMENTOS DE EVALUACIÓN', 'ACTIVIDADES DE ENSEÑANZA-APRENDIZAJE']
    ];

    const body = contenidoProgramatico.map((tema: any) => [
      (tema.tema_nombre || '').replace(/\n/g, '\n'),
      tema.tiempo ? tema.tiempo.toString() : '0',
      (tema.competencias || '').replace(/\n/g, '\n'),
      (tema.evaluacion || '').replace(/\n/g, '\n'),
      (tema.actividades || '')
    ]);


    const totalHoras = contenidoProgramatico
      .reduce((total: number, tema: any) => total + (parseInt(tema.tiempo) || 0), 0)
      .toString();


    body.push(['Evaluacion', '2', '', '', '']);
    body.push(['Total horas', totalHoras, '', '', '']);

    const pageWidth = doc.internal.pageSize.getWidth();
    const availableWidth = pageWidth - margin * 2;

    autoTable(doc, {
      startY: 75, // Posición inicial después del encabezado
      head: encabezados,
      body,
      theme: 'grid',
      showHead: 'everyPage',
      rowPageBreak: 'avoid',
      styles: {
        fontSize: 10,
        font: 'helvetica',
        cellPadding: 3,
        valign: 'top',
        overflow: 'linebreak',
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      },
      headStyles: {
        halign: 'center',
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: availableWidth * 0.25 },
        1: { cellWidth: availableWidth * 0.10, halign: 'center' },
        2: { cellWidth: availableWidth * 0.20 },
        3: { cellWidth: availableWidth * 0.20 },
        4: { cellWidth: availableWidth * 0.25 }
      },
      margin: { top: 80, left: margin, right: margin },
      tableWidth: 'auto',
      didDrawPage: function (data) {
        // Dibujar encabezado en cada página nueva que se genere
        if (data.pageNumber > 1) {
          drawHeader();
        }
      },
      didDrawCell: (data) => {
        // Aplicar estilo bold a las filas de totales
        if (data.row.index === body.length - 1 || data.row.index === body.length - 2) {
          doc.setFont('helvetica', 'bold');
        }
      }
    });
  }
  agregarContenidoProgramatico(doc: jsPDF, data: CursoPdfData): void {
    const contenidoProgramatico = data.CONTENIDOPROGRAMATICO;

    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('CONTENIDO PROGRAMÁTICO', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    if (!contenidoProgramatico || contenidoProgramatico.length === 0) {
      doc.setFont('helvetica', 'normal');
      doc.text('No se ha definido contenido programático para este curso.', 15, 40);
      return;
    }
    const encabezados = data.TIPO_CURSO_ID === 2
      ? [
        ['NO. Y NOMBRE DEL TEMA', 'TIEMPO (HRS)', 'CRITERIOS DE EVALUACIÓN', 'EVIDENCIAS', 'ACTIVIDADES DE ENSEÑANZA-APRENDIZAJE']
      ]
      : [
        ['NO. Y NOMBRE DEL TEMA', 'TIEMPO (HRS)', 'COMPETENCIAS A DESARROLLAR', 'INSTRUMENTOS DE EVALUACIÓN', 'ACTIVIDADES DE ENSEÑANZA-APRENDIZAJE']
      ];
    const body = contenidoProgramatico.map((tema: any) => [
      (tema.tema_nombre || '').replace(/\n/g, '\n'),
      tema.tiempo ? tema.tiempo.toString() : '0',
      (tema.competencias || '').replace(/\n/g, '\n'),
      (tema.evaluacion || '').replace(/\n/g, '\n'),
      (tema.actividades || '')
    ]);

    const totalHoras = contenidoProgramatico
      .reduce((total: number, tema: any) => total + (parseInt(tema.tiempo) || 0), 0)
      .toString();

    if (data.TIPO_CURSO_ID === 2) {
      body.push(['Total horas', totalHoras, '', '', '']);
    } else {
      body.push(['Evaluacion', '2', '', '', '']);
      body.push(['Total horas', totalHoras, '', '', '']);
    }


    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const availableWidth = pageWidth - margin * 2;

    autoTable(doc, {
      startY: 30,
      head: encabezados,
      body,
      theme: 'grid',
      showHead: 'everyPage', // Mostrar encabezados en cada página
      rowPageBreak: 'avoid', // Evitar dividir filas entre páginas
      styles: {
        fontSize: 10,
        font: 'helvetica',
        cellPadding: 3,
        // minCellHeight: 10, // Altura mínima de celda

        valign: 'top',
        overflow: 'linebreak',
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      },
      headStyles: {
        halign: 'center',
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: availableWidth * 0.25 },
        1: { cellWidth: availableWidth * 0.10, halign: 'center' },
        2: { cellWidth: availableWidth * 0.20 },
        3: { cellWidth: availableWidth * 0.20 },
        4: { cellWidth: availableWidth * 0.25 }
      },
      margin: { top: 50, left: margin, right: margin },
      tableWidth: 'auto',
      didDrawCell: (data) => {
        // Aplicar estilo bold a las filas adicionales
        if (data.row.index === body.length - 1 || data.row.index === body.length - 2) {
          doc.setFont('helvetica', 'bold');
        }
      }
    });
  }






  agregarTablaMateriales(doc: jsPDF, data: CursoPdfData): void {
    const materiales = data.MATERIALES || [];
    if (materiales.length === 0) return;

    doc.addPage();
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('MATERIAL', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

    autoTable(doc, {
      startY: 50,
      head: [
        [
          { content: 'DESCRIPCIÓN', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
          { content: 'UNIDAD DE MEDIDA', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
          { content: 'CANTIDAD POR NÚMERO DE LAS Y/O LOS ALUMNOS', colSpan: 3, styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
        ],
        [
          { content: '10', styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
          { content: '15', styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
          { content: '20', styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } }
        ]
      ]
      ,

      body: materiales.map((m: any) => [
        m.material_descripcion,
        m.material_unidad_de_medida,
        m.material_cantidad_10 !== undefined ? String(m.material_cantidad_10) : '',
        m.material_cantidad_15 !== undefined ? String(m.material_cantidad_15) : '',
        m.material_cantidad_20 !== undefined ? String(m.material_cantidad_20) : ''
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      headStyles: {
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fillColor: [200, 200, 200],
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.5
      },
      bodyStyles: {
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.5, fontStyle: 'bold'
      },
      columnStyles: {
        0: { halign: 'left' }
      },
      theme: 'grid'
    });
    if (data.TIPO_CURSO_ID == 3) {
      const finalY = (doc as any).lastAutoTable.finalY || 50;
      this.agregarNotasMateriales(doc, data, finalY + 15);
    }


  }

  agregarTablaMaterialesTipoRegular(doc: jsPDF, data: CursoPdfData): void {
    const materiales = data.MATERIALES || [];
    const LOGO_URL = 'https://res.cloudinary.com/da8iqyp0e/image/upload/v1753208164/Imagen2_emcpzp.jpg';
    const HEADER_LOGO_SIZE = { width: 100, height: 50 };
    const margin = 15;

    // Función para dibujar el encabezado
    const drawHeader = () => {
      // Dibujar logo
      doc.addImage(LOGO_URL, 'JPEG', 55, 20, HEADER_LOGO_SIZE.width, HEADER_LOGO_SIZE.height);

      // Título de la sección
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
    };

    // Agregar nueva página y encabezado
    doc.addPage();
    drawHeader();

    // Título de la tabla
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('MATERIAL', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

    // Configuración de la tabla
    autoTable(doc, {
      startY: 75,
      head: [
        [
          {
            content: 'DESCRIPCIÓN',
            rowSpan: 2,
            styles: {
              halign: 'center',
              valign: 'middle',
              fillColor: [200, 200, 200],
              fontStyle: 'bold'
            }
          },
          {
            content: 'UNIDAD DE MEDIDA',
            rowSpan: 2,
            styles: {
              halign: 'center',
              valign: 'middle',
              fillColor: [200, 200, 200],
              fontStyle: 'bold'
            }
          },
          {
            content: 'CANTIDAD POR NÚMERO DE ALUMNOS',
            colSpan: 3,
            styles: {
              halign: 'center',
              valign: 'middle',
              fillColor: [200, 200, 200],
              fontStyle: 'bold'
            }
          },
        ],
        [
          {
            content: '10',
            styles: {
              halign: 'center',
              valign: 'middle',
              fillColor: [200, 200, 200],
              fontStyle: 'bold'
            }
          },
          {
            content: '15',
            styles: {
              halign: 'center',
              valign: 'middle',
              fillColor: [200, 200, 200],
              fontStyle: 'bold'
            }
          },
          {
            content: '20',
            styles: {
              halign: 'center',
              valign: 'middle',
              fillColor: [200, 200, 200],
              fontStyle: 'bold'
            }
          }
        ]
      ],
      body: materiales.map((m: any) => [
        m.material_descripcion || '',
        m.material_unidad_de_medida || '',
        m.material_cantidad_10 !== undefined ? String(m.material_cantidad_10) : '',
        m.material_cantidad_15 !== undefined ? String(m.material_cantidad_15) : '',
        m.material_cantidad_20 !== undefined ? String(m.material_cantidad_20) : ''
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      headStyles: {
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fillColor: [200, 200, 200],
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.5
      },
      bodyStyles: {
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.5,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { halign: 'left' }
      },
      theme: 'grid'
    });

    // Agregar notas si es tipo de curso 3
    if (data.TIPO_CURSO_ID == 3) {
      const finalY = (doc as any).lastAutoTable.finalY || 50;
      this.agregarNotasMateriales(doc, data, finalY + 15);
    }
  }
  agregarNotasMateriales(doc: jsPDF, data: CursoPdfData, startY: number): void {
    const notaMateriales = data.NOTA_MATERIALES || data.NOTA_MATERIALES;
    if (!notaMateriales) return;

    // Asegurarse de que el texto tenga el formato correcto
    const textoFormateado = notaMateriales.startsWith('*') ? notaMateriales : `*${notaMateriales}`;

    // Dividir en líneas
    const lineas = textoFormateado.split('\n');

    // Configuración de estilo
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    // Ajustes de posición:
    const margenIzquierdo = 25; // Aumentado a 25 para mayor margen izquierdo (más a la derecha)
    const espacioEntreLineas = 8; // Aumentado a 8 para más espacio entre líneas

    // Dibujar cada línea con sangría adicional si empieza con asterisco
    lineas.forEach((linea, index) => {
      const posicionX = linea.startsWith('*') ? margenIzquierdo : margenIzquierdo + 5;
      doc.text(linea, posicionX, startY + (index * espacioEntreLineas));
    });
  }



  agregarTablaEquipamiento(doc: jsPDF, data: CursoPdfData): void {
    const equipos = data.EQUIPAMIENTO || [];
    if (equipos.length === 0) return;

    doc.addPage();
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EQUIPAMIENTO', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

    autoTable(doc, {
      startY: 50,
      head: [
        [
          { content: 'DESCRIPCIÓN', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
          { content: 'UNIDAD DE MEDIDA', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
          { content: 'CANTIDAD POR NÚMERO DE LAS Y/O LOS ALUMNOS', colSpan: 3, styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
        ],
        [
          { content: '10', styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
          { content: '15', styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
          { content: '20', styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } }
        ]
      ],
      body: equipos.map((e: any) => {
        // Función para extraer el valor numérico aunque venga como objeto
        const getCantidad = (obj: any): string => {
          if (typeof obj === 'number') return obj.toString();
          if (typeof obj === 'string') return obj;
          if (obj && obj.value !== undefined) return obj.value.toString();
          return '';
        };

        return [
          e.equipamiento_descripcion,
          e.equipamiento_unidad_de_medida,
          getCantidad(e.equipamiento_cantidad_10),
          getCantidad(e.equipamiento_cantidad_15),
          getCantidad(e.equipamiento_cantidad_20)
        ];
      }),
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [0, 0, 0],  // Bordes negros
        lineWidth: 0.5,        // Grosor del borde
      },
      headStyles: {
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fillColor: [200, 200, 200],
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.5
      },
      bodyStyles: {
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.5, fontStyle: 'bold'
      },
      columnStyles: {
        0: { halign: 'left' } // Descripción alineada a la izquierda
      },
      theme: 'grid'
    });
  }



  agregarTablaEquipamientoTipoRegular(doc: jsPDF, data: CursoPdfData): void {
    const equipos = data.EQUIPAMIENTO || [];
    if (equipos.length === 0) return;
    const LOGO_URL = 'https://res.cloudinary.com/da8iqyp0e/image/upload/v1753208164/Imagen2_emcpzp.jpg';
    const HEADER_LOGO_SIZE = { width: 100, height: 50 };
    const margin = 15;

    // Función para dibujar el encabezado
    const drawHeader = () => {
      // Dibujar logo
      doc.addImage(LOGO_URL, 'JPEG', 55, 20, HEADER_LOGO_SIZE.width, HEADER_LOGO_SIZE.height);

      // Título de la sección
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
    };

    // Agregar nueva página y encabezado
    doc.addPage();
    drawHeader();
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EQUIPAMIENTO', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

    autoTable(doc, {
      startY: 75,
      head: [
        [
          { content: 'DESCRIPCIÓN', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
          { content: 'UNIDAD DE MEDIDA', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
          { content: 'CANTIDAD POR NÚMERO DE LAS Y/O LOS ALUMNOS', colSpan: 3, styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
        ],
        [
          { content: '10', styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
          { content: '15', styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } },
          { content: '20', styles: { halign: 'center', valign: 'middle', fillColor: [200, 200, 200], fontStyle: 'bold' } }
        ]
      ],
      body: equipos.map((e: any) => {
        // Función para extraer el valor numérico aunque venga como objeto
        const getCantidad = (obj: any): string => {
          if (typeof obj === 'number') return obj.toString();
          if (typeof obj === 'string') return obj;
          if (obj && obj.value !== undefined) return obj.value.toString();
          return '';
        };

        return [
          e.equipamiento_descripcion,
          e.equipamiento_unidad_de_medida,
          getCantidad(e.equipamiento_cantidad_10),
          getCantidad(e.equipamiento_cantidad_15),
          getCantidad(e.equipamiento_cantidad_20)
        ];
      }),
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [0, 0, 0],  // Bordes negros
        lineWidth: 0.5,        // Grosor del borde
      },
      headStyles: {
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fillColor: [200, 200, 200],
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.5
      },
      bodyStyles: {
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.5, fontStyle: 'bold'
      },
      columnStyles: {
        0: { halign: 'left' } // Descripción alineada a la izquierda
      },
      theme: 'grid'
    });
  }







  formatDate(fechaIso: string): string {
    const date = new Date(fechaIso);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }





  drawFooter(doc: jsPDF, data: CursoPdfData): void {
    console.log("data", data);
    const pageNumber = doc.getCurrentPageInfo().pageNumber;
    const totalPages = doc.getNumberOfPages();
    if (pageNumber <= 1) return;

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const footerY = pageHeight - 40;

    const marginX = 20;
    const tableWidth = pageWidth - marginX * 2;
    const topCellHeight = 12;
    const bottomCellHeight = 24; // 🔹 Más alto para contener el nuevo espaciado
    // const bottomCellHeight = 28; // 🔹 Más alto para contener el nuevo espaciado

    const colWidths = [
      tableWidth * 0.34,
      tableWidth * 0.19,
      tableWidth * 0.12,
      tableWidth * 0.23,
      tableWidth * 0.12
    ];
    const fields = [
      {
        title: 'Revisó y Aprobó:',
        value: data.reviso_aprobo_texto || 'Coordinación de Gestión de la Calidad'
      },
      {
        title: 'Código:',
        value: data.codigo_formato || 'DA-PP-CAE-01'
      },
      {
        title: 'Versión No:',
        value: data.version_formato?.toString() || '1'
      },
      {
        title: 'Fecha de Emisión:',
        value: data.fecha_emision_formato
          ? this.formatDate(data.fecha_emision_formato)
          : '01/01/2024'
      },
      {
        title: 'Hoja:',
        value: `${pageNumber} de ${totalPages}`
      }
    ];


    // 🔹 Texto superior en negro
    const topText = doc.splitTextToSize(
      'El usuario es responsable de consultar e imprimir la versión vigente de este formato',
      tableWidth - 40
    );
    const topTextY = footerY + (topCellHeight - 4) / 2 + 4;

    doc.setDrawColor(150);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    doc.rect(marginX, footerY, tableWidth, topCellHeight);
    doc.text(topText, pageWidth / 2, topTextY, {
      align: 'center',
      lineHeightFactor: 1.5
    });

    // 🔹 Segunda fila
    const secondRowY = footerY + topCellHeight;
    let currentX = marginX;

    fields.forEach((field, i) => {
      const colWidth = colWidths[i];
      const padding = 3;
      const textWidth = colWidth - 2 * padding;
      const lineHeight = 3;
      const lineGap = 3; // 🔸 espacio entre título y valor
      const lineHeightFactor = 2.0; // 🔸 mayor separación entre líneas

      doc.rect(currentX, secondRowY, colWidth, bottomCellHeight);

      const titleLines = doc.splitTextToSize(field.title, textWidth);
      const valueLines = doc.splitTextToSize(field.value, textWidth);

      const totalHeight =
        titleLines.length * lineHeight * lineHeightFactor +
        valueLines.length * lineHeight * lineHeightFactor +
        lineGap;

      const startY = secondRowY + (bottomCellHeight - totalHeight) / 2 + lineHeight;

      // Título
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text(titleLines, currentX + colWidth / 2, startY, {
        align: 'center',
        lineHeightFactor: lineHeightFactor
      });

      // Valor
      const valueY = startY + titleLines.length * lineHeight * lineHeightFactor + lineGap;
      doc.setFont('helvetica', 'normal');
      doc.text(valueLines, currentX + colWidth / 2, valueY, {
        align: 'center',
        lineHeightFactor: lineHeightFactor
      });

      currentX += colWidth;
    });
  }




  finalize(doc: jsPDF) {
    this.finalizeCallback(doc);
  }
}
