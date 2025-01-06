import { Component } from '@angular/core';
export interface Instructor {
  id: number;
  nombre: string;
  certificado: string;
  fechaVencimiento: string;
}

@Component({
    selector: 'app-listado-instructores-cursos',
    templateUrl: './listado-instructores-cursos.component.html',
    styleUrl: './listado-instructores-cursos.component.scss',
    standalone: false
})
export class ListadoInstructoresCursosComponent {


   instructores: Instructor[] = [
    {
      id: 1138,
      nombre: "Juan Pérez",
      certificado: "SECRETARIADO CON COMPUTACIÓN",
      fechaVencimiento: "18/09/2008 12:00:00 a.m.",
    },
    {
      id: 1857,
      nombre: "María López",
      certificado: "SECRETARIADO CON COMPUTACIÓN",
      fechaVencimiento: "09/06/2011 12:00:00 a.m.",
    },
    {
      id: 2186,
      nombre: "Luis Hernández",
      certificado: "SECRETARIADO CON COMPUTACIÓN",
      fechaVencimiento: "07/10/2011 12:00:00 a.m.",
    },
    {
      id: 2194,
      nombre: "Ana Gómez",
      certificado: "SECRETARIADO CON COMPUTACIÓN",
      fechaVencimiento: "31/10/2011 12:00:00 a.m.",
    },
  ];

}
