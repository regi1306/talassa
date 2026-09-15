import {
  iniciarSesion,
  obtenerPerfil,
} from "../services/auth.service.js";


export async function login(
  req,
  res
) {

  try {

    const {
      usuario,
      password,
    } = req.body;


    if (
      !usuario ||
      !password
    ) {

      return res
        .status(400)
        .json({
          ok: false,

          message:
            "Usuario y contraseña son obligatorios.",
        });
    }


    const resultado =
      await iniciarSesion(
        usuario.trim(),
        password
      );


    return res
      .status(200)
      .json({
        ok: true,

        message:
          "Inicio de sesión exitoso.",

        data:
          resultado,
      });

  } catch (error) {

    return res
      .status(
        error.statusCode || 500
      )
      .json({
        ok: false,

        message:
          error.message
          || "Error interno del servidor.",
      });
  }
}


export async function perfilActual(
  req,
  res
) {

  try {

    const usuario =
      await obtenerPerfil(
        req.usuario.id_usuario
      );


    return res
      .status(200)
      .json({
        ok: true,

        data:
          usuario,
      });

  } catch (error) {

    return res
      .status(
        error.statusCode || 500
      )
      .json({
        ok: false,

        message:
          error.message
          || "Error interno del servidor.",
      });
  }
}