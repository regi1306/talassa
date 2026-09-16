import {
  actualizarIncidenciaPorId,
  actualizarEstadoIncidenciaPorId,
  contenedorPerteneceOperacion,
  eliminarIncidenciaPorId,
  existeContenedor,
  existeInspeccion,
  existeMuelle,
  existeOperacion,
  existeTipoIncidencia,
  existeUsuario,
  generarCodigoIncidencia,
  inspeccionPerteneceOperacion,
  insertarIncidencia,
  insertarSeguimiento,
  obtenerIncidenciaPorId,
  obtenerOpcionesIncidencia,
  obtenerSeguimientoPorIncidencia,
  obtenerTodasLasIncidencias,
} from "../repositories/incidencias.repository.js";


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


function idObligatorio(
  valor,
  nombre
) {
  const numero =
    Number(valor);

  if (
    !Number.isInteger(numero) ||
    numero <= 0
  ) {
    throw crearError(
      `${nombre} no es válido.`,
      400
    );
  }

  return numero;
}


function idOpcional(valor) {
  if (
    valor === "" ||
    valor === null ||
    valor === undefined
  ) {
    return null;
  }

  const numero =
    Number(valor);

  if (
    !Number.isInteger(numero) ||
    numero <= 0
  ) {
    throw crearError(
      "Uno de los identificadores opcionales no es válido.",
      400
    );
  }

  return numero;
}


/* ======================================
   EVIDENCIAS
====================================== */

function validarEvidencias(
  evidencias
) {
  if (!Array.isArray(evidencias)) {
    return [];
  }

  if (evidencias.length > 4) {
    throw crearError(
      "Solo se permiten hasta 4 imágenes por incidencia.",
      400
    );
  }

  return evidencias.map(
    (evidencia) => {

      const dataUrl =
        String(
          evidencia.dataUrl ||
          ""
        );

      if (
        !dataUrl.startsWith(
          "data:image/"
        )
      ) {
        throw crearError(
          "Una de las evidencias no es una imagen válida.",
          400
        );
      }

      if (
        dataUrl.length >
        3_000_000
      ) {
        throw crearError(
          "Una de las imágenes supera el tamaño permitido.",
          400
        );
      }

      return {
        nombre:
          String(
            evidencia.nombre ||
            "evidencia"
          ),

        tipo:
          String(
            evidencia.tipo ||
            "image/jpeg"
          ),

        categoria:
          String(
            evidencia.categoria ||
            "Otra evidencia"
          ),

        dataUrl,
      };
    }
  );
}


/* ======================================
   PREPARAR
====================================== */

function prepararDatos(datos) {
  const prioridad =
    String(
      datos.prioridad ||
      ""
    ).trim();

  const estado =
    String(
      datos.estado ||
      "Abierta"
    ).trim();

  const descripcion =
    String(
      datos.descripcion ||
      ""
    ).trim();

  const resolucion =
    datos.resolucion
      ? String(
          datos.resolucion
        ).trim()
      : null;


  if (
    ![
      "Baja",
      "Media",
      "Alta",
    ].includes(
      prioridad
    )
  ) {
    throw crearError(
      "La prioridad no es válida.",
      400
    );
  }


  if (
    ![
      "Abierta",
      "En revisión",
      "Resuelta",
      "Cerrada",
    ].includes(
      estado
    )
  ) {
    throw crearError(
      "El estado no es válido.",
      400
    );
  }


  if (!descripcion) {
    throw crearError(
      "La descripción de la incidencia es obligatoria.",
      400
    );
  }


  return {
    id_operacion:
      idObligatorio(
        datos.id_operacion,
        "La operación"
      ),

    id_inspeccion:
      idOpcional(
        datos.id_inspeccion
      ),

    id_contenedor:
      idOpcional(
        datos.id_contenedor
      ),

    id_muelle:
      idOpcional(
        datos.id_muelle
      ),

    id_usuario_reportante:
      idObligatorio(
        datos.id_usuario_reportante,
        "El usuario reportante"
      ),

    id_usuario_responsable:
      idOpcional(
        datos.id_usuario_responsable
      ),

    id_tipo_incidencia:
      idObligatorio(
        datos.id_tipo_incidencia,
        "El tipo de incidencia"
      ),

    prioridad,
    descripcion,
    estado,
    resolucion,

    evidencias:
      validarEvidencias(
        datos.evidencias ||
        []
      ),
  };
}


