import jsPDF from 'jspdf';
import { CursoPdfData } from '../types/curso-pdf-data.type';
import { PdfHelpers } from '../helpers/pdf-helpers';


export interface PdfFormatStrategy {
  generate(doc: jsPDF, data: CursoPdfData, helpers: PdfHelpers): void;
}
