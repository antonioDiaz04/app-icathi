import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type Estado = 'Pendiente' | 'En Revisión' | 'Aprobado' | 'Rechazado';
type Prioridad = 'Prioridad Baja' | 'Prioridad Media' | 'Prioridad Alta';

interface Respuesta {
  mensaje: string;
  evaluador: string;
  fechaISO: string;
}

interface Solicitud {
  id: string;
  curso: string;
  organismo: 'ICATHI' | 'SEP' | 'Educación Virtual' | string;
  prioridad: Prioridad;
  fechaSolicitudISO: string;
  justificacion: string;
  estado: Estado;
  respuesta?: Respuesta;
}
@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-solicitudes.component.html',
  styleUrl: './mis-solicitudes.component.scss'
})
export class MisSolicitudesComponent {
 solicitudes: Solicitud[] = [
    {
      id: 'SOL-00045',
      curso: 'Plomería Básica',
      organismo: 'ICATHI',
      prioridad: 'Prioridad Media',
      fechaSolicitudISO: '2024-01-15',
      justificacion:
        'Necesito actualizar mis conocimientos en plomería para mejorar la calidad de mis clases prácticas y ofrecer técnicas más modernas a mis estudiantes.',
      estado: 'Pendiente',
    },
    {
      id: 'SOL-00044',
      curso: 'Repostería Avanzada',
      organismo: 'SEP',
      prioridad: 'Prioridad Alta',
      fechaSolicitudISO: '2024-01-10',
      justificacion:
        'Este curso me permitirá ampliar el programa de gastronomía con técnicas avanzadas de repostería, beneficiando directamente a 45 estudiantes del programa.',
      estado: 'Aprobado',
      respuesta: {
        mensaje:
          'Solicitud aprobada. El curso complementa perfectamente el perfil del docente.',
        evaluador: 'Dra. María López',
        fechaISO: '2024-01-14',
      },
    },
    {
      id: 'SOL-00043',
      curso: 'Electricidad Residencial',
      organismo: 'ICATHI',
      prioridad: 'Prioridad Baja',
      fechaSolicitudISO: '2024-01-05',
      justificacion:
        'Me interesa actualizar el módulo de instalaciones residenciales con normativa vigente.',
      estado: 'En Revisión',
    },
    {
      id: 'SOL-00042',
      curso: 'Diseño de Material Didáctico Digital',
      organismo: 'Educación Virtual',
      prioridad: 'Prioridad Media',
      fechaSolicitudISO: '2024-01-02',
      justificacion:
        'Busco incorporar recursos interactivos en clases híbridas para mejorar la participación.',
      estado: 'Aprobado',
      respuesta: {
        mensaje:
          'Aprobado. Alineado al plan de actualización docente de este semestre.',
        evaluador: 'Mtro. Luis Ortega',
        fechaISO: '2024-01-06',
      },
    },
    {
      id: 'SOL-00041',
      curso: 'Gestión del Aula y Evaluación',
      organismo: 'SEP',
      prioridad: 'Prioridad Media',
      fechaSolicitudISO: '2023-12-28',
      justificacion:
        'Quiero fortalecer estrategias de evaluación formativa en grupos grandes.',
      estado: 'Rechazado',
      respuesta: {
        mensaje:
          'Rechazada por cupo completo. Se sugiere volver a postular en el siguiente periodo.',
        evaluador: 'Coord. Académica',
        fechaISO: '2024-01-03',
      },
    },
  ];

  // --- Tabs / filtro ---
  filtros: Array<{ key: 'ALL' | Estado; label: string }> = [
    { key: 'ALL', label: 'Todas' },
    { key: 'Pendiente', label: 'Pendientes' },
    { key: 'En Revisión', label: 'En Revisión' },
    { key: 'Aprobado', label: 'Aprobadas' },
    { key: 'Rechazado', label: 'Rechazadas' },
  ];
  activo: 'ALL' | Estado = 'ALL';

  setFiltro(key: 'ALL' | Estado) { this.activo = key; }

  get solicitudesFiltradas(): Solicitud[] {
    return this.activo === 'ALL'
      ? this.solicitudes
      : this.solicitudes.filter(s => s.estado === this.activo);
  }

  count(key: 'ALL' | Estado): number {
    return key === 'ALL'
      ? this.solicitudes.length
      : this.solicitudes.filter(s => s.estado === key).length;
  }

  // --- Utils UI ---
  fechaCorta(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });
    // ej. 2024-01-15 -> 15/01/2024
  }

  badgeEstadoClass(estado: Estado) {
    switch (estado) {
      case 'Pendiente':   return 'bg-amber-100 text-amber-800';
      case 'En Revisión': return 'bg-sky-100 text-sky-800';
      case 'Aprobado':    return 'bg-emerald-100 text-emerald-800';
      case 'Rechazado':   return 'bg-rose-100 text-rose-800';
    }
  }

  badgePrioridadClass(p: Prioridad) {
    switch (p) {
      case 'Prioridad Alta':  return 'bg-rose-100 text-rose-800';
      case 'Prioridad Media': return 'bg-amber-100 text-amber-800';
      case 'Prioridad Baja':  return 'bg-slate-100 text-slate-700';
    }
  }

  nuevaSolicitud() { alert('Acción: crear nueva solicitud'); }
  volver() { alert('Acción: regresar'); }
}
