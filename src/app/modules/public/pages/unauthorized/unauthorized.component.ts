import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-unauthorized',
    templateUrl: './unauthorized.component.html',
    styleUrls: ['./unauthorized.component.scss'] // Corregido: styleUrl -> styleUrls
    ,
    standalone: false
})
export class UnauthorizedComponent {
  constructor(private location: Location, private router: Router) {}

  goBack() {
    if (window.history.length > 1) {
      this.location.back(); // Navega a la página anterior si hay historial

    } else {
      this.router.navigate(['/']); // Redirige al inicio si no hay historial
    }
  }
}
