import {
  consultarOpcionesFormularioContenedor,
  existeCodigoContenedor,
  existeTipoCarga,
  existeTipoContenedorActivo,
  insertarContenedor,
  obtenerContenedorPorId,
  obtenerOperacionHabilitadaParaContenedor,
  obtenerTodosLosContenedores,
  actualizarContenedorPorId,
  existeCodigoContenedorEnOtroRegistro,
} from "../repositories/contenedores.repository.js";


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


function validarIdContenedor(
  idContenedor
) {
  const id =
    Number(idContenedor);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw crearError(
      "El identificador del contenedor no es válido.",
      400
    );
  }

  return id;
}


export async function listarContenedores() {
  return await obtenerTodosLosContenedores();
}


export async function obtenerDetalleContenedor(
  idContenedor
) {
  const id =
    validarIdContenedor(
      idContenedor
    );

  const contenedor =
    await obtenerContenedorPorId(
      id
    );

  if (!contenedor) {
    throw crearError(
      "El contenedor solicitado no existe.",
      404
    );
  }

  return contenedor;
}


export async function obtenerOpcionesFormularioContenedor() {
  return await consultarOpcionesFormularioContenedor();
}

export async function registrarContenedor(
  datos = {}
) {
  const codigo =
    typeof datos.codigo === "string"
      ? datos.codigo
          .trim()
          .toUpperCase()
      : "";

  const idOperacion =
    Number(
      datos.id_operacion
    );

  const idTipoContenedor =
    Number(
      datos.id_tipo_contenedor
    );

  const idTipoCarga =
    Number(
      datos.id_tipo_carga
    );

  const pesoKg =
    Number(
      datos.peso_kg
    );

  const observaciones =
    typeof datos.observaciones === "string" &&
    datos.observaciones.trim()
      ? datos.observaciones.trim()
      : null;


  if (!codigo) {
    throw crearError(
      "El código del contenedor es obligatorio.",
      400
    );
  }


  if (
    !Number.isInteger(idOperacion) ||
    idOperacion <= 0
  ) {
    throw crearError(
      "Debe seleccionar una operación válida.",
      400
    );
  }


  if (
    !Number.isInteger(
      idTipoContenedor
    ) ||
    idTipoContenedor <= 0
  ) {
    throw crearError(
      "Debe seleccionar un tipo de contenedor válido.",
      400
    );
  }


  if (
    !Number.isInteger(
      idTipoCarga
    ) ||
    idTipoCarga <= 0
  ) {
    throw crearError(
      "Debe seleccionar un tipo de carga válido.",
      400
    );
  }


  if (
    !Number.isFinite(pesoKg) ||
    pesoKg <= 0
  ) {
    throw crearError(
      "El peso debe ser mayor que cero.",
      400
    );
  }


  const [
    codigoDuplicado,
    operacion,
    tipoContenedorValido,
    tipoCargaValido,
  ] = await Promise.all([
    existeCodigoContenedor(
      codigo
    ),

    obtenerOperacionHabilitadaParaContenedor(
      idOperacion
    ),

    existeTipoContenedorActivo(
      idTipoContenedor
    ),

    existeTipoCarga(
      idTipoCarga
    ),
  ]);


  if (codigoDuplicado) {
    throw crearError(
      "Ya existe un contenedor registrado con ese código.",
      409
    );
  }


  if (!operacion) {
    throw crearError(
      "La operación seleccionada debe estar En puerto o En operación.",
      400
    );
  }


  if (!tipoContenedorValido) {
    throw crearError(
      "El tipo de contenedor seleccionado no existe o está inactivo.",
      400
    );
  }


  if (!tipoCargaValido) {
    throw crearError(
      "El tipo de carga seleccionado no existe.",
      400
    );
  }


  const contenedorCreado =
    await insertarContenedor({
      codigo,

      id_operacion:
        idOperacion,

      id_tipo_contenedor:
        idTipoContenedor,

      id_tipo_carga:
        idTipoCarga,

      peso_kg:
        pesoKg,

      observaciones,
    });


  return await obtenerContenedorPorId(
    contenedorCreado.id_contenedor
  );
}

export async function editarContenedor(
  idContenedor,
  datos = {}
) {
  const id =
    validarIdContenedor(
      idContenedor
    );


  const contenedorActual =
    await obtenerContenedorPorId(
      id
    );


  if (!contenedorActual) {
    throw crearError(
      "El contenedor que desea editar no existe.",
      404
    );
  }


  if (
    contenedorActual.estado_operacion ===
    "Finalizada"
  ) {
    throw crearError(
      "No se puede editar un contenedor cuya operación está finalizada.",
      400
    );
  }


  const codigo =
    typeof datos.codigo === "string"
      ? datos.codigo
          .trim()
          .toUpperCase()
      : "";


  const idTipoContenedor =
    Number(
      datos.id_tipo_contenedor
    );


  const idTipoCarga =
    Number(
      datos.id_tipo_carga
    );


  const pesoKg =
    Number(
      datos.peso_kg
    );


  const observaciones =
    typeof datos.observaciones === "string" &&
    datos.observaciones.trim()
      ? datos.observaciones.trim()
      : null;


  if (!codigo) {
    throw crearError(
      "El código del contenedor es obligatorio.",
      400
    );
  }


  if (
    !Number.isInteger(
      idTipoContenedor
    ) ||
    idTipoContenedor <= 0
  ) {
    throw crearError(
      "Debe seleccionar un tipo de contenedor válido.",
      400
    );
  }


  if (
    !Number.isInteger(
      idTipoCarga
    ) ||
    idTipoCarga <= 0
  ) {
    throw crearError(
      "Debe seleccionar un tipo de carga válido.",
      400
    );
  }


  if (
    !Number.isFinite(
      pesoKg
    ) ||
    pesoKg <= 0
  ) {
    throw crearError(
      "El peso debe ser mayor que cero.",
      400
    );
  }


  const [
    codigoDuplicado,
    tipoContenedorValido,
    tipoCargaValido,
  ] = await Promise.all([
    existeCodigoContenedorEnOtroRegistro(
      codigo,
      id
    ),

    existeTipoContenedorActivo(
      idTipoContenedor
    ),

    existeTipoCarga(
      idTipoCarga
    ),
  ]);


  if (codigoDuplicado) {
    throw crearError(
      "Ya existe otro contenedor registrado con ese código.",
      409
    );
  }


  if (!tipoContenedorValido) {
    throw crearError(
      "El tipo de contenedor seleccionado no existe o está inactivo.",
      400
    );
  }


  if (!tipoCargaValido) {
    throw crearError(
      "El tipo de carga seleccionado no existe.",
      400
    );
  }


  await actualizarContenedorPorId(
    id,
    {
      codigo,

      id_tipo_contenedor:
        idTipoContenedor,

      id_tipo_carga:
        idTipoCarga,

      peso_kg:
        pesoKg,

      observaciones,
    }
  );


  return await obtenerContenedorPorId(
    id
  );
}