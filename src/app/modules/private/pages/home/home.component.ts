import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.prod';
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
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private apiUrl = `${environment.api}`;
  cursos: PlantelCurso[] = [];
  displayedCursos: PlantelCurso[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCursos();
  }

  fetchCursos() {
    this.http.get<PlantelCurso[]>(`${this.apiUrl}/planteles/plantelesycursos`).subscribe({
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
  searchCursos(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value.toLowerCase();
    this.displayedCursos = this.cursos.filter(
      (curso) =>
        curso.curso_nombre.toLowerCase().includes(query) ||
        curso.plantel_nombre.toLowerCase().includes(query)
    );
  }
  
  
}
