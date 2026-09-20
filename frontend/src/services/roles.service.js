import axios from "axios";

import {
  obtenerToken,
} from "./auth.service.js";


const API_URL =
  "http://localhost:3000/api/roles";


function obtenerConfiguracion() {
  const token =
    obtenerToken();


  return {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };
}


export async function listarRoles() {
  const respuesta =
    await axios.get(
      API_URL,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


export async function listarPermisos() {
  const respuesta =
    await axios.get(
      `${API_URL}/permisos`,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


export async function obtenerPermisosRol(
  idRol
) {
  const respuesta =
    await axios.get(
      `${API_URL}/${idRol}/permisos`,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


export async function actualizarPermisosRol(
  idRol,
  permisos
) {
  const respuesta =
    await axios.put(
      `${API_URL}/${idRol}/permisos`,
      {
        permisos,
      },
      obtenerConfiguracion()
    );


  return respuesta.data;
}