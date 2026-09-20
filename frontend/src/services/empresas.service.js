import axios from "axios";

import {
  obtenerToken,
} from "./auth.service.js";


const API_URL =
  "http://localhost:3000/api/empresas";


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


export async function listarEmpresas() {
  const respuesta =
    await axios.get(
      API_URL,
      configuracion()
    );


  return respuesta.data;
}


export async function crearEmpresa(
  datos
) {
  const respuesta =
    await axios.post(
      API_URL,
      datos,
      configuracion()
    );


  return respuesta.data;
}


export async function actualizarEmpresa(
  idEmpresa,
  datos
) {
  const respuesta =
    await axios.put(
      `${API_URL}/${idEmpresa}`,
      datos,
      configuracion()
    );


  return respuesta.data;
}


export async function cambiarEstadoEmpresa(
  idEmpresa,
  activo
) {
  const respuesta =
    await axios.patch(
      `${API_URL}/${idEmpresa}/estado`,
      {
        activo,
      },
      configuracion()
    );


  return respuesta.data;
}