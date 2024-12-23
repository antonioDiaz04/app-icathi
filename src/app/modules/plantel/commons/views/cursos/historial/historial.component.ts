import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { environment } from '../../../../../../../environments/environment.prod';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styles: ``,
})
export class HistorialComponent {
  idPlantel: any;
  cursos: any;
  isLoading!: boolean;
  constructor(private http: HttpClient, private authh: AuthService) {}

  ngOnInit(): void {
    this.cargarCursosStatus();
  }

  cargarCursosStatus() {
    this.isLoading = true;
    this.authh.getIdFromToken().then((idPlantel) => {
      this.http
        .get<any>(
          `${environment.api}/plantelesCursos/cursosYestatus/${idPlantel}`
        )
        .subscribe((response) => {
          // Filtrar los cursos con estado "Completado"
          this.isLoading = false;
          this.cursos = response.filter(
            (curso: any) => curso.estado === 'Completado'
          );
        });
    });5
  }
}
