import {
  obtenerToken,
} from "./auth.service.js";


const URL_API =
  "http://localhost:3000/api";


/* ======================================
   HEADERS
====================================== */

function obtenerHeaders(
  incluirJson = false
) {
  const token =
    obtenerToken();


  const headers = {};


  if (incluirJson) {
    headers["Content-Type"] =
      "application/json";
  }


  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }


  return headers;
}


/* ======================================
   PROCESAR RESPUESTA
====================================== */

async function procesarRespuesta(
  respuesta
) {
  const resultado =
    await respuesta.json();


  if (!respuesta.ok) {
    throw new Error(
      resultado.mensaje ||
      resultado.message ||
      "Ocurrió un error al procesar la solicitud."
    );
  }


  return resultado;
}


/* ======================================
   LISTAR
====================================== */

export async function obtenerBuques() {
  const respuesta =
    await fetch(
      `${URL_API}/buques`,
      {
        headers:
          obtenerHeaders(),
      }
    );


  const resultado =
    await procesarRespuesta(
      respuesta
    );


  return resultado.datos;
}


/* ======================================
   DETALLE
====================================== */

export async function obtenerBuquePorId(
  idBuque
) {
  const respuesta =
    await fetch(
      `${URL_API}/buques/${idBuque}`,
      {
        headers:
          obtenerHeaders(),
      }
    );


  const resultado =
    await procesarRespuesta(
      respuesta
    );


  return resultado.datos;
}


/* ======================================
   OPCIONES DEL FORMULARIO
====================================== */

export async function obtenerOpcionesFormularioBuque() {
  const respuesta =
    await fetch(
      `${URL_API}/buques/opciones-formulario`,
      {
        headers:
          obtenerHeaders(),
      }
    );


  const resultado =
    await procesarRespuesta(
      respuesta
    );


  return resultado.datos;
}


/* ======================================
   CREAR
====================================== */

export async function registrarBuque(
  datosBuque
) {
  const respuesta =
    await fetch(
      `${URL_API}/buques`,
      {
        method: "POST",

        headers:
          obtenerHeaders(
            true
          ),

        body:
          JSON.stringify(
            datosBuque
          ),
      }
    );


  return await procesarRespuesta(
    respuesta
  );
}


/* ======================================
   EDITAR
====================================== */

export async function actualizarBuque(
  idBuque,
  datosBuque
) {
  const respuesta =
    await fetch(
      `${URL_API}/buques/${idBuque}`,
      {
        method: "PUT",

        headers:
          obtenerHeaders(
            true
          ),

        body:
          JSON.stringify(
            datosBuque
          ),
      }
    );


  return await procesarRespuesta(
    respuesta
  );
}


/* ======================================
   CAMBIAR ESTADO
====================================== */

export async function cambiarEstadoBuque(
  idBuque,
  activo
) {
  const respuesta =
    await fetch(
      `${URL_API}/buques/${idBuque}/estado`,
      {
        method: "PATCH",

        headers:
          obtenerHeaders(
            true
          ),

        body:
          JSON.stringify({
            activo,
          }),
      }
    );


  const resultado =
    await procesarRespuesta(
      respuesta
    );


  return resultado.datos;
}