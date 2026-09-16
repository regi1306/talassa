import {
  editarMuelle,
  eliminarMuelle,
  listarMuelles,
  obtenerDetalleMuelle,
  registrarMuelle,
} from "../services/muelles.service.js";


/* ======================================
   MANEJO DE ERRORES
====================================== */

function responderErrorMuelle(
  error,
  res,
  mensajeGeneral
) {
  console.error(
    mensajeGeneral,
    error
  );


  /* CÓDIGO DUPLICADO */

  if (error.code === "23505") {
    return res
      .status(409)
      .json({
        ok: false,

        mensaje:
          "Ya existe un muelle con ese código.",
      });
  }


  /* ERROR DE CLAVE FORÁNEA */

  if (error.code === "23503") {
    return res
      .status(409)
      .json({
        ok: false,

        mensaje:
          "El muelle está relacionado con otros registros y no puede procesarse.",
      });
  }


  return res
    .status(
      error.estadoHttp ||
      500
    )
    .json({
      ok: false,

      mensaje:
        error.estadoHttp
          ? error.message
          : mensajeGeneral,
    });
}


/* ======================================
   GET /api/muelles
====================================== */

export async function obtenerMuelles(
  req,
  res
) {
  try {
    const muelles =
      await listarMuelles();


    return res
      .status(200)
      .json({
        ok: true,

        total:
          muelles.length,

        datos:
          muelles,
      });

  } catch (error) {

    return responderErrorMuelle(
      error,
      res,
      "No fue posible obtener los muelles."
    );

  }
}


/* ======================================
   GET /api/muelles/:id
====================================== */

export async function obtenerMuelle(
  req,
  res
) {
  try {
    const muelle =
      await obtenerDetalleMuelle(
        req.params.id
      );


    return res
      .status(200)
      .json({
        ok: true,

        datos:
          muelle,
      });

  } catch (error) {

    return responderErrorMuelle(
      error,
      res,
      "No fue posible obtener el detalle del muelle."
    );

  }
}


/* ======================================
   POST /api/muelles
====================================== */

export async function crearMuelle(
  req,
  res
) {
  try {
    const muelle =
      await registrarMuelle(
        req.body
      );


    return res
      .status(201)
      .json({
        ok: true,

        mensaje:
          "Muelle registrado correctamente.",

        datos:
          muelle,
      });

  } catch (error) {

    return responderErrorMuelle(
      error,
      res,
      "No fue posible registrar el muelle."
    );

  }
}


/* ======================================
   PUT /api/muelles/:id
====================================== */

export async function actualizarMuelle(
  req,
  res
) {
  try {
    const muelle =
      await editarMuelle(
        req.params.id,
        req.body
      );


    return res
      .status(200)
      .json({
        ok: true,

        mensaje:
          "Muelle actualizado correctamente.",

        datos:
          muelle,
      });

  } catch (error) {

    return responderErrorMuelle(
      error,
      res,
      "No fue posible actualizar el muelle."
    );

  }
}


/* ======================================
   DELETE /api/muelles/:id
====================================== */

export async function borrarMuelle(
  req,
  res
) {
  try {
    const muelle =
      await eliminarMuelle(
        req.params.id
      );


    return res
      .status(200)
      .json({
        ok: true,

        mensaje:
          "Muelle eliminado correctamente.",

        datos:
          muelle,
      });

  } catch (error) {

    return responderErrorMuelle(
      error,
      res,
      "No fue posible eliminar el muelle."
    );

  }
}