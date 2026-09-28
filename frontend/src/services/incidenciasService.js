import axios from "axios";

import {
  obtenerToken,
} from "./auth.service.js";


const API_URL =
  "http://localhost:3000/api/incidencias";


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
   LISTAR INCIDENCIAS
====================================== */

export async function obtenerIncidencias() {
  const respuesta =
    await axios.get(
      API_URL,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   OBTENER INCIDENCIA
====================================== */

export async function obtenerIncidenciaPorId(
  id
) {
  const respuesta =
    await axios.get(
      `${API_URL}/${id}`,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   OPCIONES DEL FORMULARIO
====================================== */

export async function obtenerOpcionesIncidencia() {
  const respuesta =
    await axios.get(
      `${API_URL}/opciones-formulario`,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   CREAR
====================================== */

export async function crearIncidencia(
  datos
) {
  const respuesta =
    await axios.post(
      API_URL,
      datos,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   ACTUALIZAR
====================================== */

export async function actualizarIncidencia(
  id,
  datos
) {
  const respuesta =
    await axios.put(
      `${API_URL}/${id}`,
      datos,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   CAMBIAR ESTADO
====================================== */

export async function cambiarEstadoIncidencia(
  id,
  datos
) {
  const respuesta =
    await axios.patch(
      `${API_URL}/${id}/estado`,
      datos,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   AGREGAR SEGUIMIENTO
====================================== */

export async function agregarSeguimientoIncidencia(
  id,
  datos
) {
  const respuesta =
    await axios.post(
      `${API_URL}/${id}/seguimiento`,
      datos,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   ELIMINAR
====================================== */

export async function eliminarIncidencia(
  id
) {
  const respuesta =
    await axios.delete(
      `${API_URL}/${id}`,
      obtenerConfiguracion()
    );


  return respuesta.data;
}