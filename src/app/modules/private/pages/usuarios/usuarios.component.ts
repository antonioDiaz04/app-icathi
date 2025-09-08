import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Usuario } from '../../../../shared/models/usuario.model';
import { ERol } from '../../../../shared/constants/rol.enum';
import { AlertTaiwilService } from '../../../../shared/services/alert-taiwil.service';

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styleUrls: ['./usuarios.component.scss'],
    standalone: false
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  filtro: string = '';
  mostrarModal: boolean = false;
  usuarioSeleccionado: any = null;
  roles: string[] = [];
  nuevoUsuario: {
    nombre: string;
    apellidos: string;
    email: string;
    username: string;
    password: string;
    rol: string;
  } = {
    nombre: '',
    apellidos: '',
    email: '',
    username: '',
    password: '',
    rol: 'USER'  // Rol por defecto, pero el usuario puede elegir otro
  };
  mostrarPassword: boolean = false;

  // roles: string[] = Object.values(ERol); // Obtén los roles del enum
  rolSeleccionado: string = '';
  mostrarModalEditar = false;
  mostrarModalregistro = false;
  usuarioEditado: any = {};
  constructor(
        private alertTaiwilService: AlertTaiwilService,
    
    private userService: UserService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.roles = Object.values(ERol).filter(rol => !this.rolesExcluidos.includes(rol));

    this.cargarUsuarios();
  }

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  abrirModalEditar(usuario: any) {
    this.usuarioEditado = { ...usuario }; // Copia del usuario seleccionado
    this.mostrarModalEditar = true;
  }
  crearUsuario() {
    // Verificar si los campos están vacíos o son nulos
    if (this.validarCampos()) {
      console.log("Nuevo usuario:", this.nuevoUsuario);
      this.userService.crearUsuario(this.nuevoUsuario).subscribe(
        (response) => {
          this.alertTaiwilService.showTailwindAlert("Usuario creado con éxito", 'success');

          console.log('Usuario creado con éxito:', response);
          this.cargarUsuarios();  // Recargar la lista de usuarios si es necesario
          this.cerrarModalregistro();  // Cerrar el modal después de crear el usuario
        },
        (error) => {
          let errorMessage = 'Ocurrió un error inesperado.';
          
          // Verificar si el error tiene un mensaje específico
          if (error.error && error.error.message) {
            errorMessage = error.error.message; // Captura el mensaje de error devuelto por el backend
          }
      
          // Mostrar el mensaje de error utilizando el servicio de alertas
          this.alertTaiwilService.showTailwindAlert(errorMessage, 'error');
          console.error('Error al crear el usuario:', error);
        }
      );
      
      
      
    } else {
      this.alertTaiwilService.showTailwindAlert(
        'Por favor, completa todos los campos',
        'success'
      );
      // Si los campos no son válidos, mostrar un mensaje de error
      // console.log("Por favor, completa todos los campos.");
    }
  }
  
  // Método de validación de campos
  validarCampos(): boolean {
    // Verifica que todos los campos requeridos no estén vacíos o sean nulos
    if (
      !this.nuevoUsuario.nombre.trim() ||
      !this.nuevoUsuario.apellidos.trim() ||
      !this.nuevoUsuario.email.trim() ||
      !this.nuevoUsuario.username.trim() ||
      !this.nuevoUsuario.password.trim() ||
      !this.nuevoUsuario.rol.trim()
    ) {
      return false;  // Si algún campo es vacío, devuelve false
    }
    return true;  // Si todos los campos son válidos, devuelve true
  }
  
  abrirModalregistro() {
    console.log("Abrir modal para registrar nuevo usuario");
    // this.usuarioEditado = { ...usuario }; // Copia del usuario seleccionado
    this.mostrarModalregistro = true;
  }
  cerrarModalregistro() {
      this.nuevoUsuario = {
          nombre: '',
          apellidos: '',
          email: '',
          username: '',
          password: '',
          rol: 'USER'
        };
    // this.usuarioEditado = { ...usuario }; // Copia del usuario seleccionado
    this.mostrarModalregistro = false;
  }
  
  // Función para cerrar modal de edición
  cerrarModalEditar() {
    this.mostrarModalEditar = false;
    this.usuarioEditado = {};
  }
  
  // Función para guardar cambios
  guardarCambiosUsuario() {
    // Extraemos solo los datos necesarios para la actualización
    const estatus = this.usuarioEditado.estatus;
    const rol = this.usuarioEditado.rol;
  
    // Mostrar los datos que se van a actualizar
    console.log('Datos a actualizar:', { estatus, rol });
  
    // Llamamos al servicio para actualizar el estatus y el rol del usuario
    this.userService.actualizarEstatusRol(this.usuarioEditado.id, estatus, rol).subscribe(
      (response) => {
        // console.log('Usuario actualizado con éxito:', response);
        this.cargarUsuarios()
        this.alertTaiwilService.showTailwindAlert('Usuario actualizado con éxito', 'success');

        // Aquí puedes manejar la respuesta, como mostrar un mensaje de éxito o cerrar el modal
        this.cerrarModalEditar();
      },
      (error) => {
        this.alertTaiwilService.showTailwindAlert('Error al actualizar el usuario', 'error');

        console.error('Error al actualizar el usuario:', error);
        // Aquí puedes manejar el error, por ejemplo, mostrar un mensaje de error
      }
    );
  }
  eliminarUsuario(usuario: any) {
    const confirmacion = confirm(
      `¿Estás seguro de que deseas eliminar al usuario ${usuario.nombre}?`
    );
    if (confirmacion) {
      this.userService.eliminarUsuario(usuario.id).subscribe(
        (response) => {
          this.alertTaiwilService.showTailwindAlert('Usuario eliminado correctamente', 'success');

          // alert('Usuario eliminado correctamente.');
          this.cargarUsuarios(); // Actualiza la lista de usuarios
        },
        (error) => {
          this.alertTaiwilService.showTailwindAlert('Error al eliminar usuario', 'error');

          // console.error('Error al eliminar usuario:', error);
          alert('Ocurrió un error al intentar eliminar el usuario.');
        }
      );
    }
  }
  
  
// Roles que deseas excluir
private readonly rolesExcluidos = [
  'ALUMNO',
  'DOCENTE',
  'PLANTEL',
  'VALIDA_PLANTEL',
  'ADMIN_FINANZAS',
  'VALIDA_ALUMNO',
  'CONTROL_ESCOLAR',
];

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
