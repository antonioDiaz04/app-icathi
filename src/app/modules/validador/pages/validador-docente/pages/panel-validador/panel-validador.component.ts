import { Component } from '@angular/core';
import { Docente } from '../../../../interfaces/docente.model';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { ValidadorDocenteService } from '../../../../commons/services/validador-docente.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { DocentesComponent } from '../docentes/docentes.component';

@Component({
  selector: 'app-panel-validador',
  // standalone: true,
  // imports: [DocentesComponent],
  templateUrl: './panel-validador.component.html',
  styleUrl: './panel-validador.component.scss'
})
export class PanelValidadorComponent {
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
  

}
