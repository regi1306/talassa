import {
  actualizarEstadoUsuario,
  editarUsuario,
  obtenerUsuario,
  obtenerUsuarios,
  registrarUsuario,
} from "../services/usuarios.service.js";


/* ======================================
   MANEJO DE ERRORES
====================================== */

function responderError(
  res,
  error
) {
  const statusCode =
    error.statusCode || 500;


  if (
    statusCode === 500
  ) {
    console.error(
      "Error en usuarios:",
      error
    );
  }


  return res
    .status(statusCode)
    .json({
      ok: false,
      message:
        statusCode === 500
          ? "Ocurrió un error interno en el servidor."
          : error.message,
    });
}


/* ======================================
   LISTAR
====================================== */

export async function listar(
  req,
  res
) {
  try {
    const usuarios =
      await obtenerUsuarios();


    return res.json({
      ok: true,
      data: usuarios,
    });

  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* ======================================
   OBTENER POR ID
====================================== */

export async function obtenerPorId(
  req,
  res
) {
  try {
    const usuario =
      await obtenerUsuario(
        req.params.id
      );


    return res.json({
      ok: true,
      data: usuario,
    });

  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* ======================================
   CREAR
====================================== */

export async function crear(
  req,
  res
) {
  try {
    const usuario =
      await registrarUsuario(
        req.body
      );


    return res
      .status(201)
      .json({
        ok: true,

        message:
          "Usuario registrado correctamente.",

        data: usuario,
      });

  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* ======================================
   EDITAR
====================================== */

export async function actualizar(
  req,
  res
) {
  try {
    const usuario =
      await editarUsuario(
        req.params.id,
        req.body
      );


    return res.json({
      ok: true,

      message:
        "Usuario actualizado correctamente.",

      data: usuario,
    });

  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* ======================================
   ACTIVAR / DESACTIVAR
====================================== */

export async function cambiarEstado(
  req,
  res
) {
  try {
    const {
      activo,
    } = req.body;


    const usuario =
      await actualizarEstadoUsuario(
        req.params.id,
        activo,
        req.usuario?.id_usuario
      );


    return res.json({
      ok: true,

      message:
        activo
          ? "Usuario activado correctamente."
          : "Usuario desactivado correctamente.",

      data: usuario,
    });

  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}