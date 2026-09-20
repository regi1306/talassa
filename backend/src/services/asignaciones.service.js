import {
  bloquearOperacionYMuelle,
  ejecutarEnTransaccion,
  insertarAsignacion,
  marcarOperacionConMuelle,
  obtenerAsignacionConfirmadaOperacion,
  obtenerMuelleEvaluado,
  obtenerMuellesEvaluados,
  obtenerOperacionParaEvaluacion,
  obtenerUsuarioActivoPorId,
  registrarAuditoriaAsignacion,
} from "../repositories/asignaciones.repository.js";


function crearError(
  mensaje,
  estadoHttp = 400
) {
  const error =
    new Error(mensaje);

  error.estadoHttp =
    estadoHttp;

  return error;
}


function validarId(
  valor,
  nombre
) {
  const numero =
    Number(valor);

  if (
    !Number.isInteger(numero) ||
    numero <= 0
  ) {
    throw crearError(
      `${nombre} no es válido.`,
      400
    );
  }

  return numero;
}


/* =========================================================
   FORMATEAR HORA
========================================================= */

function formatearHora(
  fecha
) {
  if (!fecha) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "es-SV",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone:
        "America/El_Salvador",
    }
  ).format(
    new Date(fecha)
  );
}


/* =========================================================
   CLASIFICAR RESULTADO
========================================================= */

function prepararResultadoMuelle(
  muelle,
  tipoCarga
) {
  const fisica =
    Boolean(
      muelle.validacion_compatibilidad_fisica
    );

  const carga =
    Boolean(
      muelle.validacion_compatibilidad_carga
    );

  const sinConflicto =
    Boolean(
      muelle.validacion_sin_conflicto_horario
    );

  const estadoOperativo =
    Boolean(
      muelle.validacion_estado_operativo
    );

  const disponibilidad =
    Boolean(
      muelle.validacion_disponibilidad
    );


  const compatible =
    fisica &&
    carga &&
    sinConflicto &&
    estadoOperativo &&
    disponibilidad;


  let tipoResultado =
    "compatible";

  let resultado =
    "Disponible / Compatible";

  let motivo =
    "Cumple todas las validaciones para esta operación.";


  /* =====================================
     ESTADO OPERATIVO
  ===================================== */

  if (!estadoOperativo) {
    tipoResultado =
      "mantenimiento";

    resultado =
      muelle.estado_operativo;

    motivo =
      `El muelle se encuentra en estado ${muelle.estado_operativo}.`;
  }


  /* =====================================
     CONFLICTO
  ===================================== */

  else if (!sinConflicto) {
    tipoResultado =
      "conflicto";

    resultado =
      "Conflicto de horario";


    if (
      muelle.operacion_conflicto
    ) {
      motivo =
        `Ocupado por ${muelle.operacion_conflicto}` +
        `${
          muelle.buque_conflicto
            ? ` / ${muelle.buque_conflicto}`
            : ""
        } entre ` +
        `${formatearHora(
          muelle.inicio_conflicto
        )} y ` +
        `${formatearHora(
          muelle.fin_conflicto
        )}.`;

    } else {
      motivo =
        "Existe una asignación confirmada que se solapa con el horario solicitado.";
    }
  }


  /* =====================================
     COMPATIBILIDAD FÍSICA
  ===================================== */

  else if (!fisica) {
    tipoResultado =
      "restriccion";

    resultado =
      "Restricción física";

    const problemas = [];


    if (
      Number(
        muelle.longitud_maxima
      ) <
      Number(
        muelle.eslora_buque
      )
    ) {
      problemas.push(
        `longitud máxima ${Number(
          muelle.longitud_maxima
        )} m frente a una eslora requerida de ${Number(
          muelle.eslora_buque
        )} m`
      );
    }


    if (
      Number(
        muelle.calado_maximo
      ) <
      Number(
        muelle.calado_buque
      )
    ) {
      problemas.push(
        `calado máximo ${Number(
          muelle.calado_maximo
        )} m frente a un calado requerido de ${Number(
          muelle.calado_buque
        )} m`
      );
    }


    motivo =
      `No cumple la compatibilidad física: ${problemas.join(
        " y "
      )}.`;
  }


  /* =====================================
     TIPO DE CARGA
  ===================================== */

  else if (!carga) {
    tipoResultado =
      "carga";

    resultado =
      "Carga incompatible";

    motivo =
      `El muelle no está habilitado para el tipo de carga ${tipoCarga}.`;
  }


  return {
    id:
      muelle.id_muelle,

    id_muelle:
      muelle.id_muelle,

    codigo:
      muelle.codigo,

    nombre:
      muelle.nombre,

    longitudMaxima:
      Number(
        muelle.longitud_maxima
      ),

    caladoMaximo:
      Number(
        muelle.calado_maximo
      ),

    estadoOperativo:
      muelle.estado_operativo,

    resultado,

    tipoResultado,

    motivo,

    compatible,

    seleccionable:
      compatible,

    validaciones: {
      disponibilidad,

      compatibilidadFisica:
        fisica,

      compatibilidadCarga:
        carga,

      sinConflictoHorario:
        sinConflicto,

      estadoOperativo,
    },
  };
}


