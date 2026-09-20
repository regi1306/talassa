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


export async function obtenerContenedores() {
  const respuesta =
    await fetch(
      `${URL_API}/contenedores`
    );

  const resultado =
    await procesarRespuesta(
      respuesta
    );

  return resultado.datos;
}


export async function obtenerContenedorPorId(
  idContenedor
) {
  const respuesta =
    await fetch(
      `${URL_API}/contenedores/${idContenedor}`
    );

  const resultado =
    await procesarRespuesta(
      respuesta
    );

  return resultado.datos;
}


export async function obtenerOpcionesFormularioContenedor() {
  const respuesta =
    await fetch(
      `${URL_API}/contenedores/opciones-formulario`
    );

  const resultado =
    await procesarRespuesta(
      respuesta
    );

  return resultado.datos;
}

export async function registrarContenedor(
  datosContenedor
) {
  const respuesta =
    await fetch(
      `${URL_API}/contenedores`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          datosContenedor
        ),
      }
    );

  return await procesarRespuesta(
    respuesta
  );
}

export async function actualizarContenedor(
  idContenedor,
  datosContenedor
) {
  const respuesta =
    await fetch(
      `${URL_API}/contenedores/${idContenedor}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          datosContenedor
        ),
      }
    );

  return await procesarRespuesta(
    respuesta
  );
}