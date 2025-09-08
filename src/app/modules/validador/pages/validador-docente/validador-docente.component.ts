import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import { AuthService } from '../../../../shared/services/auth.service';
import { ValidadorDocenteService } from '../../commons/services/validador-docente.service';
import { catchError, throwError } from 'rxjs';
import { Docente } from '../../interfaces/docente.model';

@Component({
    selector: 'app-validador-docente',
    templateUrl: './validador-docente.component.html',
    styleUrls: ['./validador-docente.component.scss'] // Cambiado a styleUrls
    ,
    standalone: false
})
export class ValidadorDocenteComponent {
  currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  docentes: Docente[] = [];
  pendientes = 0;
  validados = 0;
  errores = 0;
  activos: number = 0;
inactivos: number = 0;
suspendidos: number = 0;

  constructor(
    private authService: AuthService,
    private validadorDocenteService: ValidadorDocenteService,
    private router: Router // Inyectar Router
  ) {}

  fetchDocentes(): void {
    this.validadorDocenteService.getAllDocentes()
      .pipe(
        catchError(error => {
      console.error('Fetch error:', error);
          return throwError(error);
        })
      )
      .subscribe(
        (data: Docente[]) => {
          this.docentes = data;
          this.calcularMetricas(); // Recalcula las métricas después de cargar los datos

     },
        (error) => {
          console.error('Error en la suscripción:', error);
        }
      );
  }
  ngOnInit(): void {
    this.fetchDocentes();
  }
  calcularMetricas(): void {
    this.activos = this.docentes.filter(doc => doc.estatus_valor === 'Activo').length;
    this.inactivos = this.docentes.filter(doc => doc.estatus_valor === 'Inactivo').length;
    this.pendientes = this.docentes.filter(doc => doc.estatus_valor === 'Pendiente de validación').length;
    this.suspendidos = this.docentes.filter(doc => doc.estatus_valor === 'Suspendido').length;
  }
  


  async logout(): Promise<void> { // Declarar logout como async
    await this.authService.clearToken();
    // Redirigir al usuario a la página de inicio de sesión
    this.router.navigate(['/public/login']);
  }
}
