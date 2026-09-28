import {
  cambiarEstadoIncidencia,
  editarIncidencia,
  eliminarIncidencia,
  listarIncidencias,
  listarOpcionesIncidencia,
  obtenerDetalleIncidencia,
  registrarIncidencia,
  registrarSeguimiento,
} from "../services/incidencias.service.js";


/* ======================================
   RESPONDER ERRORES
====================================== */

function responderError(
  res,
  error
) {
  console.error(
    "Error en incidencias:",
    error
  );


  if (
    error.code === "23505"
  ) {
    return res
      .status(409)
      .json({
        ok: false,

        mensaje:
          "Ya existe una incidencia con ese código.",
      });
  }


  if (
    error.code === "23503"
  ) {
    return res
      .status(409)
      .json({
        ok: false,

        mensaje:
          "La operación no puede realizarse porque existen registros relacionados.",
      });
  }


  if (
    error.code === "23514"
  ) {
    return res
      .status(400)
      .json({
        ok: false,

        mensaje:
          "Uno de los valores no cumple las reglas de la base de datos.",
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
        error.message ||
        "Ocurrió un error al procesar la incidencia.",
    });
}


/* ======================================
   LISTAR INCIDENCIAS
====================================== */

export async function obtenerIncidencias(
  req,
  res
) {
  try {
    const datos =
      await listarIncidencias();


    return res.json({
      ok: true,

      total:
        datos.length,

      datos,
    });

  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* ======================================
   OBTENER INCIDENCIA
====================================== */

export async function obtenerIncidencia(
  req,
  res
) {
  try {
    const datos =
      await obtenerDetalleIncidencia(
        req.params.id
      );


    return res.json({
      ok: true,

      datos,
    });

  } catch (error) {
    return responderError(
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
    const datos =
      await listarOpcionesIncidencia();


    return res.json({
      ok: true,

      datos,
    });

  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* ======================================
   CREAR INCIDENCIA
====================================== */

export async function crearIncidencia(
  req,
  res
) {
  try {
    const datos =
      await registrarIncidencia(
        req.body,
        req.usuario?.id_usuario
      );


    return res
      .status(201)
      .json({
        ok: true,

        mensaje:
          "Incidencia registrada correctamente.",

        datos,
      });

  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* ======================================
   EDITAR INCIDENCIA
====================================== */

export async function actualizarIncidencia(
  req,
  res
) {
  try {
    const datos =
      await editarIncidencia(
        req.params.id,
        req.body,
        req.usuario?.id_usuario
      );


    return res.json({
      ok: true,

      mensaje:
        "Incidencia actualizada correctamente.",

      datos,
    });

  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* ======================================
   CAMBIAR ESTADO
====================================== */

export async function actualizarEstado(
  req,
  res
) {
  try {
    const datos =
      await cambiarEstadoIncidencia(
        req.params.id,
        req.body,
        req.usuario?.id_usuario
      );


    return res.json({
      ok: true,

      mensaje:
        "Estado actualizado correctamente.",

      datos,
    });

  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* ======================================
   AGREGAR SEGUIMIENTO
====================================== */

export async function agregarSeguimiento(
  req,
  res
) {
  try {
    const datos =
      await registrarSeguimiento(
        req.params.id,
        req.body,
        req.usuario?.id_usuario
      );


    return res
      .status(201)
      .json({
        ok: true,

        mensaje:
          "Seguimiento registrado correctamente.",

        datos,
      });

  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* ======================================
   ELIMINAR INCIDENCIA
====================================== */

export async function borrarIncidencia(
  req,
  res
) {
  try {
    const datos =
      await eliminarIncidencia(
        req.params.id,
        req.usuario?.id_usuario
      );


    return res.json({
      ok: true,

      mensaje:
        "Incidencia eliminada correctamente.",

      datos,
    });

  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}