import { signal } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import { CursoPdfData } from '../types/curso-pdf-data.type';

export class PdfHelpers {
  constructor(private finalizeCallback: (doc: jsPDF) => void) { }

  logoUrl = 'https://res.cloudinary.com/dvvhnrvav/image/upload/v1736174056/icathi/tsi14aynpqjer8fthxtz.png';

  drawBackground(doc: jsPDF, img: HTMLImageElement) {
    doc.addImage(img, 'PNG', 0, 0, 612, 792);
  }
  // CAE]
  drawHeaderCAE(doc: jsPDF) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    let y = 140;
    doc.text('PROGRAMA DE ESTUDIO', 210, y);
    y += 18;
    doc.text('CURSO DE CAPACITACIÓN ACELERADA ESPECÍFICA', 135, y);
    y += 18;
    doc.text('"CAE"', 280, y);
  }
  // drawCourseDetailsCAE(doc: jsPDF) {
  drawCourseDetailsCAE(doc: jsPDF, data: CursoPdfData): void {
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

      y += lineHeight + 4;
    };  
  
    renderField('ÁREA OCUPACIONAL', data.AREA_NOMBRE.toUpperCase() || '');
    renderField('ESPECIALIDAD', data.ESPECIALIDAD_NOMBRE.toUpperCase() || '');
    renderField('CURSO', data.NOMBRE.toUpperCase() || '');
    renderField('CLAVE DEL CURSO', data.CLAVE?.toUpperCase() || '');
    renderField('DURACIÓN', `${(data.CONTENIDOPROGRAMATICO || []).reduce((total: number, tema: any) => total + (parseInt(tema.tiempo) || 0), 0)} HORAS`);
  }

  drawFooter(doc: jsPDF) {
    doc.setFontSize(8);
    doc.text('ICATHI - Pie de página', 250, 770);
  }

  finalize(doc: jsPDF) {
    this.finalizeCallback(doc);
  }
}
