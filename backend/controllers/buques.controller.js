import {
  cambiarEstadoBuque,
  editarBuque,
  listarBuques,
  obtenerDetalleBuque,
  obtenerOpcionesFormulario,
  registrarBuque,
} from "../services/buques.service.js";


function responderErrorBuque(
  error,
  res,
  mensajeGeneral
) {
  console.error(
    mensajeGeneral,
    error
  );


  if (error.code === "23505") {
    return res.status(409).json({
      ok: false,
      mensaje:
        "Ya existe un buque con esa identificación.",
    });
  }


  if (error.code === "23503") {
    return res.status(400).json({
      ok: false,
      mensaje:
        "La empresa o el tipo de buque seleccionado no es válido.",
    });
  }


  return res
    .status(error.estadoHttp || 500)
    .json({
      ok: false,
      mensaje:
        error.estadoHttp
          ? error.message
          : mensajeGeneral,
    });
}


export async function obtenerBuques(
  req,
  res
) {
  try {
    const buques =
      await listarBuques();

    return res.status(200).json({
      ok: true,
      total: buques.length,
      datos: buques,
    });
  } catch (error) {
    return responderErrorBuque(
      error,
      res,
      "No fue posible obtener los buques."
    );
  }
}


export async function obtenerBuque(
  req,
  res
) {
  try {
    const resultado =
      await obtenerDetalleBuque(
        req.params.id
      );

    return res.status(200).json({
      ok: true,
      datos: resultado,
    });
  } catch (error) {
    return responderErrorBuque(
      error,
      res,
      "No fue posible obtener el detalle del buque."
    );
  }
}


export async function obtenerOpcionesBuque(
  req,
  res
) {
  try {
    const opciones =
      await obtenerOpcionesFormulario();

    return res.status(200).json({
      ok: true,
      datos: opciones,
    });
  } catch (error) {
    return responderErrorBuque(
      error,
      res,
      "No fue posible cargar las opciones del formulario."
    );
  }
}


export async function crearBuque(
  req,
  res
) {
  try {
    const buque =
      await registrarBuque(req.body);

    return res.status(201).json({
      ok: true,
      mensaje:
        "Buque registrado correctamente.",
      datos: buque,
    });
  } catch (error) {
    return responderErrorBuque(
      error,
      res,
      "No fue posible registrar el buque."
    );
  }
}


export async function actualizarBuque(
  req,
  res
) {
  try {
    const buque =
      await editarBuque(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      ok: true,
      mensaje:
        "Buque actualizado correctamente.",
      datos: buque,
    });
  } catch (error) {
    return responderErrorBuque(
      error,
      res,
      "No fue posible actualizar el buque."
    );
  }
}


export async function actualizarEstadoBuque(
  req,
  res
) {
  try {
    const buque =
      await cambiarEstadoBuque(
        req.params.id,
        req.body.activo
      );

    return res.status(200).json({
      ok: true,
      mensaje: buque.activo
        ? "Buque reactivado correctamente."
        : "Buque desactivado correctamente.",
      datos: buque,
    });
  } catch (error) {
    return responderErrorBuque(
      error,
      res,
      "No fue posible cambiar el estado del buque."
    );
  }
}