
import { ERol } from "../constants/rol.enum";

export const RoleRoutes: Record<ERol, string> = {
  [ERol.ADMIN]: 'privado',
  [ERol.ALUMNO]: 'alumno',
  [ERol.DOCENTE]: 'docente',
  [ERol.CONTROL_ESCOLAR]: 'control',
  [ERol.COORDINADOR_ACADEMICO]: 'academico',
  [ERol.PLANTEL]: 'plantel',
  [ERol.VALIDA_ALUMNO]: 'validador/alumno',
  [ERol.VALIDA_CURSO]: 'validador/curso',
  [ERol.VALIDA_PLANTEL]: 'validador/plantel',
  [ERol.VALIDA_DOCENTE]: 'validador/docente',
};
