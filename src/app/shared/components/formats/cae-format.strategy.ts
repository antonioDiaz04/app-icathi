import jsPDF from 'jspdf';
import { PdfFormatStrategy } from '../../interfaces/pdf-format-strategy.interface';
import { PdfHelpers } from '../../helpers/pdf-helpers';
import { CursoPdfData } from '../../types/curso-pdf-data.type';

export class CaeFormatStrategy implements PdfFormatStrategy {
  generate(doc: jsPDF, data: CursoPdfData, helpers: PdfHelpers): void {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = helpers.logoUrl;

    img.onload = () => {
      helpers.drawBackground(doc, img);
      helpers.drawHeaderCAE(doc);
      helpers.drawCourseDetailsCAE(doc, data); // ✅ CORREGIDO

      const totalPages = doc.getNumberOfPages();
      for (let i = 2; i <= totalPages; i++) {
        doc.setPage(i);
        helpers.drawFooter(doc);
      }

      helpers.finalize(doc);
    };
  }
}
