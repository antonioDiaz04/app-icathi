import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(modulos: any[], filtroId: string, filtroNombre: string, filtroNivel: string, filtroDuracion: number | null): any[] {
    if (!modulos) return [];
    if (!filtroId && !filtroNombre && !filtroNivel && filtroDuracion === null) return modulos;

    return modulos.filter(modulo => {
      const matchesId = filtroId ? modulo.id.toString().includes(filtroId) : true;
      const matchesNombre = filtroNombre ? modulo.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) : true;
      const matchesNivel = filtroNivel ? modulo.nivel.toLowerCase().includes(filtroNivel.toLowerCase()) : true;
      const matchesDuracion = filtroDuracion !== null ? modulo.duracion_horas === filtroDuracion : true;
      return matchesId && matchesNombre && matchesNivel && matchesDuracion;
    });
  }
}
