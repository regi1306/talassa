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


export async function obtenerBuques() {
  const respuesta = await fetch(
    `${URL_API}/buques`
  );

  const resultado =
    await procesarRespuesta(
      respuesta
    );

  return resultado.datos;
}


export async function obtenerBuquePorId(
  idBuque
) {
  const respuesta = await fetch(
    `${URL_API}/buques/${idBuque}`
  );

  const resultado =
    await procesarRespuesta(
      respuesta
    );

  return resultado.datos;
}


export async function obtenerOpcionesFormularioBuque() {
  const respuesta = await fetch(
    `${URL_API}/buques/opciones-formulario`
  );

  const resultado =
    await procesarRespuesta(
      respuesta
    );

  return resultado.datos;
}


export async function registrarBuque(
  datosBuque
) {
  const respuesta = await fetch(
    `${URL_API}/buques`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        datosBuque
      ),
    }
  );

  return await procesarRespuesta(
    respuesta
  );
}


export async function actualizarBuque(
  idBuque,
  datosBuque
) {
  const respuesta = await fetch(
    `${URL_API}/buques/${idBuque}`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        datosBuque
      ),
    }
  );

  return await procesarRespuesta(
    respuesta
  );
}


export async function cambiarEstadoBuque(
  idBuque,
  activo
) {
  const respuesta = await fetch(
    `${URL_API}/buques/${idBuque}/estado`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        activo,
      }),
    }
  );

  const resultado =
    await procesarRespuesta(
      respuesta
    );

  return resultado.datos;
}