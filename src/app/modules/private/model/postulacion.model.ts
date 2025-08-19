// src/app/core/models/postulacion.model.ts
export interface Postulacion {
  // Postulación
  postulacion_id: number;
  postulacion_created_at: string;
  postulacion_updated_at?: string;
  created_at: string;
  updated_at?: string;

  // Datos del postulante
  docente_id: number ; // si ya existe registro de docente
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string | null;
  especialidad: string | null;
  curriculum_url: string | null;
  carta_motivacion_url?: string | null;

  // Estatus de postulación/docente
  estatus_id: number;        // (1 Pendiente, 2 Aprobada, 3 Rechazada) — ejemplo
  estatus_tipo: string;      // "POSTULACION" o "DOCENTE"
  estatus_valor: string;     // "Pendiente de validación", etc.

  // Docente (cuando existe)
  docente_created_at?: string;
  docente_updated_at?: string;
  usuario_validador_id?: number | null;
  fecha_validacion?: string | null;
  foto_url?: string | null;
  docente_rol?: string | null; // "DOCENTE"

  // Cuenta/Usuario
  usuario_id?: number | null;
  usuario_username?: string | null;
  usuario_email?: string | null;
  usuario_rol?: string | null; // "PENDIENTE", "DOCENTE", etc.
  usuario_activo?: boolean;    // true/false
  usuario_correo_validado?: boolean; // true/false
  usuario_created_at?: string;
  usuario_password_es_default?: boolean; // true si no ha cambiado
}

export interface PostulacionesResponse {
  ok: boolean;
  data: Postulacion[];
  total: number;
  limit: number;
  offset: number;
}
