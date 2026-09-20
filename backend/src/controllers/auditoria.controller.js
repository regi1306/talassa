import {
  obtenerAuditoria,
  obtenerDetalleAuditoria,
} from "../services/auditoria.service.js";


function responderError(
  res,
  error
) {
  console.error(
    "Error en auditoría:",
    error
  );


  return res.status(
    error.status || 500
  ).json({
    ok: false,

    message:
      error.status
        ? error.message
        : "Ocurrió un error interno en el servidor.",
  });
}


export async function listar(
  req,
  res
) {
  try {
    const registros =
      await obtenerAuditoria();


    return res.json({
      ok: true,
      data: registros,
    });


  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


export async function detalle(
  req,
  res
) {
  try {
    const registro =
      await obtenerDetalleAuditoria(
        req.params.id
      );


    return res.json({
      ok: true,
      data: registro,
    });


  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}