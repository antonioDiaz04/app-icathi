export interface Docente {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  // Se eliminó la propiedad especialidad
  cedula_profesional: string;
  documento_identificacion: string;
  num_documento_identificacion: string;
  curriculum_url: string;
  certificado_profesional: boolean; // Este campo indica si el docente está validado
  estatus_id: number; // ID del estado
  estatus_tipo: string; // Tipo de estado (ej. "DOCENTE")
  estatus_valor: string; // Valor del estado (ej. "Pendiente de validación")
  created_at: string;
  updated_at: string;
  usuario_validador_id: number;
  fecha_validacion: string; // Fecha de validación
  foto_url: string;
  validador_nombre: string;
  validador_apellidos: string;
}
