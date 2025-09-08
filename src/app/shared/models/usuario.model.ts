export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string | null;
  username: string;
  password_hash: string;
  rol: string;
  estatus: boolean;
  created_at: string;
  updated_at: string;
}
