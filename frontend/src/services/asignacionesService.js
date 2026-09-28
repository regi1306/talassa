import axios from "axios";

import {
  obtenerToken,
} from "./auth.service.js";


const API_URL =
  "http://localhost:3000/api/asignaciones";


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
   EVALUAR MUELLES
====================================== */

export async function evaluarMuelles(
  idOperacion
) {
  const respuesta =
    await axios.get(
      `${API_URL}/evaluar/${idOperacion}`,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   CONFIRMAR ASIGNACIÓN
====================================== */

export async function confirmarAsignacionMuelle(
  datos
) {
  const respuesta =
    await axios.post(
      `${API_URL}/confirmar`,
      datos,
      obtenerConfiguracion()
    );


  return respuesta.data;
}