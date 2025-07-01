export interface CursoPdfData {
  Id_Curso: number;
  NOMBRE: string;
  CLAVE: string;
  DURACION_HORAS: number;
  DESCRIPCION: string;
  AREA_ID: number;
  ESPECIALIDAD_ID: number;
  TIPO_CURSO_ID: number;
  TIPO_CURSO: string;
  VIGENCIA_INICIO: string;
  FECHA_PUBLICACION: string;
  FECHA_VALIDACION: string;
  USUARIO_VALIDADOR_ID: string;

  firmas: {
    REVISADO_POR: {
      nombre: string;
      cargo: string;
    };
    AUTORIZADO_POR: {
      nombre: string;
      cargo: string;
    };
    ELABORADO_POR: {
      nombre: string;
      cargo: string;
    };
  };

  CONTENIDOPROGRAMATICO: Array<{
    id: number;
    tema_nombre: string;
    tiempo: number;
    competencias: string;
    evaluacion: string;
    actividades: string;
  }>;

  FICHA_TECNICA: {
    OBJETIVO: string;
    PERFIL_INGRESO: string;
    PERFIL_EGRESO: string;
    PERFIL_DEL_DOCENTE: string;
    METODOLOGIA: string;
    ETIQUETAS: Array<{
      NOMBRE: string;
      VALOR: string;
      DATO: string;
    }>;
  };

  MATERIALES: Array<{
    material_descripcion: string;
    material_unidad_de_medida: string;
    material_cantidad_10: number;
    material_cantidad_15: number;
    material_cantidad_20: number;
  }>;

  EQUIPAMIENTO: Array<{
    equipamiento_descripcion: string;
    equipamiento_unidad_de_medida: string;
    equipamiento_cantidad_10: number;
    equipamiento_cantidad_15: number;
    equipamiento_cantidad_20: number;
  }>;


  AREA_NOMBRE: string;
  ESPECIALIDAD_NOMBRE: string;
}