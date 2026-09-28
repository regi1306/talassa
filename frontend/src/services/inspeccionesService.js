import axios from "axios";

import {
  obtenerToken,
} from "./auth.service.js";


const API_URL =
  "http://localhost:3000/api/inspecciones";


/* ======================================
   CONFIGURACIÓN AUTENTICADA
====================================== */

function obtenerConfiguracion() {
  const token =
    obtenerToken();


  const headers = {};


  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }


  return {
    headers,
  };
}


/* ======================================
   LISTAR INSPECCIONES
====================================== */

export async function obtenerInspecciones() {
  const respuesta =
    await axios.get(
      API_URL,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   OBTENER UNA INSPECCIÓN
====================================== */

export async function obtenerInspeccionPorId(
  idInspeccion
) {
  const respuesta =
    await axios.get(
      `${API_URL}/${idInspeccion}`,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   OPCIONES DEL FORMULARIO
====================================== */

export async function obtenerOpcionesInspeccion() {
  const respuesta =
    await axios.get(
      `${API_URL}/opciones-formulario`,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   CREAR INSPECCIÓN
====================================== */

export async function crearInspeccion(
  datosInspeccion
) {
  const respuesta =
    await axios.post(
      API_URL,
      datosInspeccion,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   ACTUALIZAR INSPECCIÓN
====================================== */

export async function actualizarInspeccion(
  idInspeccion,
  datosInspeccion
) {
  const respuesta =
    await axios.put(
      `${API_URL}/${idInspeccion}`,
      datosInspeccion,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   ELIMINAR INSPECCIÓN
====================================== */

export async function eliminarInspeccion(
  idInspeccion
) {
  const respuesta =
    await axios.delete(
      `${API_URL}/${idInspeccion}`,
      obtenerConfiguracion()
    );


  return respuesta.data;
}