import {
  listarOperaciones,
  obtenerDetalleOperacion,
  obtenerOpcionesFormularioOperacion,
  registrarOperacion,
  editarOperacion,
  registrarLlegadaOperacion,
  registrarSalidaOperacion,
} from "../services/operaciones.service.js";


function responderErrorOperacion(
  error,
  res,
  mensajeGeneral
) {
  console.error(
    mensajeGeneral,
    error
  );


  if (error.code === "23503") {
    return res.status(400).json({
      ok: false,
      mensaje:
        "El buque o tipo de carga seleccionado no es válido.",
    });
  }


  if (error.code === "23514") {
    return res.status(400).json({
      ok: false,
      mensaje:
        "Las fechas o el estado de la operación no cumplen las reglas establecidas.",
    });
  }


  return res
    .status(
      error.estadoHttp || 500
    )
    .json({
      ok: false,

      mensaje:
        error.estadoHttp
          ? error.message
          : mensajeGeneral,
    });
}


export async function obtenerOperaciones(
  req,
  res
) {
  try {
    const operaciones =
      await listarOperaciones();

    return res.status(200).json({
      ok: true,
      total:
        operaciones.length,
      datos:
        operaciones,
    });
  } catch (error) {
    return responderErrorOperacion(
      error,
      res,
      "No fue posible obtener las operaciones."
    );
  }
}


export async function obtenerOperacion(
  req,
  res
) {
  try {
    const operacion =
      await obtenerDetalleOperacion(
        req.params.id
      );

    return res.status(200).json({
      ok: true,
      datos:
        operacion,
    });
  } catch (error) {
    return responderErrorOperacion(
      error,
      res,
      "No fue posible obtener la operación."
    );
  }
}


export async function obtenerOpcionesOperacion(
  req,
  res
) {
  try {
    const opciones =
      await obtenerOpcionesFormularioOperacion();

    return res.status(200).json({
      ok: true,
      datos:
        opciones,
    });
  } catch (error) {
    return responderErrorOperacion(
      error,
      res,
      "No fue posible cargar las opciones de la operación."
    );
  }
}


export async function crearOperacion(
  req,
  res
) {
  try {
    const operacion =
      await registrarOperacion(
        req.body
      );

    return res.status(201).json({
      ok: true,

      mensaje:
        "Operación programada correctamente.",

      datos:
        operacion,
    });
  } catch (error) {
    return responderErrorOperacion(
      error,
      res,
      "No fue posible programar la operación."
    );
  }
}

export async function actualizarOperacion(
  req,
  res
) {
  try {
    const operacion =
      await editarOperacion(
        req.params.id,
        req.body
      );


    return res.status(200).json({
      ok: true,

      mensaje:
        "Operación actualizada correctamente.",

      datos:
        operacion,
    });
  } catch (error) {
    return responderErrorOperacion(
      error,
      res,
      "No fue posible actualizar la operación."
    );
  }
}

export async function actualizarLlegadaOperacion(
  req,
  res
) {
  try {
    const operacion =
      await registrarLlegadaOperacion(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      ok: true,

      mensaje:
        "Llegada registrada correctamente.",

      datos:
        operacion,
    });
  } catch (error) {
    return responderErrorOperacion(
      error,
      res,
      "No fue posible registrar la llegada."
    );
  }
}


export async function actualizarSalidaOperacion(
  req,
  res
) {
  try {
    const operacion =
      await registrarSalidaOperacion(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      ok: true,

      mensaje:
        "Salida registrada y operación finalizada correctamente.",

      datos:
        operacion,
    });
  } catch (error) {
    return responderErrorOperacion(
      error,
      res,
      "No fue posible registrar la salida."
    );
  }
}