export class Usuario {
  _id?: number;
  nombre: string;
  email: string;
  telefono: string;
  password?: string;

  constructor(
    nombre: string,
    telefono: string,
    email: string,
    password: string
  ) {
    this.nombre = nombre;
    this.telefono = telefono;
    this.email = email;
    this.password = password;
  }
}
