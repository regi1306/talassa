import axios from "axios";


const API_URL = "http://localhost:3000/api/auth";


/* ======================================
   INICIAR SESIÓN
====================================== */

export async function iniciarSesion(
  usuario,
  password
) {
  const respuesta = await axios.post(
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
  const token = obtenerToken();

  if (!token) {
    throw new Error(
      "No existe una sesión activa."
    );
  }

  const respuesta = await axios.get(
    `${API_URL}/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
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
  /*
    Primero eliminamos cualquier sesión
    anterior para evitar tener información
    duplicada en localStorage y sessionStorage.
  */

  cerrarSesion();

  const almacenamiento = recordar
    ? localStorage
    : sessionStorage;

  almacenamiento.setItem(
    "talassa_token",
    token
  );

  almacenamiento.setItem(
    "talassa_usuario",
    JSON.stringify(usuario)
  );
}


/* ======================================
   OBTENER TOKEN
====================================== */

export function obtenerToken() {
  return (
    localStorage.getItem(
      "talassa_token"
    ) ||
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
    ) ||
    sessionStorage.getItem(
      "talassa_usuario"
    );

  if (!usuario) {
    return null;
  }

  try {
    return JSON.parse(usuario);
  } catch {
    return null;
  }
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