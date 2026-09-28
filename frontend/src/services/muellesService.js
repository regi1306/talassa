import axios from "axios";

import {
  obtenerToken,
} from "./auth.service.js";


const API_URL =
  "http://localhost:3000/api/muelles";


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
   LISTAR MUELLES
====================================== */

export async function obtenerMuelles() {
  const respuesta =
    await axios.get(
      API_URL,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   OBTENER MUELLE POR ID
====================================== */

export async function obtenerMuellePorId(
  idMuelle
) {
  const respuesta =
    await axios.get(
      `${API_URL}/${idMuelle}`,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   REGISTRAR MUELLE
====================================== */

export async function crearMuelle(
  datosMuelle
) {
  const respuesta =
    await axios.post(
      API_URL,
      datosMuelle,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   ACTUALIZAR MUELLE
====================================== */

export async function actualizarMuelle(
  idMuelle,
  datosMuelle
) {
  const respuesta =
    await axios.put(
      `${API_URL}/${idMuelle}`,
      datosMuelle,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   ELIMINAR MUELLE
====================================== */

export async function eliminarMuelle(
  idMuelle
) {
  const respuesta =
    await axios.delete(
      `${API_URL}/${idMuelle}`,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   OPCIONES DEL FORMULARIO
====================================== */

export async function obtenerOpcionesFormularioMuelle() {
  const respuesta =
    await axios.get(
      `${API_URL}/opciones-formulario`,
      obtenerConfiguracion()
    );


  return respuesta.data;
}