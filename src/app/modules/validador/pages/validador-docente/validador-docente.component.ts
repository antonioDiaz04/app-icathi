import { Component } from '@angular/core';

@Component({
  selector: 'app-validador-docente',
  templateUrl: './validador-docente.component.html',
  styleUrl: './validador-docente.component.scss'
})
export class ValidadorDocenteComponent {
  currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

}
