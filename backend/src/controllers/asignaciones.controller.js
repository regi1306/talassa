import {
  confirmarAsignacion,
  evaluarMuellesOperacion,
} from "../services/asignaciones.service.js";


/* =========================================================
   RESPUESTA DE ERRORES
========================================================= */

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

    /* ======================================
       USUARIO AUTENTICADO

       El usuario responsable se obtiene
       únicamente del JWT validado por
       verificarToken.

       Nunca se confía en un ID enviado
       desde el frontend.
    ====================================== */

    const idUsuarioResponsable =
      req.usuario?.id_usuario;


    if (!idUsuarioResponsable) {
      return res
        .status(401)
        .json({
          ok: false,

          mensaje:
            "No fue posible identificar al usuario autenticado.",
        });
    }


    /* ======================================
       DATOS DE LA ASIGNACIÓN
    ====================================== */

    const {
      id_operacion,
      id_muelle,
      observaciones,
    } = req.body;


    const datos =
      await confirmarAsignacion({
        id_operacion,

        id_muelle,

        observaciones,

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