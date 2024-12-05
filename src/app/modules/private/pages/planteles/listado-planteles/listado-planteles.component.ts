import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-planteles',
  templateUrl: './listado-planteles.component.html',
  styleUrl: './listado-planteles.component.scss'
})
export class ListadoPlantelesComponent {

  planteles = [
    {
      id: 1,  
      nombre: 'Plantel A',
      direccion: 'Calle 123',
      telefono: '1234567890',
      email: 'plantelA@example.com',
      director: 'Director A',
      capacidad_alumnos: 500,
      estado: 'Activo',
      municipio: 'Municipio 1',
    },
    {
      id: 2,
      nombre: 'Plantel B',
      direccion: 'Avenida 456',
      telefono: '0987654321',
      email: 'plantelB@example.com',
      director: 'Director B',
      capacidad_alumnos: 300,
      estado: 'Activo',
      municipio: 'Municipio 2',
    },
  ];


  constructor(private router: Router) {}

  navigateTo(action: string): void {
    if (action === 'frm-plantel') {
      this.router.navigate(['/privado/',action]); // Redirige a la página de edición
    } else if (action === 'eliminar') {
      this.router.navigate(['/eliminar']); // Redirige a la página de eliminación
    }
  }

}