/* =========================================================
   EVALUAR MUELLES
========================================================= */

export async function evaluarMuellesOperacion(
  idOperacion
) {
  const id =
    validarId(
      idOperacion,
      "El ID de la operación"
    );


  const operacion =
    await obtenerOperacionParaEvaluacion(
      id
    );


  if (!operacion) {
    throw crearError(
      "La operación no existe.",
      404
    );
  }


  const muelles =
    await obtenerMuellesEvaluados(
      id
    );


  const candidatos =
    muelles.map(
      (muelle) =>
        prepararResultadoMuelle(
          muelle,
          operacion.tipo_carga
        )
    );


  return {
    operacion: {
      id_operacion:
        operacion.id_operacion,

      codigo:
        operacion.codigo,

      buque:
        operacion.buque,

      empresa:
        operacion.empresa,

      llegada_estimada:
        operacion.llegada_estimada,

      salida_estimada:
        operacion.salida_estimada,

      eslora:
        Number(
          operacion.eslora_m
        ),

      calado:
        Number(
          operacion.calado_m
        ),

      tipoCarga:
        operacion.tipo_carga,

      estado:
        operacion.estado,
    },

    candidatos,
  };
}


/* =========================================================
   CONFIRMAR ASIGNACIÓN
========================================================= */

export async function confirmarAsignacion(
  datos
) {
  const idOperacion =
    validarId(
      datos.id_operacion,
      "El ID de la operación"
    );


  const idMuelle =
    validarId(
      datos.id_muelle,
      "El ID del muelle"
    );


  const idUsuarioResponsable =
    validarId(
      datos.id_usuario_responsable,
      "El usuario responsable"
    );


  return ejecutarEnTransaccion(
    async (
      conexion
    ) => {

      /*
       * Bloqueamos operación y muelle.
       *
       * Esto protege contra dos
       * confirmaciones simultáneas.
       */

      await bloquearOperacionYMuelle(
        idOperacion,
        idMuelle,
        conexion
      );


      /* ===================================
         OPERACIÓN
      =================================== */

      const operacion =
        await obtenerOperacionParaEvaluacion(
          idOperacion,
          conexion
        );


      if (!operacion) {
        throw crearError(
          "La operación no existe.",
          404
        );
      }


      /* ===================================
         USUARIO
      =================================== */

      const usuario =
        await obtenerUsuarioActivoPorId(
          idUsuarioResponsable,
          conexion
        );


      if (!usuario) {
        throw crearError(
          "El usuario responsable no existe o está inactivo.",
          400
        );
      }


      /* ===================================
         ¿YA TIENE MUELLE?
      =================================== */

      const existente =
        await obtenerAsignacionConfirmadaOperacion(
          idOperacion,
          conexion
        );


      if (existente) {
        throw crearError(
          `La operación ya tiene una asignación confirmada en ${existente.muelle_codigo}.`,
          409
        );
      }


      /* ===================================
         REEVALUACIÓN DEL MUELLE

         ESTA ES LA VALIDACIÓN IMPORTANTE.
      =================================== */

      const muelle =
        await obtenerMuelleEvaluado(
          idOperacion,
          idMuelle,
          conexion
        );


      if (!muelle) {
        throw crearError(
          "El muelle no existe o se encuentra inactivo.",
          404
        );
      }


      const evaluacion =
        prepararResultadoMuelle(
          muelle,
          operacion.tipo_carga
        );


      if (
        !evaluacion.compatible
      ) {
        throw crearError(
          `La asignación ya no puede confirmarse. ${evaluacion.motivo}`,
          409
        );
      }


      /* ===================================
         INSERT
      =================================== */

      const asignacion =
        await insertarAsignacion(
          {
            id_operacion:
              idOperacion,

            id_muelle:
              idMuelle,

            id_usuario_responsable:
              idUsuarioResponsable,

            inicio_asignacion:
              operacion.llegada_estimada,

            fin_asignacion:
              operacion.salida_estimada,

            observaciones:
              datos.observaciones ||
              "Asignación confirmada desde TALASSA.",
          },
          conexion
        );


      /* ===================================
         ACTUALIZAR OPERACIÓN
      =================================== */

      await marcarOperacionConMuelle(
        idOperacion,
        conexion
      );


      /* ===================================
         AUDITORÍA
      =================================== */

      await registrarAuditoriaAsignacion(
        {
          id_usuario:
            idUsuarioResponsable,

          id_asignacion:
            asignacion.id_asignacion,

          valores_nuevos: {
            id_operacion:
              idOperacion,

            id_muelle:
              idMuelle,

            estado:
              "Confirmada",

            inicio_asignacion:
              operacion.llegada_estimada,

            fin_asignacion:
              operacion.salida_estimada,
          },

          descripcion:
            `Asignación confirmada: operación ${operacion.codigo} → muelle ${muelle.codigo}.`,
        },
        conexion
      );


      return {
        ...asignacion,

        operacion:
          operacion.codigo,

        buque:
          operacion.buque,

        muelle:
          muelle.codigo,

        nombre_muelle:
          muelle.nombre,
      };
    }
  );
}