/* ======================================
   RELACIONES
====================================== */

async function validarRelaciones(
  datos
) {
  if (
    !await existeOperacion(
      datos.id_operacion
    )
  ) {
    throw crearError(
      "La operación seleccionada no existe.",
      404
    );
  }


  if (
    datos.id_inspeccion !== null
  ) {
    if (
      !await existeInspeccion(
        datos.id_inspeccion
      )
    ) {
      throw crearError(
        "La inspección seleccionada no existe.",
        404
      );
    }

    if (
      !await inspeccionPerteneceOperacion(
        datos.id_inspeccion,
        datos.id_operacion
      )
    ) {
      throw crearError(
        "La inspección no pertenece a la operación seleccionada.",
        400
      );
    }
  }


  if (
    datos.id_contenedor !== null
  ) {
    if (
      !await existeContenedor(
        datos.id_contenedor
      )
    ) {
      throw crearError(
        "El contenedor seleccionado no existe.",
        404
      );
    }

    if (
      !await contenedorPerteneceOperacion(
        datos.id_contenedor,
        datos.id_operacion
      )
    ) {
      throw crearError(
        "El contenedor no pertenece a la operación seleccionada.",
        400
      );
    }
  }


  if (
    datos.id_muelle !== null &&
    !await existeMuelle(
      datos.id_muelle
    )
  ) {
    throw crearError(
      "El muelle seleccionado no existe.",
      404
    );
  }


  if (
    !await existeUsuario(
      datos.id_usuario_reportante
    )
  ) {
    throw crearError(
      "El usuario reportante no existe.",
      404
    );
  }


  if (
    datos.id_usuario_responsable !== null &&
    !await existeUsuario(
      datos.id_usuario_responsable
    )
  ) {
    throw crearError(
      "El responsable seleccionado no existe.",
      404
    );
  }


  if (
    !await existeTipoIncidencia(
      datos.id_tipo_incidencia
    )
  ) {
    throw crearError(
      "El tipo de incidencia no existe.",
      404
    );
  }
}


/* ======================================
   LISTAR
====================================== */

export async function listarIncidencias() {
  return await obtenerTodasLasIncidencias();
}


/* ======================================
   DETALLE
====================================== */

export async function obtenerDetalleIncidencia(
  id
) {
  const idIncidencia =
    idObligatorio(
      id,
      "La incidencia"
    );

  const incidencia =
    await obtenerIncidenciaPorId(
      idIncidencia
    );

  if (!incidencia) {
    throw crearError(
      "La incidencia no existe.",
      404
    );
  }

  const seguimiento =
    await obtenerSeguimientoPorIncidencia(
      idIncidencia
    );

  return {
    ...incidencia,
    seguimiento,
  };
}


/* ======================================
   OPCIONES
====================================== */

export async function listarOpcionesIncidencia() {
  return await obtenerOpcionesIncidencia();
}


/* ======================================
   CREAR
====================================== */

export async function registrarIncidencia(
  datos
) {
  const preparados =
    prepararDatos(datos);

  await validarRelaciones(
    preparados
  );

  const codigo =
    await generarCodigoIncidencia();

  const nueva =
    await insertarIncidencia({
      ...preparados,
      codigo,
    });


  await insertarSeguimiento({
    id_incidencia:
      nueva.id_incidencia,

    id_usuario:
      preparados
        .id_usuario_reportante,

    tipo_evento:
      "Registro",

    estado_anterior:
      null,

    estado_nuevo:
      preparados.estado,

    comentario:
      "Incidencia registrada.",
  });


  return await obtenerDetalleIncidencia(
    nueva.id_incidencia
  );
}


