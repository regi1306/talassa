import axios from "axios";

import {
  obtenerToken,
} from "./auth.service.js";


const API_URL =
  "http://localhost:3000/api/auditoria";


function configuracion() {
  const token =
    obtenerToken();


  return {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };
}


export async function listarAuditoria() {
  const respuesta =
    await axios.get(
      API_URL,
      configuracion()
    );


  return respuesta.data;
}


export async function obtenerDetalleAuditoria(
  idAuditoria
) {
  const respuesta =
    await axios.get(
      `${API_URL}/${idAuditoria}`,
      configuracion()
    );


  return respuesta.data;
}