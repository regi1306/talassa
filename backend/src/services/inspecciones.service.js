import {
  actualizarInspeccionPorId,
  contenedorPerteneceOperacion,
  eliminarInspeccionPorId,
  existeContenedor,
  existeInspector,
  existeOperacion,
  existeTipoInspeccion,
  generarCodigoInspeccion,
  insertarInspeccion,
  obtenerInspeccionPorId,
  obtenerOpcionesInspeccion,
  obtenerTodasLasInspecciones,
} from "../repositories/inspecciones.repository.js";


/* ======================================
   ERROR PERSONALIZADO
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

function validarIdInspeccion(
  id
) {
  const idInspeccion =
    Number(id);


  if (
    !Number.isInteger(
      idInspeccion
    ) ||
    idInspeccion <= 0
  ) {
    throw crearError(
      "El identificador de la inspección no es válido.",
      400
    );
  }


  return idInspeccion;
}


/* ======================================
   PREPARAR DATOS
====================================== */

function prepararDatosInspeccion(
  datos
) {
  const idOperacion =
    Number(
      datos.id_operacion
    );


  const idContenedor =
    datos.id_contenedor === "" ||
    datos.id_contenedor === null ||
    datos.id_contenedor === undefined

      ? null

      : Number(
          datos.id_contenedor
        );


  const idInspector =
    Number(
      datos.id_inspector
    );


  const idTipoInspeccion =
    Number(
      datos.id_tipo_inspeccion
    );


  const fechaInspeccion =
    String(
      datos.fecha_inspeccion ||
      ""
    ).trim();


  const estado =
    String(
      datos.estado ||
      ""
    ).trim();


  const resultado =
    String(
      datos.resultado ||
      ""
    ).trim();


  const observaciones =
    String(
      datos.observaciones ||
      ""
    ).trim();


  /* ==============================
     OPERACIÓN
  ============================== */

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


  /* ==============================
     CONTENEDOR
  ============================== */

  if (
    idContenedor !== null &&
    (
      !Number.isInteger(
        idContenedor
      ) ||
      idContenedor <= 0
    )
  ) {
    throw crearError(
      "El contenedor seleccionado no es válido.",
      400
    );
  }


  /* ==============================
     INSPECTOR
  ============================== */

  if (
    !Number.isInteger(
      idInspector
    ) ||
    idInspector <= 0
  ) {
    throw crearError(
      "Debe seleccionar un inspector válido.",
      400
    );
  }


  /* ==============================
     TIPO
  ============================== */

  if (
    !Number.isInteger(
      idTipoInspeccion
    ) ||
    idTipoInspeccion <= 0
  ) {
    throw crearError(
      "Debe seleccionar un tipo de inspección válido.",
      400
    );
  }


  /* ==============================
     FECHA
  ============================== */

  if (
    !fechaInspeccion
  ) {
    throw crearError(
      "La fecha y hora de la inspección son obligatorias.",
      400
    );
  }


  if (
    Number.isNaN(
      Date.parse(
        fechaInspeccion
      )
    )
  ) {
    throw crearError(
      "La fecha de la inspección no es válida.",
      400
    );
  }


  /* ==============================
     ESTADO
  ============================== */

  const estadosPermitidos = [
    "Pendiente",
    "En proceso",
    "Finalizada",
  ];


  if (
    !estadosPermitidos.includes(
      estado
    )
  ) {
    throw crearError(
      "El estado de la inspección no es válido.",
      400
    );
  }


  /* ==============================
     RESULTADO
  ============================== */

  if (!resultado) {
    throw crearError(
      "El resultado de la inspección es obligatorio.",
      400
    );
  }


  /* ==============================
     OBSERVACIONES
  ============================== */

  if (!observaciones) {
    throw crearError(
      "Las observaciones son obligatorias.",
      400
    );
  }


  if (
    observaciones.length > 500
  ) {
    throw crearError(
      "Las observaciones no pueden superar los 500 caracteres.",
      400
    );
  }


  return {
    id_operacion:
      idOperacion,

    id_contenedor:
      idContenedor,

    id_inspector:
      idInspector,

    id_tipo_inspeccion:
      idTipoInspeccion,

    fecha_inspeccion:
      fechaInspeccion,

    estado,

    resultado,

    observaciones,
  };
}