/* ======================================
   EDITAR
====================================== */

export async function editarIncidencia(
  id,
  datos
) {
  const idIncidencia =
    idObligatorio(
      id,
      "La incidencia"
    );

  const actual =
    await obtenerIncidenciaPorId(
      idIncidencia
    );

  if (!actual) {
    throw crearError(
      "La incidencia no existe.",
      404
    );
  }

  const preparados =
    prepararDatos(datos);

  await validarRelaciones(
    preparados
  );


  await actualizarIncidenciaPorId(
    idIncidencia,
    preparados
  );


  if (
    actual.estado !==
    preparados.estado
  ) {
    await insertarSeguimiento({
      id_incidencia:
        idIncidencia,

      id_usuario:
        preparados
          .id_usuario_reportante,

      tipo_evento:
        "Cambio de estado",

      estado_anterior:
        actual.estado,

      estado_nuevo:
        preparados.estado,

      comentario:
        `Estado actualizado de ${actual.estado} a ${preparados.estado}.`,
    });
  }


  return await obtenerDetalleIncidencia(
    idIncidencia
  );
}


/* ======================================
   CAMBIAR ESTADO
====================================== */

export async function cambiarEstadoIncidencia(
  id,
  datos
) {
  const idIncidencia =
    idObligatorio(
      id,
      "La incidencia"
    );

  const actual =
    await obtenerIncidenciaPorId(
      idIncidencia
    );

  if (!actual) {
    throw crearError(
      "La incidencia no existe.",
      404
    );
  }


  const nuevoEstado =
    String(
      datos.estado ||
      ""
    ).trim();


  if (
    ![
      "Abierta",
      "En revisión",
      "Resuelta",
      "Cerrada",
    ].includes(
      nuevoEstado
    )
  ) {
    throw crearError(
      "El nuevo estado no es válido.",
      400
    );
  }


  await actualizarEstadoIncidenciaPorId(
    idIncidencia,
    nuevoEstado
  );


  if (
    actual.estado !==
    nuevoEstado
  ) {
    await insertarSeguimiento({
      id_incidencia:
        idIncidencia,

      id_usuario:
        idOpcional(
          datos.id_usuario
        ),

      tipo_evento:
        "Cambio de estado",

      estado_anterior:
        actual.estado,

      estado_nuevo:
        nuevoEstado,

      comentario:
        datos.comentario ||
        `Estado actualizado a ${nuevoEstado}.`,
    });
  }


  return await obtenerDetalleIncidencia(
    idIncidencia
  );
}


/* ======================================
   AGREGAR SEGUIMIENTO
====================================== */

export async function registrarSeguimiento(
  id,
  datos
) {
  const idIncidencia =
    idObligatorio(
      id,
      "La incidencia"
    );

  const actual =
    await obtenerIncidenciaPorId(
      idIncidencia
    );

  if (!actual) {
    throw crearError(
      "La incidencia no existe.",
      404
    );
  }


  const comentario =
    String(
      datos.comentario ||
      ""
    ).trim();


  if (!comentario) {
    throw crearError(
      "El comentario es obligatorio.",
      400
    );
  }


  await insertarSeguimiento({
    id_incidencia:
      idIncidencia,

    id_usuario:
      idOpcional(
        datos.id_usuario
      ),

    tipo_evento:
      "Comentario",

    estado_anterior:
      null,

    estado_nuevo:
      null,

    comentario,
  });


  return await obtenerDetalleIncidencia(
    idIncidencia
  );
}


/* ======================================
   ELIMINAR
====================================== */

export async function eliminarIncidencia(
  id
) {
  const idIncidencia =
    idObligatorio(
      id,
      "La incidencia"
    );

  const actual =
    await obtenerIncidenciaPorId(
      idIncidencia
    );

  if (!actual) {
    throw crearError(
      "La incidencia no existe.",
      404
    );
  }

  return await eliminarIncidenciaPorId(
    idIncidencia
  );
}