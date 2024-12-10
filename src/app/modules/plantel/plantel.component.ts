import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plantel',
  templateUrl: './plantel.component.html',
  styleUrl: './plantel.component.scss'
})
export class PlantelComponent {

  constructor(private router: Router) {}  // Inyección del router

  // Método para redirigir
  redirecto(route: string) {
    this.router.navigate(['plantel/',route]);  // Navegar a la ruta proporcionada
  }

  logout(): void {
    const request = indexedDB.open('authDB'); // Nombre de la base de datos

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('tokens', 'readwrite'); // Nombre de la tabla/almacén
      const store = transaction.objectStore('tokens');

      // Eliminar el token
      const deleteRequest = store.delete('authToken'); // Clave del token

      deleteRequest.onsuccess = () => {
        console.log('Token eliminado correctamente.');
        this.router.navigate(['/']); // Redirige al login
      };

      deleteRequest.onerror = (error) => {
        console.error('Error al eliminar el token:', error);
      };
    };

    request.onerror = (error) => {
      console.error('Error al abrir la base de datos:', error);
    };
  }
}
