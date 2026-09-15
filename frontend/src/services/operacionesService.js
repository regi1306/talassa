const URL_API =
  "http://localhost:3000/api";


async function procesarRespuesta(
  respuesta
) {
  const resultado =
    await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      resultado.mensaje ||
      "Ocurrió un error al procesar la solicitud."
    );
  }

  return resultado;
}


export async function obtenerOperaciones() {
  const respuesta =
    await fetch(
      `${URL_API}/operaciones`
    );

  const resultado =
    await procesarRespuesta(
      respuesta
    );

  return resultado.datos;
}


export async function obtenerOperacionPorId(
  idOperacion
) {
  const respuesta =
    await fetch(
      `${URL_API}/operaciones/${idOperacion}`
    );

  const resultado =
    await procesarRespuesta(
      respuesta
    );

  return resultado.datos;
}


export async function obtenerOpcionesFormularioOperacion() {
  const respuesta =
    await fetch(
      `${URL_API}/operaciones/opciones-formulario`
    );

  const resultado =
    await procesarRespuesta(
      respuesta
    );

  return resultado.datos;
}


export async function registrarOperacion(
  datosOperacion
) {
  const respuesta =
    await fetch(
      `${URL_API}/operaciones`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          datosOperacion
        ),
      }
    );


  return await procesarRespuesta(
    respuesta
  );
}

export async function actualizarOperacion(
  idOperacion,
  datosOperacion
) {
  const respuesta =
    await fetch(
      `${URL_API}/operaciones/${idOperacion}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          datosOperacion
        ),
      }
    );

  return await procesarRespuesta(
    respuesta
  );
}