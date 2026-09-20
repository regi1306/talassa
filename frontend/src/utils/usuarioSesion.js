import {
  obtenerUsuarioGuardado,
} from "../services/auth.service.js";

/* ======================================
   NORMALIZAR ROL
====================================== */

export function obtenerRolUsuario(
  usuario
) {
  if (!usuario) {
    return "";
  }


  const rol =
    usuario.rol?.nombre ??
    usuario.rol_nombre ??
    usuario.nombre_rol ??
    usuario.rol ??
    usuario.tipo_rol ??
    "";


  const texto =
    String(rol)
      .trim()
      .toLowerCase();


  if (
    texto.includes(
      "administrador"
    )
  ) {
    return "Administrador";
  }


  if (
    texto.includes(
      "inspector"
    )
  ) {
    return "Inspector";
  }


  if (
    texto.includes(
      "operador"
    )
  ) {
    return "Operador portuario";
  }


  return String(rol);
}


/* ======================================
   OBTENER NOMBRE COMPLETO
====================================== */

export function obtenerNombreUsuario(
  usuario
) {
  if (!usuario) {
    return "Usuario";
  }


  if (
    usuario.nombre_completo
  ) {
    return usuario.nombre_completo;
  }


  if (
    usuario.nombre
  ) {
    return usuario.nombre;
  }


  const nombres =
    usuario.nombres ??
    usuario.nombre_usuario ??
    "";


  const apellidos =
    usuario.apellidos ??
    "";


  const nombreCompleto =
    `${nombres} ${apellidos}`
      .trim();


  return (
    nombreCompleto ||
    usuario.nombre_usuario ||
    "Usuario"
  );
}


/* ======================================
   CORREO
====================================== */

export function obtenerCorreoUsuario(
  usuario
) {
  return (
    usuario?.correo ??
    usuario?.email ??
    usuario?.correo_electronico ??
    ""
  );
}


/* ======================================
   INICIALES
====================================== */

export function obtenerInicialesUsuario(
  usuario
) {
  const nombre =
    obtenerNombreUsuario(
      usuario
    );


  const palabras =
    nombre
      .split(" ")
      .filter(Boolean);


  if (
    palabras.length === 1
  ) {
    return palabras[0]
      .slice(0, 2)
      .toUpperCase();
  }


  return (
    `${palabras[0][0]}${
      palabras[
        palabras.length - 1
      ][0]
    }`
  ).toUpperCase();
}


/* ======================================
   SESIÓN COMPLETA PARA UI
====================================== */

export function obtenerDatosSesion() {
  const usuario =
    obtenerUsuarioGuardado();


  if (!usuario) {
    return null;
  }


  return {
    ...usuario,

    nombreMostrar:
      obtenerNombreUsuario(
        usuario
      ),

    rolMostrar:
      obtenerRolUsuario(
        usuario
      ),

    correoMostrar:
      obtenerCorreoUsuario(
        usuario
      ),

    iniciales:
      obtenerInicialesUsuario(
        usuario
      ),
  };
}