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

import {
  registrarEventoAuditoria,
} from "./auditoria.service.js";


/* ======================================
   ERROR CONTROLADO
====================================== */

function crearError(
  mensaje,
  estadoHttp
) {
  const error =
    new Error(
      mensaje
    );


  error.estadoHttp =
    estadoHttp;


  return error;
}


/* ======================================
   VALIDAR ID
====================================== */

function validarIdContenedor(
  idContenedor
) {
  const id =
    Number(
      idContenedor
    );


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


/* ======================================
   LISTAR
====================================== */

export async function listarContenedores() {
  return await obtenerTodosLosContenedores();
}


/* ======================================
   DETALLE
====================================== */

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


/* ======================================
   OPCIONES DEL FORMULARIO
====================================== */

export async function obtenerOpcionesFormularioContenedor() {
  return await consultarOpcionesFormularioContenedor();
}


/* ======================================
   REGISTRAR CONTENEDOR
====================================== */

export async function registrarContenedor(
  datos = {},
  idUsuario = null
) {
  const codigo =
    typeof datos.codigo ===
    "string"
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
    typeof datos.observaciones ===
      "string" &&
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
      idOperacion
    ) ||
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
    operacion,
    tipoContenedorValido,
    tipoCargaValido,
  ] =
    await Promise.all([
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


  const contenedor =
    await obtenerContenedorPorId(
      contenedorCreado.id_contenedor
    );


  /* ======================================
     AUDITORÍA
  ====================================== */

  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "CREAR",

    modulo:
      "Contenedores",

    entidad:
      "contenedores",

    idRegistroAfectado:
      contenedor.id_contenedor,

    valoresAnteriores:
      null,

    valoresNuevos:
      contenedor,

    descripcion:
      `Se registró el contenedor ${contenedor.codigo} en la operación ${contenedor.codigo_operacion}.`,
  });


  return contenedor;
}


/* ======================================
   EDITAR CONTENEDOR
====================================== */

export async function editarContenedor(
  idContenedor,
  datos = {},
  idUsuario = null
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
    typeof datos.codigo ===
    "string"
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
    typeof datos.observaciones ===
      "string" &&
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
  ] =
    await Promise.all([
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


  const contenedorActualizado =
    await obtenerContenedorPorId(
      id
    );


  /* ======================================
     AUDITORÍA
  ====================================== */

  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "EDITAR",

    modulo:
      "Contenedores",

    entidad:
      "contenedores",

    idRegistroAfectado:
      id,

    valoresAnteriores:
      contenedorActual,

    valoresNuevos:
      contenedorActualizado,

    descripcion:
      `Se actualizó el contenedor ${contenedorActualizado.codigo}.`,
  });


  return contenedorActualizado;
}