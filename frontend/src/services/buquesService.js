const URL_API = "http://localhost:3000/api";


export async function obtenerBuques() {
  const respuesta = await fetch(
    `${URL_API}/buques`
  );

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      resultado.mensaje ||
      "No fue posible obtener los buques."
    );
  }

  return resultado.datos;
}