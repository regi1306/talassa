const URL_API =
  "http://localhost:3000/api";


async function procesarRespuesta(
  respuesta
) {
  const datos =
    await respuesta.json();


  if (!respuesta.ok) {
    throw new Error(
      datos.mensaje ||
      "Ocurrió un error al consultar el Dashboard."
    );
  }


  return datos;
}


export async function obtenerResumenDashboard() {
  const respuesta =
    await fetch(
      `${URL_API}/dashboard/resumen`
    );


  const resultado =
    await procesarRespuesta(
      respuesta
    );


  return resultado.datos;
}