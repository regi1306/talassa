import {
  actualizarBuquePorId,
  actualizarEstadoBuquePorId,
  consultarOpcionesFormularioBuque,
  existeEmpresaActiva,
  existeTipoBuqueActivo,
  insertarBuque,
  obtenerBuquePorId,
  obtenerOperacionesPorBuque,
  obtenerTodosLosBuques,
} from "../repositories/buques.repository.js";

import {
  registrarEventoAuditoria,
} from "./auditoria.service.js";


/* ======================================
   ERROR CONTROLADO
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

function validarIdBuque(
  idBuque
) {
  const id =
    Number(
      idBuque
    );


  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw crearError(
      "El identificador del buque no es válido.",
      400
    );
  }


  return id;
}


/* ======================================
   PREPARAR DATOS
====================================== */

async function prepararDatosBuque(
  datos = {}
) {
  const nombre =
    typeof datos.nombre ===
    "string"
      ? datos.nombre.trim()
      : "";


  const identificacion =
    typeof datos.identificacion ===
    "string"
      ? datos.identificacion.trim()
      : "";


  const bandera =
    typeof datos.bandera ===
      "string" &&
    datos.bandera.trim()
      ? datos.bandera.trim()
      : null;


  const idEmpresa =
    Number(
      datos.id_empresa
    );


  const idTipoBuque =
    Number(
      datos.id_tipo_buque
    );


  const eslora =
    Number(
      datos.eslora_m
    );


  const calado =
    Number(
      datos.calado_m
    );


  const manga =
    datos.manga_m === null ||
    datos.manga_m === undefined ||
    datos.manga_m === ""
      ? null
      : Number(
          datos.manga_m
        );


  if (!nombre) {
    throw crearError(
      "El nombre del buque es obligatorio.",
      400
    );
  }


  if (!identificacion) {
    throw crearError(
      "La identificación del buque es obligatoria.",
      400
    );
  }


  if (
    !Number.isInteger(
      idEmpresa
    ) ||
    idEmpresa <= 0
  ) {
    throw crearError(
      "Debe seleccionar una empresa válida.",
      400
    );
  }


  if (
    !Number.isInteger(
      idTipoBuque
    ) ||
    idTipoBuque <= 0
  ) {
    throw crearError(
      "Debe seleccionar un tipo de buque válido.",
      400
    );
  }


  if (
    !Number.isFinite(
      eslora
    ) ||
    eslora <= 0
  ) {
    throw crearError(
      "La eslora debe ser mayor que cero.",
      400
    );
  }


  if (
    manga !== null &&
    (
      !Number.isFinite(
        manga
      ) ||
      manga <= 0
    )
  ) {
    throw crearError(
      "La manga debe ser mayor que cero.",
      400
    );
  }


  if (
    !Number.isFinite(
      calado
    ) ||
    calado <= 0
  ) {
    throw crearError(
      "El calado debe ser mayor que cero.",
      400
    );
  }


  const [
    empresaValida,
    tipoBuqueValido,
  ] =
    await Promise.all([
      existeEmpresaActiva(
        idEmpresa
      ),

      existeTipoBuqueActivo(
        idTipoBuque
      ),
    ]);


  if (!empresaValida) {
    throw crearError(
      "La empresa seleccionada no existe o está inactiva.",
      400
    );
  }


  if (!tipoBuqueValido) {
    throw crearError(
      "El tipo de buque seleccionado no existe o está inactivo.",
      400
    );
  }


  return {
    nombre,

    identificacion,

    id_empresa:
      idEmpresa,

    id_tipo_buque:
      idTipoBuque,

    bandera,

    eslora_m:
      eslora,

    manga_m:
      manga,

    calado_m:
      calado,
  };
}


/* ======================================
   LISTAR
====================================== */

export async function listarBuques() {
  return await obtenerTodosLosBuques();
}


/* ======================================
   DETALLE
====================================== */

export async function obtenerDetalleBuque(
  idBuque
) {
  const id =
    validarIdBuque(
      idBuque
    );


  const buque =
    await obtenerBuquePorId(
      id
    );


  if (!buque) {
    throw crearError(
      "El buque solicitado no existe.",
      404
    );
  }


  const operaciones =
    await obtenerOperacionesPorBuque(
      id
    );


  return {
    buque,
    operaciones,
  };
}


/* ======================================
   OPCIONES DEL FORMULARIO
====================================== */

export async function obtenerOpcionesFormulario() {
  return await consultarOpcionesFormularioBuque();
}


/* ======================================
   REGISTRAR BUQUE
====================================== */

export async function registrarBuque(
  datos = {},
  idUsuario = null
) {
  const datosPreparados =
    await prepararDatosBuque(
      datos
    );


  const buqueCreado =
    await insertarBuque(
      datosPreparados
    );


  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "CREAR",

    modulo:
      "Buques",

    entidad:
      "buques",

    idRegistroAfectado:
      buqueCreado.id_buque,

    valoresAnteriores:
      null,

    valoresNuevos:
      buqueCreado,

    descripcion:
      `Se registró el buque ${buqueCreado.nombre} (${buqueCreado.identificacion}).`,
  });


  return buqueCreado;
}


/* ======================================
   EDITAR BUQUE
====================================== */

export async function editarBuque(
  idBuque,
  datos = {},
  idUsuario = null
) {
  const id =
    validarIdBuque(
      idBuque
    );


  const buqueActual =
    await obtenerBuquePorId(
      id
    );


  if (!buqueActual) {
    throw crearError(
      "El buque que desea editar no existe.",
      404
    );
  }


  const datosPreparados =
    await prepararDatosBuque(
      datos
    );


  await actualizarBuquePorId(
    id,
    datosPreparados
  );


  const buqueActualizado =
    await obtenerBuquePorId(
      id
    );


  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "EDITAR",

    modulo:
      "Buques",

    entidad:
      "buques",

    idRegistroAfectado:
      id,

    valoresAnteriores:
      buqueActual,

    valoresNuevos:
      buqueActualizado,

    descripcion:
      `Se actualizó la información del buque ${buqueActualizado.nombre} (${buqueActualizado.identificacion}).`,
  });


  return buqueActualizado;
}


/* ======================================
   CAMBIAR ESTADO
====================================== */

export async function cambiarEstadoBuque(
  idBuque,
  activo,
  idUsuario = null
) {
  const id =
    validarIdBuque(
      idBuque
    );


  if (
    typeof activo !==
    "boolean"
  ) {
    throw crearError(
      "El estado enviado no es válido.",
      400
    );
  }


  const buqueActual =
    await obtenerBuquePorId(
      id
    );


  if (!buqueActual) {
    throw crearError(
      "El buque solicitado no existe.",
      404
    );
  }


  await actualizarEstadoBuquePorId(
    id,
    activo
  );


  const buqueActualizado =
    await obtenerBuquePorId(
      id
    );


  await registrarEventoAuditoria({
    idUsuario,

    accion:
      activo
        ? "REACTIVAR"
        : "DESACTIVAR",

    modulo:
      "Buques",

    entidad:
      "buques",

    idRegistroAfectado:
      id,

    valoresAnteriores: {
      activo:
        buqueActual.activo,
    },

    valoresNuevos: {
      activo:
        buqueActualizado.activo,
    },

    descripcion:
      activo
        ? `Se reactivó el buque ${buqueActualizado.nombre} (${buqueActualizado.identificacion}).`
        : `Se desactivó el buque ${buqueActualizado.nombre} (${buqueActualizado.identificacion}).`,
  });


  return buqueActualizado;
}