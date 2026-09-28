import {
  obtenerToken,
} from "./auth.service.js";


const URL_API =
  "http://localhost:3000/api";


/* ======================================
   HEADERS DE AUTENTICACIÓN
====================================== */

function obtenerHeaders(
  incluirJson = false
) {
  const token =
    obtenerToken();


  const headers = {};


  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }


  if (incluirJson) {
    headers["Content-Type"] =
      "application/json";
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
      resultado.message
      ||
      resultado.mensaje
      ||
      "Ocurrió un error al procesar la solicitud."
    );
  }


  return resultado;
}


/* ======================================
   LISTAR CONTENEDORES
====================================== */

export async function obtenerContenedores() {
  const respuesta =
    await fetch(
      `${URL_API}/contenedores`,
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
   OBTENER POR ID
====================================== */

export async function obtenerContenedorPorId(
  idContenedor
) {
  const respuesta =
    await fetch(
      `${URL_API}/contenedores/${idContenedor}`,
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

export async function obtenerOpcionesFormularioContenedor() {
  const respuesta =
    await fetch(
      `${URL_API}/contenedores/opciones-formulario`,
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
   REGISTRAR
====================================== */

export async function registrarContenedor(
  datosContenedor
) {
  const respuesta =
    await fetch(
      `${URL_API}/contenedores`,
      {
        method: "POST",

        headers:
          obtenerHeaders(
            true
          ),

        body:
          JSON.stringify(
            datosContenedor
          ),
      }
    );


  return await procesarRespuesta(
    respuesta
  );
}


/* ======================================
   ACTUALIZAR
====================================== */

export async function actualizarContenedor(
  idContenedor,
  datosContenedor
) {
  const respuesta =
    await fetch(
      `${URL_API}/contenedores/${idContenedor}`,
      {
        method: "PUT",

        headers:
          obtenerHeaders(
            true
          ),

        body:
          JSON.stringify(
            datosContenedor
          ),
      }
    );


  return await procesarRespuesta(
    respuesta
  );
}