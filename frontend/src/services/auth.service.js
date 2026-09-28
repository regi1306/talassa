import axios from "axios";


const API_URL =
  "http://localhost:3000/api/auth";


/* ======================================
   INICIAR SESIÓN
====================================== */

export async function iniciarSesion(
  usuario,
  password
) {
  const respuesta =
    await axios.post(
      `${API_URL}/login`,
      {
        usuario,
        password,
      }
    );


  return respuesta.data;
}


/* ======================================
   OBTENER PERFIL DEL USUARIO AUTENTICADO
====================================== */

export async function obtenerPerfil() {
  const token =
    obtenerToken();


  if (!token) {
    throw new Error(
      "No existe una sesión activa."
    );
  }


  const respuesta =
    await axios.get(
      `${API_URL}/me`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );


  return respuesta.data;
}


/* ======================================
   GUARDAR SESIÓN
====================================== */

export function guardarSesion(
  token,
  usuario,
  recordar = false
) {
  cerrarSesion();


  const almacenamiento =
    recordar
      ? localStorage
      : sessionStorage;


  almacenamiento.setItem(
    "talassa_token",
    token
  );


  almacenamiento.setItem(
    "talassa_usuario",
    JSON.stringify(
      usuario
    )
  );
}


/* ======================================
   ACTUALIZAR USUARIO GUARDADO

   Actualiza los datos y permisos
   sin borrar el token.
====================================== */

export function actualizarUsuarioGuardado(
  usuario
) {
  if (
    localStorage.getItem(
      "talassa_token"
    )
  ) {
    localStorage.setItem(
      "talassa_usuario",
      JSON.stringify(
        usuario
      )
    );


    sessionStorage.removeItem(
      "talassa_usuario"
    );


    return;
  }


  if (
    sessionStorage.getItem(
      "talassa_token"
    )
  ) {
    sessionStorage.setItem(
      "talassa_usuario",
      JSON.stringify(
        usuario
      )
    );


    localStorage.removeItem(
      "talassa_usuario"
    );
  }
}


/* ======================================
   OBTENER TOKEN
====================================== */

export function obtenerToken() {
  return (
    localStorage.getItem(
      "talassa_token"
    )
    ||
    sessionStorage.getItem(
      "talassa_token"
    )
  );
}


/* ======================================
   OBTENER USUARIO GUARDADO
====================================== */

export function obtenerUsuarioGuardado() {
  const usuario =
    localStorage.getItem(
      "talassa_usuario"
    )
    ||
    sessionStorage.getItem(
      "talassa_usuario"
    );


  if (!usuario) {
    return null;
  }


  try {
    return JSON.parse(
      usuario
    );

  } catch {
    return null;
  }
}


/* ======================================
   COMPROBAR PERMISO
====================================== */

export function tienePermiso(
  codigoPermiso
) {
  const usuario =
    obtenerUsuarioGuardado();


  if (!usuario) {
    return false;
  }


  const permisos =
    Array.isArray(
      usuario.permisos
    )
      ? usuario.permisos
      : [];


  return permisos.includes(
    codigoPermiso
  );
}


/* ======================================
   COMPROBAR SI HAY SESIÓN
====================================== */

export function haySesionActiva() {
  return Boolean(
    obtenerToken()
  );
}


/* ======================================
   CERRAR SESIÓN
====================================== */

export function cerrarSesion() {
  localStorage.removeItem(
    "talassa_token"
  );

  localStorage.removeItem(
    "talassa_usuario"
  );

  sessionStorage.removeItem(
    "talassa_token"
  );

  sessionStorage.removeItem(
    "talassa_usuario"
  );
}