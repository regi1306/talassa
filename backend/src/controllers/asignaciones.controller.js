import {
  confirmarAsignacion,
  evaluarMuellesOperacion,
} from "../services/asignaciones.service.js";


function responderError(
  res,
  error
) {
  console.error(
    "Error en asignaciones:",
    error
  );


  /*
   * Índice único:
   * una sola asignación Confirmada
   * por operación.
   */

  if (
    error.code ===
    "23505"
  ) {
    return res
      .status(409)
      .json({
        ok: false,

        mensaje:
          "La operación ya posee una asignación confirmada.",
      });
  }


  /*
   * Foreign key
   */

  if (
    error.code ===
    "23503"
  ) {
    return res
      .status(409)
      .json({
        ok: false,

        mensaje:
          "No fue posible confirmar la asignación porque existen datos relacionados inválidos.",
      });
  }


  const estado =
    error.estadoHttp ||
    500;


  return res
    .status(estado)
    .json({
      ok: false,

      mensaje:
        error.message ||
        "Ocurrió un error al procesar la asignación.",
    });
}


/* =========================================================
   GET /api/asignaciones/evaluar/:idOperacion
========================================================= */

export async function evaluarMuelles(
  req,
  res
) {
  try {
    const datos =
      await evaluarMuellesOperacion(
        req.params.idOperacion
      );


    return res.json({
      ok: true,

      total:
        datos.candidatos.length,

      datos,
    });

  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* =========================================================
   POST /api/asignaciones/confirmar
========================================================= */

export async function confirmar(
  req,
  res
) {
  try {
    /*
     * Si posteriormente tu middleware
     * de autenticación pone el usuario
     * en req.usuario o req.user,
     * esto ya lo soporta.
     */

    const idUsuarioResponsable =
      req.usuario?.id_usuario ??
      req.user?.id_usuario ??
      req.body.id_usuario_responsable;


    const datos =
      await confirmarAsignacion({
        ...req.body,

        id_usuario_responsable:
          idUsuarioResponsable,
      });


    return res
      .status(201)
      .json({
        ok: true,

        mensaje:
          "Muelle asignado correctamente.",

        datos,
      });

  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}