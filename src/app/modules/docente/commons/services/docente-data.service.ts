import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocenteDataService {
  docenteData: any = null;  // Almacenar los datos del docente

  constructor() { }
}
