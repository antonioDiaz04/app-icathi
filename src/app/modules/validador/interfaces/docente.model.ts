export interface Docente {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  especialidad: string;
  certificado_profesional: boolean;
  cedula_profesional: string;
  documento_identificacion: string;
  num_documento_identificacion: string;
  curriculum_url: string;
  estatus: boolean;
  created_at: string;
  updated_at: string;
  usuario_validador_id: number;
  fecha_validacion: string;
  foto_url: string;
  validador_nombre: string;
  validador_apellidos: string;
}
