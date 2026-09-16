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
    return res.status(
      409
    ).json({
      ok: false,
      mensaje:
        "Ya existe una incidencia con ese código.",
    });
  }


  if (
    error.code === "23503"
  ) {
    return res.status(
      409
    ).json({
      ok: false,
      mensaje:
        "La operación no puede realizarse porque existen registros relacionados.",
    });
  }


  if (
    error.code === "23514"
  ) {
    return res.status(
      400
    ).json({
      ok: false,
      mensaje:
        "Uno de los valores no cumple las reglas de la base de datos.",
    });
  }


  return res.status(
    error.estadoHttp ||
    500
  ).json({
    ok: false,

    mensaje:
      error.message ||
      "Ocurrió un error al procesar la incidencia.",
  });
}


export async function obtenerIncidencias(
  req,
  res
) {
  try {
    const datos =
      await listarIncidencias();

    res.json({
      ok: true,
      total:
        datos.length,
      datos,
    });

  } catch (error) {
    responderError(
      res,
      error
    );
  }
}


export async function obtenerIncidencia(
  req,
  res
) {
  try {
    const datos =
      await obtenerDetalleIncidencia(
        req.params.id
      );

    res.json({
      ok: true,
      datos,
    });

  } catch (error) {
    responderError(
      res,
      error
    );
  }
}


export async function obtenerOpcionesFormulario(
  req,
  res
) {
  try {
    const datos =
      await listarOpcionesIncidencia();

    res.json({
      ok: true,
      datos,
    });

  } catch (error) {
    responderError(
      res,
      error
    );
  }
}


export async function crearIncidencia(
  req,
  res
) {
  try {
    const datos =
      await registrarIncidencia(
        req.body
      );

    res.status(
      201
    ).json({
      ok: true,
      mensaje:
        "Incidencia registrada correctamente.",
      datos,
    });

  } catch (error) {
    responderError(
      res,
      error
    );
  }
}


export async function actualizarIncidencia(
  req,
  res
) {
  try {
    const datos =
      await editarIncidencia(
        req.params.id,
        req.body
      );

    res.json({
      ok: true,
      mensaje:
        "Incidencia actualizada correctamente.",
      datos,
    });

  } catch (error) {
    responderError(
      res,
      error
    );
  }
}


export async function actualizarEstado(
  req,
  res
) {
  try {
    const datos =
      await cambiarEstadoIncidencia(
        req.params.id,
        req.body
      );

    res.json({
      ok: true,
      mensaje:
        "Estado actualizado correctamente.",
      datos,
    });

  } catch (error) {
    responderError(
      res,
      error
    );
  }
}


export async function agregarSeguimiento(
  req,
  res
) {
  try {
    const datos =
      await registrarSeguimiento(
        req.params.id,
        req.body
      );

    res.status(
      201
    ).json({
      ok: true,
      mensaje:
        "Seguimiento registrado correctamente.",
      datos,
    });

  } catch (error) {
    responderError(
      res,
      error
    );
  }
}


export async function borrarIncidencia(
  req,
  res
) {
  try {
    const datos =
      await eliminarIncidencia(
        req.params.id
      );

    res.json({
      ok: true,
      mensaje:
        "Incidencia eliminada correctamente.",
      datos,
    });

  } catch (error) {
    responderError(
      res,
      error
    );
  }
}