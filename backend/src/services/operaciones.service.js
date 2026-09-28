import {
  actualizarOperacionPorId,
  consultarOpcionesFormularioOperacion,
  existeBuqueActivo,
  existeTipoCarga,
  insertarOperacion,
  obtenerOperacionPorId,
  obtenerTodasLasOperaciones,
  registrarLlegadaRealPorId,
  registrarSalidaRealPorId,
} from "../repositories/operaciones.repository.js";

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

function validarIdOperacion(
  idOperacion
) {
  const id =
    Number(
      idOperacion
    );


  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw crearError(
      "El identificador de la operación no es válido.",
      400
    );
  }


  return id;
}


/* ======================================
   PREPARAR DATOS
====================================== */

async function prepararDatosOperacion(
  datos = {}
) {
  const idBuque =
    Number(
      datos.id_buque
    );


  const idTipoCarga =
    Number(
      datos.id_tipo_carga
    );


  const procedencia =
    typeof datos.procedencia ===
    "string"
      ? datos.procedencia.trim()
      : "";


  const destino =
    typeof datos.destino ===
    "string"
      ? datos.destino.trim()
      : "";


  const observaciones =
    typeof datos.observaciones ===
      "string" &&
    datos.observaciones.trim()
      ? datos.observaciones.trim()
      : null;


  if (
    !Number.isInteger(
      idBuque
    ) ||
    idBuque <= 0
  ) {
    throw crearError(
      "Debe seleccionar un buque válido.",
      400
    );
  }


  if (
    !Number.isInteger(
      idTipoCarga
    ) ||
    idTipoCarga <= 0
  ) {
    throw crearError(
      "Debe seleccionar un tipo de carga válido.",
      400
    );
  }


  if (!procedencia) {
    throw crearError(
      "La procedencia es obligatoria.",
      400
    );
  }


  if (!destino) {
    throw crearError(
      "El destino es obligatorio.",
      400
    );
  }


  if (!datos.llegada_estimada) {
    throw crearError(
      "La llegada estimada es obligatoria.",
      400
    );
  }


  if (!datos.salida_estimada) {
    throw crearError(
      "La salida estimada es obligatoria.",
      400
    );
  }


  const llegadaEstimada =
    new Date(
      datos.llegada_estimada
    );


  const salidaEstimada =
    new Date(
      datos.salida_estimada
    );


  if (
    Number.isNaN(
      llegadaEstimada.getTime()
    )
  ) {
    throw crearError(
      "La fecha de llegada estimada no es válida.",
      400
    );
  }


  if (
    Number.isNaN(
      salidaEstimada.getTime()
    )
  ) {
    throw crearError(
      "La fecha de salida estimada no es válida.",
      400
    );
  }


  if (
    salidaEstimada <=
    llegadaEstimada
  ) {
    throw crearError(
      "La salida estimada debe ser posterior a la llegada estimada.",
      400
    );
  }


  const [
    buqueValido,
    tipoCargaValido,
  ] =
    await Promise.all([
      existeBuqueActivo(
        idBuque
      ),

      existeTipoCarga(
        idTipoCarga
      ),
    ]);


  if (!buqueValido) {
    throw crearError(
      "El buque seleccionado no existe o está inactivo.",
      400
    );
  }


  if (!tipoCargaValido) {
    throw crearError(
      "El tipo de carga seleccionado no existe.",
      400
    );
  }


  return {
    id_buque:
      idBuque,

    id_tipo_carga:
      idTipoCarga,

    procedencia,

    destino,

    llegada_estimada:
      llegadaEstimada.toISOString(),

    salida_estimada:
      salidaEstimada.toISOString(),

    observaciones,
  };
}


/* ======================================
   LISTAR
====================================== */

export async function listarOperaciones() {
  return await obtenerTodasLasOperaciones();
}


/* ======================================
   DETALLE
====================================== */

export async function obtenerDetalleOperacion(
  idOperacion
) {
  const id =
    validarIdOperacion(
      idOperacion
    );


  const operacion =
    await obtenerOperacionPorId(
      id
    );


  if (!operacion) {
    throw crearError(
      "La operación solicitada no existe.",
      404
    );
  }


  return operacion;
}


/* ======================================
   OPCIONES DEL FORMULARIO
====================================== */

export async function obtenerOpcionesFormularioOperacion() {
  return await consultarOpcionesFormularioOperacion();
}


/* ======================================
   REGISTRAR OPERACIÓN
====================================== */

export async function registrarOperacion(
  datos = {},
  idUsuario = null
) {
  const datosPreparados =
    await prepararDatosOperacion(
      datos
    );


  const operacionCreada =
    await insertarOperacion(
      datosPreparados
    );


  const operacion =
    await obtenerOperacionPorId(
      operacionCreada.id_operacion
    );


  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "CREAR",

    modulo:
      "Operaciones",

    entidad:
      "operaciones_portuarias",

    idRegistroAfectado:
      operacion.id_operacion,

    valoresAnteriores:
      null,

    valoresNuevos:
      operacion,

    descripcion:
      `Se registró la operación ${operacion.codigo}.`,
  });


  return operacion;
}


/* ======================================
   EDITAR OPERACIÓN
====================================== */

