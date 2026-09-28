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

import {
  registrarEventoAuditoria,
} from "./auditoria.service.js";


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
   ID OBLIGATORIO
====================================== */

function idObligatorio(
  valor,
  nombre
) {
  const numero =
    Number(
      valor
    );


  if (
    !Number.isInteger(
      numero
    ) ||
    numero <= 0
  ) {
    throw crearError(
      `${nombre} no es válido.`,
      400
    );
  }


  return numero;
}


/* ======================================
   ID OPCIONAL
====================================== */

function idOpcional(
  valor
) {
  if (
    valor === "" ||
    valor === null ||
    valor === undefined
  ) {
    return null;
  }


  const numero =
    Number(
      valor
    );


  if (
    !Number.isInteger(
      numero
    ) ||
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
  if (
    !Array.isArray(
      evidencias
    )
  ) {
    return [];
  }


  if (
    evidencias.length > 4
  ) {
    throw crearError(
      "Solo se permiten hasta 4 imágenes por incidencia.",
      400
    );
  }


  return evidencias.map(
    (
      evidencia
    ) => {
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
   PREPARAR DATOS
====================================== */

function prepararDatos(
  datos
) {
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


  if (
    !descripcion
  ) {
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
   PREPARAR DATOS PARA AUDITORÍA

   IMPORTANTE:
   No almacenamos dataUrl/base64 de las
   imágenes dentro de auditoria.
====================================== */

function prepararIncidenciaParaAuditoria(
  incidencia
) {
  if (!incidencia) {
    return null;
  }


  const {
    seguimiento,
    evidencias,
    ...datosIncidencia
  } = incidencia;


  const evidenciasAuditoria =
    Array.isArray(
      evidencias
    )
      ? evidencias.map(
          (
            evidencia
          ) => ({
            nombre:
              evidencia.nombre ||
              null,

            tipo:
              evidencia.tipo ||
              null,

            categoria:
              evidencia.categoria ||
              null,
          })
        )
      : [];


  return {
    ...datosIncidencia,

    evidencias:
      evidenciasAuditoria,
  };
}


/* ======================================
   VALIDAR RELACIONES
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
    datos.id_inspeccion !==
    null
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
    datos.id_contenedor !==
    null
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
    datos.id_usuario_responsable !==
      null &&
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


  if (
    !incidencia
  ) {
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
  datos,
  idUsuarioAutenticado
) {
  /*
   * El usuario que reporta la incidencia
   * se obtiene del JWT.
   *
   * No se confía en el
   * id_usuario_reportante enviado
   * por el navegador.
   */

  const idUsuario =
    idObligatorio(
      idUsuarioAutenticado,
      "El usuario autenticado"
    );


  const datosSeguros = {
    ...datos,

    id_usuario_reportante:
      idUsuario,
  };


  const preparados =
    prepararDatos(
      datosSeguros
    );


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


  /*
   * Historial interno de la incidencia.
   */

  await insertarSeguimiento({
    id_incidencia:
      nueva.id_incidencia,

    id_usuario:
      idUsuario,

    tipo_evento:
      "Registro",

    estado_anterior:
      null,

    estado_nuevo:
      preparados.estado,

    comentario:
      "Incidencia registrada.",
  });


  const incidencia =
    await obtenerDetalleIncidencia(
      nueva.id_incidencia
    );


  /*
   * Auditoría global de TALASSA.
   */

  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "CREAR",

    modulo:
      "Incidencias",

    entidad:
      "incidencias",

    idRegistroAfectado:
      nueva.id_incidencia,

    valoresAnteriores:
      null,

    valoresNuevos:
      prepararIncidenciaParaAuditoria(
        incidencia
      ),

    descripcion:
      `Se registró la incidencia ${incidencia.codigo}.`,
  });


  return incidencia;
}


/* ======================================
   EDITAR
====================================== */

export async function editarIncidencia(
  id,
  datos,
  idUsuarioAutenticado
) {
  const idIncidencia =
    idObligatorio(
      id,
      "La incidencia"
    );


  const idUsuario =
    idObligatorio(
      idUsuarioAutenticado,
      "El usuario autenticado"
    );


  const actual =
    await obtenerIncidenciaPorId(
      idIncidencia
    );


  if (
    !actual
  ) {
    throw crearError(
      "La incidencia no existe.",
      404
    );
  }


  /*
   * El usuario reportante original
   * se conserva.
   *
   * Aunque el navegador envíe otro
   * id_usuario_reportante, el backend
   * lo ignora.
   */

  const datosSeguros = {
    ...datos,

    id_usuario_reportante:
      actual.id_usuario_reportante,
  };


  const preparados =
    prepararDatos(
      datosSeguros
    );


  await validarRelaciones(
    preparados
  );


  await actualizarIncidenciaPorId(
    idIncidencia,
    preparados
  );


  /*
   * Si durante la edición cambia
   * el estado, se mantiene también
   * el historial interno.
   */

  if (
    actual.estado !==
    preparados.estado
  ) {
    await insertarSeguimiento({
      id_incidencia:
        idIncidencia,

      id_usuario:
        idUsuario,

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


  const actualizada =
    await obtenerDetalleIncidencia(
      idIncidencia
    );


  /*
   * Auditoría global.
   */

  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "EDITAR",

    modulo:
      "Incidencias",

    entidad:
      "incidencias",

    idRegistroAfectado:
      idIncidencia,

    valoresAnteriores:
      prepararIncidenciaParaAuditoria(
        actual
      ),

    valoresNuevos:
      prepararIncidenciaParaAuditoria(
        actualizada
      ),

    descripcion:
      `Se actualizó la incidencia ${actualizada.codigo}.`,
  });


  return actualizada;
}


/* ======================================
   CAMBIAR ESTADO
====================================== */

export async function cambiarEstadoIncidencia(
  id,
  datos,
  idUsuarioAutenticado
) {
  const idIncidencia =
    idObligatorio(
      id,
      "La incidencia"
    );


  const idUsuario =
    idObligatorio(
      idUsuarioAutenticado,
      "El usuario autenticado"
    );


  const actual =
    await obtenerIncidenciaPorId(
      idIncidencia
    );


  if (
    !actual
  ) {
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
    /*
     * Historial interno.
     */

    await insertarSeguimiento({
      id_incidencia:
        idIncidencia,

      /*
       * Usuario obtenido del JWT.
       */

      id_usuario:
        idUsuario,

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


  const actualizada =
    await obtenerDetalleIncidencia(
      idIncidencia
    );


  /*
   * Solo registramos CAMBIAR_ESTADO
   * si realmente cambió.
   */

  if (
    actual.estado !==
    nuevoEstado
  ) {
    await registrarEventoAuditoria({
      idUsuario,

      accion:
        "CAMBIAR_ESTADO",

      modulo:
        "Incidencias",

      entidad:
        "incidencias",

      idRegistroAfectado:
        idIncidencia,

      valoresAnteriores: {
        estado:
          actual.estado,

        fecha_resolucion:
          actual.fecha_resolucion ||
          null,

        fecha_cierre:
          actual.fecha_cierre ||
          null,
      },

      valoresNuevos: {
        estado:
          actualizada.estado,

        fecha_resolucion:
          actualizada.fecha_resolucion ||
          null,

        fecha_cierre:
          actualizada.fecha_cierre ||
          null,
      },

      descripcion:
        `Se cambió el estado de la incidencia ${actual.codigo} de ${actual.estado} a ${nuevoEstado}.`,
    });
  }


  return actualizada;
}


/* ======================================
   AGREGAR SEGUIMIENTO
====================================== */

export async function registrarSeguimiento(
  id,
  datos,
  idUsuarioAutenticado
) {
  const idIncidencia =
    idObligatorio(
      id,
      "La incidencia"
    );


  const idUsuario =
    idObligatorio(
      idUsuarioAutenticado,
      "El usuario autenticado"
    );


  const actual =
    await obtenerIncidenciaPorId(
      idIncidencia
    );


  if (
    !actual
  ) {
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


  if (
    !comentario
  ) {
    throw crearError(
      "El comentario es obligatorio.",
      400
    );
  }


  /*
   * Historial interno.
   */

  const seguimiento =
    await insertarSeguimiento({
      id_incidencia:
        idIncidencia,

      /*
       * Siempre se registra como autor
       * al usuario del JWT.
       */

      id_usuario:
        idUsuario,

      tipo_evento:
        "Comentario",

      estado_anterior:
        null,

      estado_nuevo:
        null,

      comentario,
    });


  /*
   * Auditoría global.
   */

  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "AGREGAR_SEGUIMIENTO",

    modulo:
      "Incidencias",

    entidad:
      "incidencia_seguimiento",

    idRegistroAfectado:
      seguimiento.id_seguimiento,

    valoresAnteriores:
      null,

    valoresNuevos: {
      id_incidencia:
        idIncidencia,

      tipo_evento:
        "Comentario",

      comentario,
    },

    descripcion:
      `Se agregó seguimiento a la incidencia ${actual.codigo}.`,
  });


  return await obtenerDetalleIncidencia(
    idIncidencia
  );
}


/* ======================================
   ELIMINAR
====================================== */

export async function eliminarIncidencia(
  id,
  idUsuarioAutenticado
) {
  const idIncidencia =
    idObligatorio(
      id,
      "La incidencia"
    );


  const idUsuario =
    idObligatorio(
      idUsuarioAutenticado,
      "El usuario autenticado"
    );


  const actual =
    await obtenerIncidenciaPorId(
      idIncidencia
    );


  if (
    !actual
  ) {
    throw crearError(
      "La incidencia no existe.",
      404
    );
  }


  const eliminada =
    await eliminarIncidenciaPorId(
      idIncidencia
    );


  if (
    !eliminada
  ) {
    throw crearError(
      "No fue posible eliminar la incidencia.",
      500
    );
  }


  /*
   * Auditoría global.
   */

  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "ELIMINAR",

    modulo:
      "Incidencias",

    entidad:
      "incidencias",

    idRegistroAfectado:
      idIncidencia,

    valoresAnteriores:
      prepararIncidenciaParaAuditoria(
        actual
      ),

    valoresNuevos:
      null,

    descripcion:
      `Se eliminó la incidencia ${actual.codigo}.`,
  });


  return eliminada;
}