import axios from "axios";

import {
  obtenerToken,
} from "./auth.service.js";


const API_URL =
  "http://localhost:3000/api/usuarios";


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


/* ======================================
   LISTAR
====================================== */

export async function listarUsuarios() {
  const respuesta =
    await axios.get(
      API_URL,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   OBTENER POR ID
====================================== */

export async function obtenerUsuario(
  idUsuario
) {
  const respuesta =
    await axios.get(
      `${API_URL}/${idUsuario}`,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   CREAR
====================================== */

export async function crearUsuario(
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
   EDITAR
====================================== */

export async function actualizarUsuario(
  idUsuario,
  datos
) {
  const respuesta =
    await axios.put(
      `${API_URL}/${idUsuario}`,
      datos,
      obtenerConfiguracion()
    );


  return respuesta.data;
}


/* ======================================
   CAMBIAR ESTADO
====================================== */

export async function cambiarEstadoUsuario(
  idUsuario,
  activo
) {
  const respuesta =
    await axios.patch(
      `${API_URL}/${idUsuario}/estado`,
      {
        activo,
      },
      obtenerConfiguracion()
    );


  return respuesta.data;
}