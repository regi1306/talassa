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
   LISTAR OPERACIONES
====================================== */

export async function obtenerOperaciones() {
  const respuesta =
    await fetch(
      `${URL_API}/operaciones`,
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
   OBTENER DETALLE
====================================== */

export async function obtenerOperacionPorId(
  idOperacion
) {
  const respuesta =
    await fetch(
      `${URL_API}/operaciones/${idOperacion}`,
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

export async function obtenerOpcionesFormularioOperacion() {
  const respuesta =
    await fetch(
      `${URL_API}/operaciones/opciones-formulario`,
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
   REGISTRAR OPERACIÓN
====================================== */

export async function registrarOperacion(
  datosOperacion
) {
  const respuesta =
    await fetch(
      `${URL_API}/operaciones`,
      {
        method: "POST",

        headers:
          obtenerHeaders(
            true
          ),

        body:
          JSON.stringify(
            datosOperacion
          ),
      }
    );


  return await procesarRespuesta(
    respuesta
  );
}


/* ======================================
   ACTUALIZAR OPERACIÓN
====================================== */

export async function actualizarOperacion(
  idOperacion,
  datosOperacion
) {
  const respuesta =
    await fetch(
      `${URL_API}/operaciones/${idOperacion}`,
      {
        method: "PUT",

        headers:
          obtenerHeaders(
            true
          ),

        body:
          JSON.stringify(
            datosOperacion
          ),
      }
    );


  return await procesarRespuesta(
    respuesta
  );
}


/* ======================================
   REGISTRAR LLEGADA
====================================== */

export async function registrarLlegadaOperacion(
  idOperacion,
  llegadaReal
) {
  const respuesta =
    await fetch(
      `${URL_API}/operaciones/${idOperacion}/llegada`,
      {
        method: "PATCH",

        headers:
          obtenerHeaders(
            true
          ),

        body:
          JSON.stringify({
            llegada_real:
              llegadaReal,
          }),
      }
    );


  return await procesarRespuesta(
    respuesta
  );
}


/* ======================================
   REGISTRAR SALIDA
====================================== */

export async function registrarSalidaOperacion(
  idOperacion,
  salidaReal
) {
  const respuesta =
    await fetch(
      `${URL_API}/operaciones/${idOperacion}/salida`,
      {
        method: "PATCH",

        headers:
          obtenerHeaders(
            true
          ),

        body:
          JSON.stringify({
            salida_real:
              salidaReal,
          }),
      }
    );


  return await procesarRespuesta(
    respuesta
  );
}