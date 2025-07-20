import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocenteDataService {
  docenteData = signal<any>(null); // debe ser una señal, NO un valor plano

  constructor() { }
}
