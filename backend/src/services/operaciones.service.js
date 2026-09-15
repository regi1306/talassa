import {
  actualizarOperacionPorId,
  consultarOpcionesFormularioOperacion,
  existeBuqueActivo,
  existeTipoCarga,
  insertarOperacion,
  obtenerOperacionPorId,
  obtenerTodasLasOperaciones,
} from "../repositories/operaciones.repository.js";


function crearError(
  mensaje,
  estadoHttp
) {
  const error =
    new Error(mensaje);

  error.estadoHttp =
    estadoHttp;

  return error;
}


function validarIdOperacion(
  idOperacion
) {
  const id =
    Number(idOperacion);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw crearError(
      "El identificador de la operación no es válido.",
      400
    );
  }

  return id;
}


async function prepararDatosOperacion(
  datos = {}
) {
  const idBuque =
    Number(datos.id_buque);

  const idTipoCarga =
    Number(datos.id_tipo_carga);


  const procedencia =
    typeof datos.procedencia === "string"
      ? datos.procedencia.trim()
      : "";


  const destino =
    typeof datos.destino === "string"
      ? datos.destino.trim()
      : "";


  const observaciones =
    typeof datos.observaciones === "string" &&
    datos.observaciones.trim()
      ? datos.observaciones.trim()
      : null;


  if (
    !Number.isInteger(idBuque) ||
    idBuque <= 0
  ) {
    throw crearError(
      "Debe seleccionar un buque válido.",
      400
    );
  }


  if (
    !Number.isInteger(idTipoCarga) ||
    idTipoCarga <= 0
  ) {
    throw crearError(
      "Debe seleccionar un tipo de carga válido.",
      400
    );
  }


  if (!procedencia) {
    throw crearError(
      "La procedencia es obligatoria.",
      400
    );
  }


  if (!destino) {
    throw crearError(
      "El destino es obligatorio.",
      400
    );
  }


  if (!datos.llegada_estimada) {
    throw crearError(
      "La llegada estimada es obligatoria.",
      400
    );
  }


  if (!datos.salida_estimada) {
    throw crearError(
      "La salida estimada es obligatoria.",
      400
    );
  }


  const llegadaEstimada =
    new Date(
      datos.llegada_estimada
    );


  const salidaEstimada =
    new Date(
      datos.salida_estimada
    );


  if (
    Number.isNaN(
      llegadaEstimada.getTime()
    )
  ) {
    throw crearError(
      "La fecha de llegada estimada no es válida.",
      400
    );
  }


  if (
    Number.isNaN(
      salidaEstimada.getTime()
    )
  ) {
    throw crearError(
      "La fecha de salida estimada no es válida.",
      400
    );
  }


  if (
    salidaEstimada <=
    llegadaEstimada
  ) {
    throw crearError(
      "La salida estimada debe ser posterior a la llegada estimada.",
      400
    );
  }


  const [
    buqueValido,
    tipoCargaValido,
  ] = await Promise.all([
    existeBuqueActivo(
      idBuque
    ),

    existeTipoCarga(
      idTipoCarga
    ),
  ]);


  if (!buqueValido) {
    throw crearError(
      "El buque seleccionado no existe o está inactivo.",
      400
    );
  }


  if (!tipoCargaValido) {
    throw crearError(
      "El tipo de carga seleccionado no existe.",
      400
    );
  }


  return {
    id_buque:
      idBuque,

    id_tipo_carga:
      idTipoCarga,

    procedencia,

    destino,

    llegada_estimada:
      llegadaEstimada.toISOString(),

    salida_estimada:
      salidaEstimada.toISOString(),

    observaciones,
  };
}


export async function listarOperaciones() {
  return await obtenerTodasLasOperaciones();
}


export async function obtenerDetalleOperacion(
  idOperacion
) {
  const id =
    validarIdOperacion(
      idOperacion
    );


  const operacion =
    await obtenerOperacionPorId(id);


  if (!operacion) {
    throw crearError(
      "La operación solicitada no existe.",
      404
    );
  }


  return operacion;
}


export async function obtenerOpcionesFormularioOperacion() {
  return await consultarOpcionesFormularioOperacion();
}


export async function registrarOperacion(
  datos = {}
) {
  const datosPreparados =
    await prepararDatosOperacion(
      datos
    );


  const operacionCreada =
    await insertarOperacion(
      datosPreparados
    );


  return await obtenerOperacionPorId(
    operacionCreada.id_operacion
  );
}


export async function editarOperacion(
  idOperacion,
  datos = {}
) {
  const id =
    validarIdOperacion(
      idOperacion
    );


  const operacionActual =
    await obtenerOperacionPorId(id);


  if (!operacionActual) {
    throw crearError(
      "La operación que desea editar no existe.",
      404
    );
  }


  if (
    operacionActual.estado ===
    "Finalizada"
  ) {
    throw crearError(
      "Una operación finalizada no puede ser editada.",
      400
    );
  }


  const datosPreparados =
    await prepararDatosOperacion(
      datos
    );


  await actualizarOperacionPorId(
    id,
    datosPreparados
  );


  return await obtenerOperacionPorId(
    id
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