import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';
import { DocenteService } from '../../../../shared/services/docente.service';
// import { AuthService } from '../services/auth.service';
// import { DocenteService } from '../services/docente.service';

export class DocenteHelper {
  /**
   * Obtiene datos del docente autenticado desde el token y consulta sus cursos.
   * @param authService servicio de autenticación
   * @param docenteService servicio de docente
   * @returns objeto con los datos del docente o null si falla
   */
  static async obtenerDatosDocenteYCursos(
    authService: AuthService,
    docenteService: DocenteService
  ): Promise<any | null> {
    try {
      const userId = await authService.getIdFromToken(); // ID desde el token

      const docenteResponse: any = await firstValueFrom(
        docenteService.getDocenteById(Number(userId))
      );

      const docenteData =
        Array.isArray(docenteResponse) && docenteResponse.length > 0
          ? docenteResponse[0]
          : docenteResponse;

      if (docenteData?.id) {
        console.log('ID del docente:', docenteData.id);
        return docenteData;
      } else {
        console.error("El campo 'id' no está definido en los datos del docente.");
        return null;
      }
    } catch (error) {
      console.error('Error en obtenerDatosDocenteYCursos:', error);
      return null;
    }
  }
}
