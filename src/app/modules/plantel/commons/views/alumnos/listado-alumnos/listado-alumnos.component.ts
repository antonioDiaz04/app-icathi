import { Component } from '@angular/core';

@Component({
  selector: 'app-listado-alumnos',
  templateUrl: './listado-alumnos.component.html',
  styles: ``,
  standalone:false,
})
export class ListadoAlumnosComponent {
  textoBusqueda: string = '';
fechaInicio: string = '';
fechaFin: string = '';
pedidoSeleccionado: any = null;

pedidos = [
  { id: '#20132', nombre: 'Brooklyn Zoe', pago: 'Efectivo', tiempoRestante: '1 min', tipo: 'Entrega', estado: 'Completado', monto: '£20.00' },
  { id: '#20133', nombre: 'Alice Krøjvold', pago: 'Pagado', tiempoRestante: '49 min', tipo: 'Recolección', estado: 'Cancelado', monto: '£14.00' },
  { id: '#20134', nombre: 'Jurian van', pago: 'Efectivo', tiempoRestante: '7 min', tipo: 'Entrega', estado: 'Pendiente', monto: '£18.00' },
  { id: '#20135', nombre: 'Yo Chien-Ho', pago: 'Pagado', tiempoRestante: '15 min', tipo: 'Recolección', estado: 'Completado', monto: '£16.00' },
  { id: '#20136', nombre: 'Shoamih Ali', pago: 'Efectivo', tiempoRestante: '10 min', tipo: 'Entrega', estado: 'Cancelado', monto: '£19.00' },
  { id: '#20137', nombre: 'Nick Bove', pago: 'Efectivo', tiempoRestante: '8 min', tipo: 'Recolección', estado: 'Pendiente', monto: '£21.00' },
  { id: '#20138', nombre: 'Unuwo Hinomo', pago: 'Efectivo', tiempoRestante: '5 min', tipo: 'Entrega', estado: 'Pendiente', monto: '£22.00' }
];

// Pedidos filtrados según búsqueda y rango de fechas
filtrarPedidos() {
  return this.pedidos.filter(pedido => {
    const coincideTextoBusqueda = pedido.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase());
    const coincideFechaInicio = this.fechaInicio ? new Date(pedido.tiempoRestante) >= new Date(this.fechaInicio) : true;
    const coincideFechaFin = this.fechaFin ? new Date(pedido.tiempoRestante) <= new Date(this.fechaFin) : true;
    return coincideTextoBusqueda && coincideFechaInicio && coincideFechaFin;
  });
}

abrirMenuAccion(pedido: any) {
  this.pedidoSeleccionado = this.pedidoSeleccionado === pedido ? null : pedido;
}

reembolsar(pedido: any) {
  alert(`Reembolsando pedido #${pedido.id}`);
}

enviarMensaje(pedido: any) {
  alert(`Enviando mensaje a ${pedido.nombre}`);
}
}
