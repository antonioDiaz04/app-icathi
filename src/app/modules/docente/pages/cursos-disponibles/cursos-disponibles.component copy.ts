// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';

// type Nivel = 'Básico' | 'Intermedio' | 'Avanzado';

// interface Curso {
//   id: number;
//   badge?: string;         // Ej: "ICATHI" | "Modalidad SEP" | "Educación Virtual"
//   categoria: string;      // Ej: "Oficios" | "Gastronomía"
//   titulo: string;
//   descripcion: string;
//   horas: number;
//   nivel: Nivel;
//   cupos: number;
//   inicioISO: string;      // YYYY-MM-DD
//   instructor: string;
// }

// @Component({
//   selector: 'app-cursos-disponibles',
//   standalone: true,
//   imports: [CommonModule,FormsModule],
//   templateUrl: './cursos-disponibles.component.html',
//   styleUrl: './cursos-disponibles.component.scss'
// })
// export class CursosDisponiblesComponent {
// // ------- Estado UI --------
//   q = '';
//   categoriaSeleccionada = 'Todos';

//   // ------- Datos de ejemplo (puedes reemplazar por tu API) -------
//   categorias = ['Todos', 'Oficios', 'Gastronomía', 'Educación Virtual', 'Modalidad SEP'];

//   cursos: Curso[] = [
//     {
//       id: 1,
//       badge: 'ICATHI',
//       categoria: 'Oficios',
//       titulo: 'Plomería Básica',
//       descripcion: 'Fundamentos de instalaciones hidráulicas y sanitarias',
//       horas: 40,
//       nivel: 'Básico',
//       cupos: 25,
//       inicioISO: '2024-02-15',
//       instructor: 'Ing. Carlos Mendoza'
//     },
//     {
//       id: 2,
//       badge: 'Modalidad SEP',
//       categoria: 'Gastronomía',
//       titulo: 'Repostería Avanzada',
//       descripcion: 'Técnicas avanzadas de pastelería y decoración',
//       horas: 60,
//       nivel: 'Avanzado',
//       cupos: 15,
//       inicioISO: '2024-02-20',
//       instructor: 'Chef María González'
//     },
//     {
//       id: 3,
//       badge: 'Educación Virtual',
//       categoria: 'Oficios',
//       titulo: 'Electricidad Residencial',
//       descripcion: 'Instalaciones eléctricas para viviendas',
//       horas: 50,
//       nivel: 'Intermedio',
//       cupos: 30,
//       inicioISO: '2024-02-25',
//       instructor: 'Ing. Roberto Silva'
//     },
//     // duplica para “6 de 6 cursos” si gustas
//     {
//       id: 4,
//       badge: 'ICATHI',
//       categoria: 'Oficios',
//       titulo: 'Carpintería Inicial',
//       descripcion: 'Manejo básico de herramientas y ensamblajes',
//       horas: 36,
//       nivel: 'Básico',
//       cupos: 18,
//       inicioISO: '2024-03-01',
//       instructor: 'Téc. Julián Ortega'
//     },
//     {
//       id: 5,
//       badge: 'Modalidad SEP',
//       categoria: 'Gastronomía',
//       titulo: 'Cocina Mexicana',
//       descripcion: 'Platillos tradicionales y técnicas base',
//       horas: 48,
//       nivel: 'Intermedio',
//       cupos: 20,
//       inicioISO: '2024-03-05',
//       instructor: 'Chef Ana Ruíz'
//     },
//     {
//       id: 6,
//       badge: 'Educación Virtual',
//       categoria: 'Oficios',
//       titulo: 'Pintura y Acabados',
//       descripcion: 'Preparación de superficies y aplicación de recubrimientos',
//       horas: 32,
//       nivel: 'Básico',
//       cupos: 22,
//       inicioISO: '2024-03-10',
//       instructor: 'Arq. Héctor Perea'
//     }
//   ];

//   get cursosFiltrados(): Curso[] {
//     const q = this.q.trim().toLowerCase();
//     return this.cursos.filter(c => {
//       const matchTexto =
//         !q ||
//         c.titulo.toLowerCase().includes(q) ||
//         c.descripcion.toLowerCase().includes(q) ||
//         c.categoria.toLowerCase().includes(q) ||
//         (c.badge ?? '').toLowerCase().includes(q) ||
//         c.instructor.toLowerCase().includes(q);
//       const matchCategoria =
//         this.categoriaSeleccionada === 'Todos' ||
//         c.categoria === this.categoriaSeleccionada ||
//         c.badge === this.categoriaSeleccionada;
//       return matchTexto && matchCategoria;
//     });
//   }

//   solicitarCurso(curso: Curso) {
//     // Aquí integras tu flujo real (router, modal, petición, etc.)
//     alert(`Solicitud enviada para: ${curso.titulo}`);
//   }

//   // util para formatear fecha (formato corto UI)
//   fechaCorta(iso: string) {
//     const d = new Date(iso);
//     return d.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });
//   }
// }
