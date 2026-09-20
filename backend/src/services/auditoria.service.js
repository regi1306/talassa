import {
  buscarAuditoriaPorId,
  insertarAuditoria,
  listarRegistrosAuditoria,
} from "../repositories/auditoria.repository.js";


function crearError(
  mensaje,
  estado
) {
  const error =
    new Error(mensaje);

  error.status =
    estado;

  return error;
}


function validarId(
  idAuditoria
) {
  const id =
    Number(idAuditoria);


  if (
    !Number.isInteger(id)
    ||
    id <= 0
  ) {
    throw crearError(
      "El identificador de auditoría no es válido.",
      400
    );
  }


  return id;
}


/* ======================================
   CONSULTAS
====================================== */

export async function obtenerAuditoria() {
  return await listarRegistrosAuditoria();
}


export async function obtenerDetalleAuditoria(
  idAuditoria
) {
  const id =
    validarId(
      idAuditoria
    );


  const registro =
    await buscarAuditoriaPorId(
      id
    );


  if (!registro) {
    throw crearError(
      "El registro de auditoría solicitado no existe.",
      404
    );
  }


  return registro;
}


/* ======================================
   REGISTRO DE EVENTOS
====================================== */

export async function registrarEventoAuditoria(
  datos
) {
  try {
    return await insertarAuditoria(
      datos
    );

  } catch (error) {
    /*
      No detenemos una operación principal
      únicamente porque falle el registro
      de auditoría.

      El error queda registrado en consola
      para poder detectarlo.
    */

    console.error(
      "No fue posible registrar la auditoría:",
      error
    );


    return null;
  }
}