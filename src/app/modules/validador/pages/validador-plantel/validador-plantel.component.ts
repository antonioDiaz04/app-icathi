import { Component } from '@angular/core';

@Component({
  selector: 'app-validador-plantel',
  templateUrl: './validador-plantel.component.html',
  styleUrl: './validador-plantel.component.scss'
})
export class ValidadorPlantelComponent {
  plantelData: any = {};
  validationResult: string = '';

  validate() {
    this.validationResult = 'Validador en proceso...';
    setTimeout(() => {
      this.validationResult = 'Validación exitosa';
    }, 2000);
  }
}
