import axios from "axios";


const API_URL =
  "http://localhost:3000/api/incidencias";


export async function obtenerIncidencias() {
  const respuesta =
    await axios.get(
      API_URL
    );

  return respuesta.data;
}


export async function obtenerIncidenciaPorId(
  id
) {
  const respuesta =
    await axios.get(
      `${API_URL}/${id}`
    );

  return respuesta.data;
}


export async function obtenerOpcionesIncidencia() {
  const respuesta =
    await axios.get(
      `${API_URL}/opciones-formulario`
    );

  return respuesta.data;
}


export async function crearIncidencia(
  datos
) {
  const respuesta =
    await axios.post(
      API_URL,
      datos
    );

  return respuesta.data;
}


export async function actualizarIncidencia(
  id,
  datos
) {
  const respuesta =
    await axios.put(
      `${API_URL}/${id}`,
      datos
    );

  return respuesta.data;
}


export async function cambiarEstadoIncidencia(
  id,
  datos
) {
  const respuesta =
    await axios.patch(
      `${API_URL}/${id}/estado`,
      datos
    );

  return respuesta.data;
}


export async function agregarSeguimientoIncidencia(
  id,
  datos
) {
  const respuesta =
    await axios.post(
      `${API_URL}/${id}/seguimiento`,
      datos
    );

  return respuesta.data;
}


export async function eliminarIncidencia(
  id
) {
  const respuesta =
    await axios.delete(
      `${API_URL}/${id}`
    );

  return respuesta.data;
}