import bcrypt from "bcryptjs";

import {
  actualizarUsuario,
  buscarCorreoExistente,
  buscarNombreUsuarioExistente,
  buscarRolPorNombre,
  buscarUsuarioPorId,
  cambiarEstadoUsuario,
  crearUsuario,
  listarUsuarios,
} from "../repositories/usuarios.repository.js";


/* ======================================
   ERROR DE NEGOCIO
====================================== */

function crearError(
  mensaje,
  statusCode
) {
  const error =
    new Error(mensaje);

  error.statusCode =
    statusCode;

  return error;
}


/* ======================================
   VALIDAR CORREO
====================================== */

function correoValido(
  correo
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(correo);
}


/* ======================================
   LISTAR
====================================== */

export async function obtenerUsuarios() {
  return listarUsuarios();
}


/* ======================================
   OBTENER UNO
====================================== */

export async function obtenerUsuario(
  idUsuario
) {
  const usuario =
    await buscarUsuarioPorId(
      idUsuario
    );


  if (!usuario) {
    throw crearError(
      "Usuario no encontrado.",
      404
    );
  }


  return usuario;
}


/* ======================================
   VALIDACIONES COMUNES
====================================== */

async function validarDatosUsuario(
  datos,
  idExcluir = null
) {
  const nombres =
    String(
      datos.nombres ?? ""
    ).trim();


  const apellidos =
    String(
      datos.apellidos ?? ""
    ).trim();


  const correo =
    String(
      datos.correo ?? ""
    )
      .trim()
      .toLowerCase();


  const usuario =
    String(
      datos.usuario ?? ""
    )
      .trim()
      .toLowerCase();


  const rol =
    String(
      datos.rol ?? ""
    ).trim();


  if (!nombres) {
    throw crearError(
      "Los nombres son obligatorios.",
      400
    );
  }


  if (!apellidos) {
    throw crearError(
      "Los apellidos son obligatorios.",
      400
    );
  }


  if (!correo) {
    throw crearError(
      "El correo es obligatorio.",
      400
    );
  }


  if (!correoValido(correo)) {
    throw crearError(
      "Ingrese un correo electrónico válido.",
      400
    );
  }


  if (!usuario) {
    throw crearError(
      "El nombre de usuario es obligatorio.",
      400
    );
  }


  if (!rol) {
    throw crearError(
      "Debe seleccionar un rol.",
      400
    );
  }


  const rolEncontrado =
    await buscarRolPorNombre(
      rol
    );


  if (!rolEncontrado) {
    throw crearError(
      "El rol seleccionado no existe.",
      400
    );
  }


  const correoExistente =
    await buscarCorreoExistente(
      correo,
      idExcluir
    );


  if (correoExistente) {
    throw crearError(
      "Ya existe un usuario registrado con ese correo.",
      409
    );
  }


  const usuarioExistente =
    await buscarNombreUsuarioExistente(
      usuario,
      idExcluir
    );


  if (usuarioExistente) {
    throw crearError(
      "Ese nombre de usuario ya está en uso.",
      409
    );
  }


  return {
    nombres,
    apellidos,
    correo,
    usuario,
    rolEncontrado,
  };
}


/* ======================================
   CREAR
====================================== */

export async function registrarUsuario(
  datos
) {
  const {
    nombres,
    apellidos,
    correo,
    usuario,
    rolEncontrado,
  } =
    await validarDatosUsuario(
      datos
    );


  const password =
    String(
      datos.password ?? ""
    );


  if (!password) {
    throw crearError(
      "La contraseña es obligatoria.",
      400
    );
  }


  if (
    password.length < 8
  ) {
    throw crearError(
      "La contraseña debe tener al menos 8 caracteres.",
      400
    );
  }


  const passwordHash =
    await bcrypt.hash(
      password,
      12
    );


  const activo =
    datos.activo !== false;


  const creado =
    await crearUsuario({
      idRol:
        rolEncontrado.id_rol,

      nombres,
      apellidos,
      correo,
      usuario,
      passwordHash,
      activo,
    });


  return obtenerUsuario(
    creado.id_usuario
  );
}


/* ======================================
   EDITAR
====================================== */

export async function editarUsuario(
  idUsuario,
  datos
) {
  await obtenerUsuario(
    idUsuario
  );


  const {
    nombres,
    apellidos,
    correo,
    usuario,
    rolEncontrado,
  } =
    await validarDatosUsuario(
      datos,
      Number(idUsuario)
    );


  const password =
    String(
      datos.password ?? ""
    );


  let passwordHash =
    null;


  /*
    En edición, password vacío significa
    conservar la contraseña actual.
  */

  if (password) {
    if (
      password.length < 8
    ) {
      throw crearError(
        "La contraseña debe tener al menos 8 caracteres.",
        400
      );
    }


    passwordHash =
      await bcrypt.hash(
        password,
        12
      );
  }


  await actualizarUsuario({
    idUsuario:
      Number(idUsuario),

    idRol:
      rolEncontrado.id_rol,

    nombres,
    apellidos,
    correo,
    usuario,

    passwordHash,

    activo:
      datos.activo !== false,
  });


  return obtenerUsuario(
    idUsuario
  );
}


/* ======================================
   ACTIVAR / DESACTIVAR
====================================== */

export async function actualizarEstadoUsuario(
  idUsuario,
  activo,
  idUsuarioActual
) {
  const usuario =
    await obtenerUsuario(
      idUsuario
    );


  if (
    typeof activo !==
    "boolean"
  ) {
    throw crearError(
      "El estado enviado no es válido.",
      400
    );
  }


  /*
    Evitamos que una persona desactive
    accidentalmente la misma cuenta con
    la que tiene la sesión iniciada.
  */

  if (
    Number(idUsuario) ===
      Number(idUsuarioActual)
    &&
    activo === false
  ) {
    throw crearError(
      "No puede desactivar la cuenta con la que tiene la sesión iniciada.",
      400
    );
  }


  if (
    usuario.activo ===
    activo
  ) {
    return usuario;
  }


  await cambiarEstadoUsuario(
    Number(idUsuario),
    activo
  );


  return obtenerUsuario(
    idUsuario
  );
}