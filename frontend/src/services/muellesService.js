import axios from "axios";


const API_URL =
  "http://localhost:3000/api/muelles";


/* ======================================
   LISTAR MUELLES
====================================== */

export async function obtenerMuelles() {
  const respuesta =
    await axios.get(API_URL);

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
      `${API_URL}/${idMuelle}`
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
      datosMuelle
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
      datosMuelle
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
      `${API_URL}/${idMuelle}`
    );

  return respuesta.data;
}

/* ======================================
   OPCIONES DEL FORMULARIO
====================================== */

export async function obtenerOpcionesFormularioMuelle() {
  const respuesta =
    await axios.get(
      `${API_URL}/opciones-formulario`
    );

  return respuesta.data;
}