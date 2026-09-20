import {
  listarContenedores,
  obtenerDetalleContenedor,
  obtenerOpcionesFormularioContenedor,
  registrarContenedor,
  editarContenedor,
} from "../services/contenedores.service.js";


function responderErrorContenedor(
  error,
  res,
  mensajeGeneral
) {
  console.error(
    mensajeGeneral,
    error
  );

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


export async function obtenerContenedores(
  req,
  res
) {
  try {
    const contenedores =
      await listarContenedores();

    return res.status(200).json({
      ok: true,
      total:
        contenedores.length,
      datos:
        contenedores,
    });
  } catch (error) {
    return responderErrorContenedor(
      error,
      res,
      "No fue posible obtener los contenedores."
    );
  }
}


export async function obtenerContenedor(
  req,
  res
) {
  try {
    const contenedor =
      await obtenerDetalleContenedor(
        req.params.id
      );

    return res.status(200).json({
      ok: true,
      datos:
        contenedor,
    });
  } catch (error) {
    return responderErrorContenedor(
      error,
      res,
      "No fue posible obtener el contenedor."
    );
  }
}


export async function obtenerOpcionesContenedor(
  req,
  res
) {
  try {
    const opciones =
      await obtenerOpcionesFormularioContenedor();

    return res.status(200).json({
      ok: true,
      datos:
        opciones,
    });
  } catch (error) {
    return responderErrorContenedor(
      error,
      res,
      "No fue posible cargar las opciones del contenedor."
    );
  }
}

export async function crearContenedor(
  req,
  res
) {
  try {
    const contenedor =
      await registrarContenedor(
        req.body
      );

    return res.status(201).json({
      ok: true,

      mensaje:
        "Contenedor registrado correctamente.",

      datos:
        contenedor,
    });
  } catch (error) {

    if (error.code === "23505") {
      return res.status(409).json({
        ok: false,
        mensaje:
          "Ya existe un contenedor con ese código.",
      });
    }


    if (error.code === "23514") {
      return res.status(400).json({
        ok: false,
        mensaje:
          "El peso del contenedor debe ser mayor que cero.",
      });
    }


    return responderErrorContenedor(
      error,
      res,
      "No fue posible registrar el contenedor."
    );
  }
}

export async function actualizarContenedor(
  req,
  res
) {
  try {
    const contenedor =
      await editarContenedor(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      ok: true,

      mensaje:
        "Contenedor actualizado correctamente.",

      datos:
        contenedor,
    });
  } catch (error) {

    if (
      error.code === "23505"
    ) {
      return res.status(409).json({
        ok: false,

        mensaje:
          "Ya existe un contenedor con ese código.",
      });
    }


    if (
      error.code === "23514"
    ) {
      return res.status(400).json({
        ok: false,

        mensaje:
          "El peso del contenedor debe ser mayor que cero.",
      });
    }


    return responderErrorContenedor(
      error,
      res,
      "No fue posible actualizar el contenedor."
    );
  }
}