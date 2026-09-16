import {
  editarInspeccion,
  eliminarInspeccion,
  listarInspecciones,
  listarOpcionesInspeccion,
  obtenerDetalleInspeccion,
  registrarInspeccion,
} from "../services/inspecciones.service.js";


/* ======================================
   RESPONDER ERRORES
====================================== */

function responderErrorInspeccion(
  res,
  error
) {
  console.error(
    "Error en inspecciones:",
    error
  );


  /*
   * Código duplicado.
   */

  if (
    error.code === "23505"
  ) {
    return res.status(
      409
    ).json({
      ok: false,
      mensaje:
        "Ya existe una inspección con ese código.",
    });
  }


  /*
   * Restricción de llave foránea.
   */

  if (
    error.code === "23503"
  ) {
    return res.status(
      409
    ).json({
      ok: false,
      mensaje:
        "No se puede realizar esta acción porque la inspección tiene registros relacionados.",
    });
  }


  /*
   * CHECK de PostgreSQL.
   */

  if (
    error.code === "23514"
  ) {
    return res.status(
      400
    ).json({
      ok: false,
      mensaje:
        "Uno de los valores enviados no cumple las reglas de la base de datos.",
    });
  }


  const estado =
    error.estadoHttp ||
    500;


  return res.status(
    estado
  ).json({
    ok: false,

    mensaje:
      error.message ||
      "Ocurrió un error al procesar la inspección.",
  });
}


/* ======================================
   GET TODAS
====================================== */

export async function obtenerInspecciones(
  req,
  res
) {
  try {
    const inspecciones =
      await listarInspecciones();


    return res.status(
      200
    ).json({
      ok: true,

      total:
        inspecciones.length,

      datos:
        inspecciones,
    });

  } catch (error) {
    return responderErrorInspeccion(
      res,
      error
    );
  }
}


/* ======================================
   GET UNA
====================================== */

export async function obtenerInspeccion(
  req,
  res
) {
  try {
    const inspeccion =
      await obtenerDetalleInspeccion(
        req.params.id
      );


    return res.status(
      200
    ).json({
      ok: true,

      datos:
        inspeccion,
    });

  } catch (error) {
    return responderErrorInspeccion(
      res,
      error
    );
  }
}


/* ======================================
   OPCIONES FORMULARIO
====================================== */

export async function obtenerOpcionesFormulario(
  req,
  res
) {
  try {
    const opciones =
      await listarOpcionesInspeccion();


    return res.status(
      200
    ).json({
      ok: true,

      datos:
        opciones,
    });

  } catch (error) {
    return responderErrorInspeccion(
      res,
      error
    );
  }
}


/* ======================================
   POST
====================================== */

export async function crearInspeccion(
  req,
  res
) {
  try {
    const inspeccion =
      await registrarInspeccion(
        req.body
      );


    return res.status(
      201
    ).json({
      ok: true,

      mensaje:
        "Inspección registrada correctamente.",

      datos:
        inspeccion,
    });

  } catch (error) {
    return responderErrorInspeccion(
      res,
      error
    );
  }
}


/* ======================================
   PUT
====================================== */

export async function actualizarInspeccion(
  req,
  res
) {
  try {
    const inspeccion =
      await editarInspeccion(
        req.params.id,
        req.body
      );


    return res.status(
      200
    ).json({
      ok: true,

      mensaje:
        "Inspección actualizada correctamente.",

      datos:
        inspeccion,
    });

  } catch (error) {
    return responderErrorInspeccion(
      res,
      error
    );
  }
}


/* ======================================
   DELETE
====================================== */

export async function borrarInspeccion(
  req,
  res
) {
  try {
    const inspeccion =
      await eliminarInspeccion(
        req.params.id
      );


    return res.status(
      200
    ).json({
      ok: true,

      mensaje:
        "Inspección eliminada correctamente.",

      datos:
        inspeccion,
    });

  } catch (error) {
    return responderErrorInspeccion(
      res,
      error
    );
  }
}