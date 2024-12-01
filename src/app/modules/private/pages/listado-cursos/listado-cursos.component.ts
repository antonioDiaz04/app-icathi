import { Component } from '@angular/core';
 export interface Modulo {
    nombre: string;
    horas: number;
  }
@Component({
  selector: 'app-listado-cursos',
  templateUrl: './listado-cursos.component.html',
  styleUrl: './listado-cursos.component.scss'
})
export class ListadoCursosComponent {



    modulos: Modulo[] = [
    { nombre: "MECANOGRAFÍA", horas: 32 },
    { nombre: "TAQUIGRAFÍA", horas: 24 },
    { nombre: "DOCUMENTOS EN WORD", horas: 28 },
    { nombre: "ELABORACIÓN DE DOCUMENTACIÓN SECRETARIAL", horas: 29 },
    { nombre: "FUNCIONES BÁSICAS DE EXCEL", horas: 29 },
    { nombre: "CREACIÓN DE PRESENTACIONES EN POWER POINT", horas: 22 },
    { nombre: "SISTEMAS DE ARCHIVO", horas: 7 },
    { nombre: "DESARROLLO HUMANO Y VALORES UNIVERSALES", horas: 7 },
  ];

}
