import {
  obtenerToken,
} from "./auth.service.js";


const URL_API =
  "http://localhost:3000/api";


async function procesarRespuesta(
  respuesta
) {
  const datos =
    await respuesta.json();


  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
      datos.mensaje ||
      "Ocurrió un error al consultar el Dashboard."
    );
  }


  return datos;
}


export async function obtenerResumenDashboard() {

  const token =
    obtenerToken();


  const respuesta =
    await fetch(
      `${URL_API}/dashboard/resumen`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );


  const resultado =
    await procesarRespuesta(
      respuesta
    );


  return resultado.datos;
}