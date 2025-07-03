import { Injectable } from '@angular/core';
import { PdfFormatStrategy } from '../interfaces/pdf-format-strategy.interface';
import { CaeFormatStrategy } from '../components/formats/cae-format.strategy';
import { VirtualFormatStrategy } from '../components/formats/virtual-format.strategy';
import { EscuelaFormatStrategy } from '../components/formats/escuela-format.strategy';


@Injectable({
  providedIn: 'root'
})
export class PdfFormatService {
  getStrategy(modalidad: number): PdfFormatStrategy {
    switch (modalidad) {
      case 1: // CAE
        return new CaeFormatStrategy();

      case 2: // Virtual
        return new VirtualFormatStrategy();

      case 3: // Escuela
        return new EscuelaFormatStrategy();

      // case 4: // Regular
      //   return new RegularFormatStrategy();

      // case 5: // SEP
      //   return new SepFormatStrategy();

      default:
        throw new Error(`Modalidad no soportada: ${modalidad}`);
    }
  }
}
