import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  actualizarUltimoAcceso,
  buscarUsuarioPorLogin,
  obtenerUsuarioPorId,
  registrarLoginAuditoria,
} from "../repositories/auth.repository.js";


export async function iniciarSesion(
  identificador,
  password
) {

  const usuario =
    await buscarUsuarioPorLogin(
      identificador
    );


  if (!usuario) {

    const error =
      new Error(
        "Usuario o contraseña incorrectos."
      );

    error.statusCode = 401;

    throw error;
  }


  if (!usuario.activo) {

    const error =
      new Error(
        "La cuenta se encuentra inactiva."
      );

    error.statusCode = 403;

    throw error;
  }


  const passwordValida =
    await bcrypt.compare(
      password,
      usuario.password_hash
    );


  if (!passwordValida) {

    const error =
      new Error(
        "Usuario o contraseña incorrectos."
      );

    error.statusCode = 401;

    throw error;
  }


  const token =
    jwt.sign(
      {
        id_usuario:
          usuario.id_usuario,

        id_rol:
          usuario.id_rol,

        rol:
          usuario.rol,

        nombre_usuario:
          usuario.nombre_usuario,
      },

      process.env.JWT_SECRET,

      {
        expiresIn:
          process.env.JWT_EXPIRES_IN
          || "8h",
      }
    );


  await actualizarUltimoAcceso(
    usuario.id_usuario
  );


  await registrarLoginAuditoria(
    usuario.id_usuario
  );


  return {
    token,

    usuario: {
      id_usuario:
        usuario.id_usuario,

      nombres:
        usuario.nombres,

      apellidos:
        usuario.apellidos,

      correo:
        usuario.correo,

      nombre_usuario:
        usuario.nombre_usuario,

      id_rol:
        usuario.id_rol,

      rol:
        usuario.rol,
    },
  };
}


export async function obtenerPerfil(
  idUsuario
) {

  const usuario =
    await obtenerUsuarioPorId(
      idUsuario
    );


  if (!usuario) {

    const error =
      new Error(
        "Usuario no encontrado."
      );

    error.statusCode = 404;

    throw error;
  }


  return usuario;
}