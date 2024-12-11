import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Usuario } from '../../../../shared/models/usuario.model';
import { ERol } from '../../../../shared/constants/rol.enum';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  filtro: string = '';
  mostrarModal: boolean = false;
  usuarioSeleccionado: any = null;
  roles: string[] = Object.values(ERol); // Obtén los roles del enum
  rolSeleccionado: string = '';

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.userService.listarUsuarios().subscribe(
      (data: any) => {
        console.log('Usuarios API response:', data);
        // Asignar los usuarios filtrados (excluyendo el rol deseado)
        if (data && data.usuarios) {
          const rolesExcluidos = ['ALUMNO', 'DOCENTE', 'PLANTEL', 'VALIDA_PLANTEL', 'ADMIN_FINANZAS', 'VALIDA_ALUMNO', 'CONTROL_ESCOLAR']; // Agrega los roles que deseas excluir
          this.usuarios = data.usuarios.filter((usuario: any) => !rolesExcluidos.includes(usuario.rol));
                } else {
          console.error('No se encontraron usuarios en la respuesta del API');
        }
        this.cdr.detectChanges(); // Forzar detección de cambios
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  usuariosFiltrados(): any[] {
    return this.usuarios.filter((usuario) =>
      usuario.nombre?.toLowerCase().includes(this.filtro.toLowerCase()) ||
      usuario.rol?.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  filtroPorRol: string = '';  // Variable para almacenar el rol seleccionado

  // Función para filtrar usuarios por rol
  filtrarPorRol(rol: string): void {
    this.filtro = rol;  // Asigna el rol como filtro
  }
  abrirModal(usuario: any): void {
    this.usuarioSeleccionado = usuario;
    this.rolSeleccionado = usuario.rol;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.usuarioSeleccionado = null;
    this.rolSeleccionado = '';
  }
  asignarRol(): void {
    if (!this.usuarioSeleccionado || !this.rolSeleccionado) {
      alert('Selecciona un usuario y un rol.');
      return;
    }

    console.log('Datos a enviar:', {
      id: this.usuarioSeleccionado.id,
      rol: this.rolSeleccionado,
    });

    this.userService.cambiarRol(this.usuarioSeleccionado.id, this.rolSeleccionado)
      .subscribe({
        next: (response) => {
          alert('Rol actualizado exitosamente');
          this.mostrarModal = false;
          this.cargarUsuarios();
        },
        error: (error) => {
          console.error('Error al cambiar rol:', error);
          alert('Error al actualizar el rol.');
        },
      });
  }
    // Función para contar usuarios por rol
    contarUsuariosPorRol(): { [key: string]: number } {
      const conteo: { [key: string]: number } = {}; // Especificamos el tipo
      this.usuarios.forEach((usuario) => {
        conteo[usuario.rol] = (conteo[usuario.rol] || 0) + 1;
      });
      return conteo;
    }

    // Método para obtener las claves de un objeto (roles)
    objectKeys(obj: { [key: string]: any }): string[] {
      return Object.keys(obj);
    }
  abrirModalNuevoUsuario(): void {
    // Lógica para añadir usuario (por ejemplo, abrir otro modal o redirigir a un formulario)
  }
  // getRoleClass(rol: string) {
  //   switch (rol) {
  //     case 'ADMIN':
  //       return 'bg-blue-200 hover:bg-blue-300'; // Azul pastel
  //     case 'VALIDA_ALUMNO':
  //       return 'bg-green-200 hover:bg-green-300'; // Verde pastel
  //     case 'VALIDA_CURSO':
  //       return 'bg-yellow-200 hover:bg-yellow-300'; // Amarillo pastel
  //     case 'VALIDA_PLANTEL':
  //       return 'bg-purple-200 hover:bg-purple-300'; // Morado pastel
  //     case 'VALIDA_DOCENTE':
  //       return 'bg-indigo-200 hover:bg-indigo-300'; // Indigo pastel
  //     case 'CONTROL_ESCOLAR':
  //       return 'bg-teal-200 hover:bg-teal-300'; // Verde azulado pastel
  //     case 'COORDINADOR_ACADEMICO':
  //       return 'bg-orange-200 hover:bg-orange-300'; // Naranja pastel
  //     case 'ADMIN_FINANZAS':
  //       return 'bg-red-200 hover:bg-red-300'; // Rojo pastel
  //     default:
  //       return 'bg-gray-200 hover:bg-gray-300'; // Gris pastel
  //   }
  // }
  getRoleClass(rol: string): string {
    const hiddenRoles = ['VALIDA_ALUMNO', 'ADMIN_FINANZAS', 'VALIDA_PLANTEL', 'CONTROL_ESCOLAR']; // Roles que deseas ocultar
    const baseClass = (() => {
      switch (rol) {
        case 'ADMIN':
          return 'bg-blue-200 hover:bg-blue-300'; // Azul pastel
        case 'VALIDA_ALUMNO':
          return 'bg-green-200 hover:bg-green-300'; // Verde pastel
        case 'VALIDA_CURSO':
          return 'bg-yellow-200 hover:bg-yellow-300'; // Amarillo pastel
        case 'VALIDA_PLANTEL':
          return 'bg-purple-200 hover:bg-purple-300'; // Morado pastel
        case 'VALIDA_DOCENTE':
          return 'bg-indigo-200 hover:bg-indigo-300'; // Indigo pastel
        case 'CONTROL_ESCOLAR':
          return 'bg-teal-200 hover:bg-teal-300'; // Verde azulado pastel
        case 'COORDINADOR_ACADEMICO':
          return 'bg-orange-200 hover:bg-orange-300'; // Naranja pastel
        case 'ADMIN_FINANZAS':
          return 'bg-red-200 hover:bg-red-300'; // Rojo pastel
          // case 'DOCENTE':
          //   return 'bg-purple-200 hover:bg-purple-300'; // Morado pastel
        default:
          return 'bg-gray-200 hover:bg-gray-300'; // Gris pastel
      }
    })();

    // Si el rol está en la lista de roles ocultos, concatena la clase 'hidden'
    return hiddenRoles.includes(rol) ? `${baseClass} hidden` : baseClass;
  }

  abrirFormularioAltaUsuario() {
    // Aquí abres el formulario de alta usuario
    console.log("Abrir formulario para dar alta usuario");
    // Puedes redirigir a otro componente o abrir un modal con el formulario
  }


}
