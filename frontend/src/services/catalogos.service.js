import axios from "axios";

import {
  obtenerToken,
} from "./auth.service.js";


const API_URL =
  "http://localhost:3000/api/catalogos";


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


export async function listarTodosCatalogos() {
  const respuesta =
    await axios.get(
      API_URL,
      configuracion()
    );


  return respuesta.data;
}


export async function listarCatalogo(
  catalogo
) {
  const respuesta =
    await axios.get(
      `${API_URL}/${catalogo}`,
      configuracion()
    );


  return respuesta.data;
}


export async function crearRegistroCatalogo(
  catalogo,
  datos
) {
  const respuesta =
    await axios.post(
      `${API_URL}/${catalogo}`,
      datos,
      configuracion()
    );


  return respuesta.data;
}


export async function actualizarRegistroCatalogo(
  catalogo,
  idRegistro,
  datos
) {
  const respuesta =
    await axios.put(
      `${API_URL}/${catalogo}/${idRegistro}`,
      datos,
      configuracion()
    );


  return respuesta.data;
}


export async function cambiarEstadoRegistroCatalogo(
  catalogo,
  idRegistro,
  activo
) {
  const respuesta =
    await axios.patch(
      `${API_URL}/${catalogo}/${idRegistro}/estado`,
      {
        activo,
      },
      configuracion()
    );


  return respuesta.data;
}