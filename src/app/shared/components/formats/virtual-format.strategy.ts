import jsPDF from 'jspdf';
import { PdfFormatStrategy } from '../../interfaces/pdf-format-strategy.interface';
import { PdfHelpers } from '../../helpers/pdf-helpers';
import { CursoPdfData } from '../../types/curso-pdf-data.type';

export class VirtualFormatStrategy implements PdfFormatStrategy {
  generate(doc: jsPDF, data: CursoPdfData, helpers: PdfHelpers): void {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = helpers.logoUrl;

    img.onload = () => {
      helpers.drawBackground(doc, img);
      helpers.drawHeader(doc, data);;
      helpers.drawCourseDetails(doc, data);
      helpers.drawValidityBox(doc, data);
      helpers.drawSignatureSection(doc, data);
      helpers.FichaTecnicaVirtual(doc, data);
      helpers.agregarContenidoProgramatico(doc, data);
      // helpers.agregarTablaMateriales(doc, data);
      const totalPages = doc.getNumberOfPages();
      for (let i = 2; i <= totalPages; i++) {
        doc.setPage(i);
        helpers.drawFooter(doc,data);
      }

      helpers.finalize(doc);
    };
  }
}
