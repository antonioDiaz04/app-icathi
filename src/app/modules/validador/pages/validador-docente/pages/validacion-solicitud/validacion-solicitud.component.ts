import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Estado = 'Pendiente' | 'En Revisión' | 'Aprobado' | 'Rechazado';
type Prioridad = 'Alta' | 'Media' | 'Baja';

interface Solicitud {
  id: number;
  docente: {
    nombre: string;
    email: string;
    telefono: string;
    cedula: string;
    experiencia: string;
  };
  curso: {
    nombre: string;
    modalidad: string;
    categoria: string;
    duracionHoras: number;
  };
  fecha: string; // ISO
  prioridad: Prioridad;
  estado: Estado;
  justificacion: string;
  comentarios?: string;
}

@Component({
  selector: 'app-validacion-solicitud',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './validacion-solicitud.component.html',
  styleUrl: './validacion-solicitud.component.scss'
})
export class ValidacionSolicitudComponent {
// --- UI ---
  readonly tabs = ['dashboard', 'pendientes', 'revision', 'aprobadas', 'rechazadas'] as const;
  activeTab = signal<(typeof this.tabs)[number]>('dashboard');
  loading = signal(true);

  // --- Datos (signals) ---
  solicitudes = signal<Solicitud[]>([]);

  // Simula carga inicial
  constructor() {
    // Skeleton 1.1s
    setTimeout(() => {
      this.solicitudes.set([
        {
          id: 1,
          docente: {
            nombre: 'María Elena González',
            email: 'maria.gonzalez@icathi.gob.mx',
            telefono: '+52 55 1234 5678',
            cedula: 'CEID123456789',
            experiencia: '8 años',
          },
          curso: {
            nombre: 'Plomería Básica',
            modalidad: 'ICATHI',
            categoria: 'Oficios',
            duracionHoras: 120,
          },
          fecha: '2024-01-15',
          prioridad: 'Alta',
          estado: 'Pendiente',
          justificacion:
            'Necesito impartir este curso para cubrir la demanda en mi región. Tengo experiencia previa en instalaciones hidráulicas.',
        },
        {
          id: 2,
          docente: {
            nombre: 'Carlos Ramírez López',
            email: 'carlos.ramirez@icathi.gob.mx',
            telefono: '+52 55 9876 5432',
            cedula: 'CED0987654321',
            experiencia: '6 años',
          },
          curso: {
            nombre: 'Repostería Avanzada',
            modalidad: 'Regular',
            categoria: 'Gastronomía',
            duracionHoras: 80,
          },
          fecha: '2024-01-14',
          prioridad: 'Media',
          estado: 'En Revisión',
          justificacion:
            'Curso complementario para el programa de gastronomía.',
        },
        {
          id: 3,
          docente: {
            nombre: 'Ana Torres Medina',
            email: 'ana.torres@icathi.gob.mx',
            telefono: '+52 55 2468 1357',
            cedula: 'CED5678901234',
            experiencia: '10 años',
          },
          curso: {
            nombre: 'Electricidad Básica',
            modalidad: 'ICATHI',
            categoria: 'Oficios',
            duracionHoras: 100,
          },
          fecha: '2024-01-12',
          prioridad: 'Baja',
          estado: 'Aprobado',
          justificacion:
            'Fortalecer la oferta de capacitación técnica en el municipio.',
        },
      ]);
      this.loading.set(false);
    }, 1100);
  }

  // --- Derivados (computed) ---
  resumen = computed(() => {
    const arr = this.solicitudes();
    return {
      total: arr.length,
      pendientes: arr.filter(s => s.estado === 'Pendiente').length,
      revision: arr.filter(s => s.estado === 'En Revisión').length,
      aprobadas: arr.filter(s => s.estado === 'Aprobado').length,
      rechazadas: arr.filter(s => s.estado === 'Rechazado').length,
    };
  });

  filtradas = computed(() => {
    const tab = this.activeTab();
    const arr = this.solicitudes();
    if (tab === 'dashboard') return arr;
    if (tab === 'pendientes') return arr.filter(s => s.estado === 'Pendiente');
    if (tab === 'revision') return arr.filter(s => s.estado === 'En Revisión');
    if (tab === 'aprobadas') return arr.filter(s => s.estado === 'Aprobado');
    return arr.filter(s => s.estado === 'Rechazado'); // 'rechazadas'
  });

  // --- Acciones ---
  setTab(tab: (typeof this.tabs)[number]) {
    this.activeTab.set(tab);
    // Puedes re-simular carga por tab si quieres:
    // this.loading.set(true); setTimeout(() => this.loading.set(false), 500);
  }

  cambiarEstado(id: number, estado: Estado) {
    this.solicitudes.update(list =>
      list.map(s => (s.id === id ? { ...s, estado } : s)),
    );
  }

  getIniciales(nombre: string) {
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(n => n[0]?.toUpperCase())
      .join('');
  }

  prioridadClasses(p: Prioridad): string {
    switch (p) {
      case 'Alta':
        return 'bg-red-50 text-red-700 ring-1 ring-red-200';
      case 'Media':
        return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
    }
  }

  estadoClasses(e: Estado): string {
    switch (e) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'En Revisión':
        return 'bg-indigo-100 text-indigo-800';
      case 'Aprobado':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-rose-100 text-rose-800';
    }
  }

  trackById = (_: number, s: Solicitud) => s.id;
}
