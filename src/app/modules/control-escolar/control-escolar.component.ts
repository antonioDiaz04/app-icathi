import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { CommonModule } from '@angular/common';

interface PlantelCurso {
  id: number;
  plantel_id: number;
  plantel_nombre: string;
  curso_id: number;
  curso_nombre: string;
  curso_validado: boolean;
  horario?: string;
  cupo_maximo?: number;
  requisitos_extra?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  estatus?: boolean;
  temario_url?: string;
}

@Component({
  selector: 'app-control-escolar',
  standalone: true, // Hacer el componente standalone
  imports: [CommonModule], // Importar módulos necesarios
  templateUrl: './control-escolar.component.html',
  styleUrls: ['./control-escolar.component.scss'],
})
export class ControlEscolarComponent implements OnInit {
  private apiUrl = `${environment.api}`;
  cursos: PlantelCurso[] = [];
  displayedCursos: PlantelCurso[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCursos();
  }

  fetchCursos() {
    this.http.get<PlantelCurso[]>(`${this.apiUrl}/plantelesCursos/`).subscribe({
      next: (data) => {
        this.cursos = data;
        this.displayedCursos = [...this.cursos];
      },
      error: (error) => {
        console.error('Error al obtener los cursos:', error);
      },
    });
  }

  filterCursos(status: boolean) {
    this.displayedCursos = this.cursos.filter((curso) => curso.estatus === status);
  }

  resetFilter() {
    this.displayedCursos = [...this.cursos];
  }
}
