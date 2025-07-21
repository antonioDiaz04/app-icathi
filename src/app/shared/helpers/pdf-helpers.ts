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
