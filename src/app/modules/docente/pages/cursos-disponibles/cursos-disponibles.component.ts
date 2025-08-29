import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CursoDetallado, CursosService, TipoCurso } from '../../../../shared/services/cursos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cursos-disponibles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos-disponibles.component.html',
  styleUrls: ['./cursos-disponibles.component.scss']
})
export class CursosDisponiblesComponent implements OnInit {

  // ------- Estado UI (signals) --------
  q = signal<string>('');
  categoriaSeleccionada = signal<string>('Todos');

  // ------- Data --------
  private cursosService = inject(CursosService);
    private router = inject(Router);

  cursos = signal<CursoDetallado[]>([]);
  tiposCurso = signal<TipoCurso[]>([]);
  loading = signal<boolean>(true);
  skeletons = Array.from({ length: 8 }); // número de tarjetas fantasma
  // Opciones del filtro (derivadas de /tiposCurso)
  categorias = computed<string[]>(() => {
    const base = Array.from(new Set(this.tiposCurso().map(t => t.nombre).filter(Boolean)));
    return ['Todos', ...base];
  });

  ngOnInit(): void {
    this.cursosService.getCursosDetallados().subscribe(data => {
      const cursosActivos = (data ?? []).filter(curso => curso.estatus === true);
      this.cursos.set(cursosActivos);
              this.loading.set(false);

    });
    // this.cursosService.getCursosDetallados().subscribe(data => this.cursos.set(data ?? []));
    this.cursosService.getTiposCurso().subscribe(data => this.tiposCurso.set(data ?? []));
  }
  // Filtro compuesto (texto + categoría)
  cursosFiltrados = computed<CursoDetallado[]>(() => {
    const texto = this.q().trim().toLowerCase();
    const cat = this.categoriaSeleccionada();

    return this.cursos().filter(c => {
      const hayTexto =
        !texto ||
        (c.curso_nombre ?? '').toLowerCase().includes(texto) ||
        (c.detalles ?? '').toLowerCase().includes(texto) ||
        (c.area_nombre ?? '').toLowerCase().includes(texto) ||
        (c.especialidad_nombre ?? '').toLowerCase().includes(texto) ||
        (c.tipo_curso_nombre ?? '').toLowerCase().includes(texto) ||
        (c.clave ?? '').toLowerCase().includes(texto);

      const hayCategoria =
        cat === 'Todos' ||
        (c.tipo_curso_nombre ?? '') === cat;

      return hayTexto && hayCategoria;
    });
  });


  solicitarCurso(curso: CursoDetallado) {
    // Navega al formulario con el ID del curso (opcional).
    this.router.navigate(['/docente/cursos-solitud/nueva', curso.id]);
  }
}
