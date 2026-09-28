import {
  actualizarMuellePorId,
  desactivarMuellePorId,
  insertarMuelle,
  muelleTieneAsignacionConfirmada,
  obtenerMuellePorId,
  obtenerTodosLosMuelles,
} from "../repositories/muelles.repository.js";

import {
  registrarEventoAuditoria,
} from "./auditoria.service.js";


/* ======================================
   ERROR PERSONALIZADO
====================================== */

function crearError(
  mensaje,
  estadoHttp
) {
  const error =
    new Error(
      mensaje
    );


  error.estadoHttp =
    estadoHttp;


  return error;
}


/* ======================================
   VALIDAR ID
====================================== */

function validarIdMuelle(
  idMuelle
) {
  const id =
    Number(
      idMuelle
    );


  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw crearError(
      "El identificador del muelle no es válido.",
      400
    );
  }


  return id;
}


/* ======================================
   VALIDAR Y PREPARAR DATOS
====================================== */

function prepararDatosMuelle(
  datos = {}
) {
  const codigo =
    typeof datos.codigo === "string"
      ? datos.codigo
          .trim()
          .toUpperCase()
      : "";


  const nombre =
    typeof datos.nombre === "string"
      ? datos.nombre.trim()
      : "";


  const longitudMaxima =
    Number(
      datos.longitud_maxima
    );


  const caladoMaximo =
    Number(
      datos.calado_maximo
    );


  const estadoOperativo =
    typeof datos.estado_operativo ===
    "string"
      ? datos.estado_operativo.trim()
      : "";


  /* CÓDIGO */

  if (!codigo) {
    throw crearError(
      "El código del muelle es obligatorio.",
      400
    );
  }


  /* NOMBRE */

  if (!nombre) {
    throw crearError(
      "El nombre del muelle es obligatorio.",
      400
    );
  }


  /* LONGITUD */

  if (
    !Number.isFinite(
      longitudMaxima
    ) ||
    longitudMaxima <= 0
  ) {
    throw crearError(
      "La longitud máxima debe ser mayor que cero.",
      400
    );
  }


  /* CALADO */

  if (
    !Number.isFinite(
      caladoMaximo
    ) ||
    caladoMaximo <= 0
  ) {
    throw crearError(
      "El calado máximo debe ser mayor que cero.",
      400
    );
  }


  /* ESTADO */

  const estadosPermitidos = [
    "Disponible",
    "Reservado",
    "Ocupado",
    "Mantenimiento",
    "Fuera de servicio",
  ];


  if (
    !estadosPermitidos.includes(
      estadoOperativo
    )
  ) {
    throw crearError(
      "El estado operativo del muelle no es válido.",
      400
    );
  }


  return {
    codigo,

    nombre,

    longitud_maxima:
      longitudMaxima,

    calado_maximo:
      caladoMaximo,

    estado_operativo:
      estadoOperativo,
  };
}


/* ======================================
   LISTAR
====================================== */

export async function listarMuelles() {
  return await obtenerTodosLosMuelles();
}


/* ======================================
   DETALLE
====================================== */

export async function obtenerDetalleMuelle(
  idMuelle
) {
  const id =
    validarIdMuelle(
      idMuelle
    );


  const muelle =
    await obtenerMuellePorId(
      id
    );


  if (!muelle) {
    throw crearError(
      "El muelle solicitado no existe.",
      404
    );
  }


  return muelle;
}


/* ======================================
   REGISTRAR
====================================== */

export async function registrarMuelle(
  datos = {},
  idUsuario = null
) {
  const datosPreparados =
    prepararDatosMuelle(
      datos
    );


  const nuevoMuelle =
    await insertarMuelle(
      datosPreparados
    );


  const muelle =
    await obtenerMuellePorId(
      nuevoMuelle.id_muelle
    );


  /* ======================================
     AUDITORÍA
  ====================================== */

  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "CREAR",

    modulo:
      "Muelles",

    entidad:
      "muelles",

    idRegistroAfectado:
      muelle.id_muelle,

    valoresAnteriores:
      null,

    valoresNuevos:
      muelle,

    descripcion:
      `Se registró el muelle ${muelle.codigo} - ${muelle.nombre}.`,
  });


  return muelle;
}


/* ======================================
   EDITAR
====================================== */

export async function editarMuelle(
  idMuelle,
  datos = {},
  idUsuario = null
) {
  const id =
    validarIdMuelle(
      idMuelle
    );


  const muelleActual =
    await obtenerMuellePorId(
      id
    );


  if (!muelleActual) {
    throw crearError(
      "El muelle que desea editar no existe.",
      404
    );
  }


  const datosPreparados =
    prepararDatosMuelle(
      datos
    );


  await actualizarMuellePorId(
    id,
    datosPreparados
  );


  const muelleActualizado =
    await obtenerMuellePorId(
      id
    );


  /* ======================================
     AUDITORÍA
  ====================================== */

  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "EDITAR",

    modulo:
      "Muelles",

    entidad:
      "muelles",

    idRegistroAfectado:
      id,

    valoresAnteriores:
      muelleActual,

    valoresNuevos:
      muelleActualizado,

    descripcion:
      `Se actualizó el muelle ${muelleActualizado.codigo} - ${muelleActualizado.nombre}.`,
  });


  return muelleActualizado;
}


/* ======================================
   ELIMINAR LÓGICAMENTE
====================================== */

export async function eliminarMuelle(
  idMuelle,
  idUsuario = null
) {
  const id =
    validarIdMuelle(
      idMuelle
    );


  const muelleActual =
    await obtenerMuellePorId(
      id
    );


  if (!muelleActual) {
    throw crearError(
      "El muelle que desea eliminar no existe.",
      404
    );
  }


  const tieneAsignacion =
    await muelleTieneAsignacionConfirmada(
      id
    );


  if (tieneAsignacion) {
    throw crearError(
      "No se puede eliminar un muelle que tiene una asignación confirmada.",
      409
    );
  }


  const eliminado =
    await desactivarMuellePorId(
      id
    );


  if (!eliminado) {
    throw crearError(
      "No fue posible eliminar el muelle.",
      500
    );
  }


  /* ======================================
     AUDITORÍA
  ====================================== */

  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "DESACTIVAR",

    modulo:
      "Muelles",

    entidad:
      "muelles",

    idRegistroAfectado:
      id,

    valoresAnteriores: {
      activo:
        muelleActual.activo,

      codigo:
        muelleActual.codigo,

      nombre:
        muelleActual.nombre,
    },

    valoresNuevos: {
      activo:
        false,

      codigo:
        muelleActual.codigo,

      nombre:
        muelleActual.nombre,
    },

    descripcion:
      `Se desactivó el muelle ${muelleActual.codigo} - ${muelleActual.nombre}.`,
  });


  return {
    id_muelle:
      id,

    codigo:
      muelleActual.codigo,

    nombre:
      muelleActual.nombre,
  };
}