/* ======================================
   VALIDAR RELACIONES
====================================== */

async function validarRelaciones(
  datos
) {
  const operacionExiste =
    await existeOperacion(
      datos.id_operacion
    );


  if (!operacionExiste) {
    throw crearError(
      "La operación seleccionada no existe.",
      404
    );
  }


  const inspectorExiste =
    await existeInspector(
      datos.id_inspector
    );


  if (!inspectorExiste) {
    throw crearError(
      "El inspector seleccionado no existe.",
      404
    );
  }


  const tipoExiste =
    await existeTipoInspeccion(
      datos.id_tipo_inspeccion
    );


  if (!tipoExiste) {
    throw crearError(
      "El tipo de inspección seleccionado no existe.",
      404
    );
  }


  if (
    datos.id_contenedor !== null
  ) {
    const contenedorExiste =
      await existeContenedor(
        datos.id_contenedor
      );


    if (!contenedorExiste) {
      throw crearError(
        "El contenedor seleccionado no existe.",
        404
      );
    }


    const pertenece =
      await contenedorPerteneceOperacion(
        datos.id_contenedor,
        datos.id_operacion
      );


    if (!pertenece) {
      throw crearError(
        "El contenedor seleccionado no pertenece a la operación indicada.",
        400
      );
    }
  }
}


/* ======================================
   LISTAR
====================================== */

export async function listarInspecciones() {
  return await obtenerTodasLasInspecciones();
}


/* ======================================
   DETALLE
====================================== */

export async function obtenerDetalleInspeccion(
  id
) {
  const idInspeccion =
    validarIdInspeccion(
      id
    );


  const inspeccion =
    await obtenerInspeccionPorId(
      idInspeccion
    );


  if (!inspeccion) {
    throw crearError(
      "La inspección solicitada no existe.",
      404
    );
  }


  return inspeccion;
}


/* ======================================
   OPCIONES FORMULARIO
====================================== */

export async function listarOpcionesInspeccion() {
  return await obtenerOpcionesInspeccion();
}


/* ======================================
   CREAR
====================================== */

export async function registrarInspeccion(
  datos
) {
  const datosPreparados =
    prepararDatosInspeccion(
      datos
    );


  await validarRelaciones(
    datosPreparados
  );


  const codigo =
    await generarCodigoInspeccion();


  const nuevaInspeccion =
    await insertarInspeccion({
      ...datosPreparados,
      codigo,
    });


  return await obtenerInspeccionPorId(
    nuevaInspeccion.id_inspeccion
  );
}


/* ======================================
   EDITAR
====================================== */

export async function editarInspeccion(
  id,
  datos
) {
  const idInspeccion =
    validarIdInspeccion(
      id
    );


  const actual =
    await obtenerInspeccionPorId(
      idInspeccion
    );


  if (!actual) {
    throw crearError(
      "La inspección que intenta editar no existe.",
      404
    );
  }


  const datosPreparados =
    prepararDatosInspeccion(
      datos
    );


  await validarRelaciones(
    datosPreparados
  );


  await actualizarInspeccionPorId(
    idInspeccion,
    datosPreparados
  );


  return await obtenerInspeccionPorId(
    idInspeccion
  );
}


/* ======================================
   ELIMINAR
====================================== */

export async function eliminarInspeccion(
  id
) {
  const idInspeccion =
    validarIdInspeccion(
      id
    );


  const actual =
    await obtenerInspeccionPorId(
      idInspeccion
    );


  if (!actual) {
    throw crearError(
      "La inspección que intenta eliminar no existe.",
      404
    );
  }


  const eliminada =
    await eliminarInspeccionPorId(
      idInspeccion
    );


  return eliminada;
}