export async function editarOperacion(
  idOperacion,
  datos = {},
  idUsuario = null
) {
  const id =
    validarIdOperacion(
      idOperacion
    );


  const operacionActual =
    await obtenerOperacionPorId(
      id
    );


  if (!operacionActual) {
    throw crearError(
      "La operación que desea editar no existe.",
      404
    );
  }


  if (
    operacionActual.estado ===
    "Finalizada"
  ) {
    throw crearError(
      "Una operación finalizada no puede ser editada.",
      400
    );
  }


  const datosPreparados =
    await prepararDatosOperacion(
      datos
    );


  await actualizarOperacionPorId(
    id,
    datosPreparados
  );


  const operacionActualizada =
    await obtenerOperacionPorId(
      id
    );


  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "EDITAR",

    modulo:
      "Operaciones",

    entidad:
      "operaciones_portuarias",

    idRegistroAfectado:
      id,

    valoresAnteriores:
      operacionActual,

    valoresNuevos:
      operacionActualizada,

    descripcion:
      `Se actualizó la operación ${operacionActualizada.codigo}.`,
  });


  return operacionActualizada;
}


/* ======================================
   REGISTRAR LLEGADA REAL
====================================== */

export async function registrarLlegadaOperacion(
  idOperacion,
  datos = {},
  idUsuario = null
) {
  const id =
    validarIdOperacion(
      idOperacion
    );


  const operacion =
    await obtenerOperacionPorId(
      id
    );


  if (!operacion) {
    throw crearError(
      "La operación solicitada no existe.",
      404
    );
  }


  if (
    operacion.llegada_real
  ) {
    throw crearError(
      "La llegada de esta operación ya fue registrada.",
      400
    );
  }


  if (
    operacion.estado !==
    "Muelle asignado"
  ) {
    throw crearError(
      "La operación debe tener un muelle asignado antes de registrar su llegada.",
      400
    );
  }


  if (!datos.llegada_real) {
    throw crearError(
      "Debe indicar la fecha y hora real de llegada.",
      400
    );
  }


  const llegadaReal =
    new Date(
      datos.llegada_real
    );


  if (
    Number.isNaN(
      llegadaReal.getTime()
    )
  ) {
    throw crearError(
      "La fecha de llegada real no es válida.",
      400
    );
  }


  if (
    llegadaReal >
    new Date()
  ) {
    throw crearError(
      "La llegada real no puede registrarse con una fecha futura.",
      400
    );
  }


  const actualizado =
    await registrarLlegadaRealPorId(
      id,
      llegadaReal.toISOString()
    );


  if (!actualizado) {
    throw crearError(
      "La operación cambió de estado y ya no permite registrar la llegada.",
      409
    );
  }


  const operacionActualizada =
    await obtenerOperacionPorId(
      id
    );


  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "REGISTRAR_LLEGADA",

    modulo:
      "Operaciones",

    entidad:
      "operaciones_portuarias",

    idRegistroAfectado:
      id,

    valoresAnteriores: {
      llegada_real:
        operacion.llegada_real,

      estado:
        operacion.estado,
    },

    valoresNuevos: {
      llegada_real:
        operacionActualizada.llegada_real,

      estado:
        operacionActualizada.estado,
    },

    descripcion:
      `Se registró la llegada real de la operación ${operacionActualizada.codigo}.`,
  });


  return operacionActualizada;
}


/* ======================================
   REGISTRAR SALIDA REAL
====================================== */

export async function registrarSalidaOperacion(
  idOperacion,
  datos = {},
  idUsuario = null
) {
  const id =
    validarIdOperacion(
      idOperacion
    );


  const operacion =
    await obtenerOperacionPorId(
      id
    );


  if (!operacion) {
    throw crearError(
      "La operación solicitada no existe.",
      404
    );
  }


  if (
    !operacion.llegada_real
  ) {
    throw crearError(
      "Debe registrar la llegada antes de registrar la salida.",
      400
    );
  }


  if (
    operacion.salida_real
  ) {
    throw crearError(
      "La salida de esta operación ya fue registrada.",
      400
    );
  }


  if (
    ![
      "En puerto",
      "En operación",
    ].includes(
      operacion.estado
    )
  ) {
    throw crearError(
      "El estado actual de la operación no permite registrar la salida.",
      400
    );
  }


  if (!datos.salida_real) {
    throw crearError(
      "Debe indicar la fecha y hora real de salida.",
      400
    );
  }


  const salidaReal =
    new Date(
      datos.salida_real
    );


  if (
    Number.isNaN(
      salidaReal.getTime()
    )
  ) {
    throw crearError(
      "La fecha de salida real no es válida.",
      400
    );
  }


  const llegadaReal =
    new Date(
      operacion.llegada_real
    );


  if (
    salidaReal <=
    llegadaReal
  ) {
    throw crearError(
      "La salida real debe ser posterior a la llegada real.",
      400
    );
  }


  if (
    salidaReal >
    new Date()
  ) {
    throw crearError(
      "La salida real no puede registrarse con una fecha futura.",
      400
    );
  }


  const actualizado =
    await registrarSalidaRealPorId(
      id,
      salidaReal.toISOString()
    );


  if (!actualizado) {
    throw crearError(
      "La operación cambió de estado y ya no permite registrar la salida.",
      409
    );
  }


  const operacionActualizada =
    await obtenerOperacionPorId(
      id
    );


  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "REGISTRAR_SALIDA",

    modulo:
      "Operaciones",

    entidad:
      "operaciones_portuarias",

    idRegistroAfectado:
      id,

    valoresAnteriores: {
      salida_real:
        operacion.salida_real,

      estado:
        operacion.estado,
    },

    valoresNuevos: {
      salida_real:
        operacionActualizada.salida_real,

      estado:
        operacionActualizada.estado,
    },

    descripcion:
      `Se registró la salida real y se finalizó la operación ${operacionActualizada.codigo}.`,
  });


  return operacionActualizada;
}