import jsPDF from 'jspdf';
import { PdfFormatStrategy } from '../../interfaces/pdf-format-strategy.interface';
import { PdfHelpers } from '../../helpers/pdf-helpers';
import { CursoPdfData } from '../../types/curso-pdf-data.type';

export class SepFormatStrategy implements PdfFormatStrategy {
  generate(doc: jsPDF, data: CursoPdfData, helpers: PdfHelpers): void {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'https://res.cloudinary.com/da8iqyp0e/image/upload/v1753208165/Imagen1_jtme8k.png';
    img.onload = () => {
      helpers.drawBackgroundTipoRegular_SEP(doc, img);
      helpers.drawHeaderTipoRegular_SEP(doc, data);;
      helpers.drawCourseDetailsTipoSEP(doc, data);
      helpers.drawValidityBoxTipoRegular_SEP(doc, data);
      helpers.drawSignatureSectionRegular(doc, data);

      helpers.FichaTecnicaSEP(doc, data,img);
    //   helpers.agregarContenidoProgramatico(doc, data);
    //   helpers.agregarTablaMateriales(doc, data);
    //   helpers.agregarTablaEquipamiento(doc, data);

      const totalPages = doc.getNumberOfPages();
      for (let i = 2; i <= totalPages; i++) {
        doc.setPage(i);
        helpers.drawFooter(doc,data);
      }

      helpers.finalize(doc);
    };
  }
}
