import {
  actualizarEstadoRegistro,
  actualizarRegistro,
  buscarRegistroPorId,
  crearRegistro,
  listarCatalogo,
  obtenerClavesCatalogos,
  obtenerConfiguracionCatalogo,
} from "../repositories/catalogos.repository.js";

import {
  registrarEventoAuditoria,
} from "./auditoria.service.js";


/* ======================================
   INFORMACIÓN DE CADA CATÁLOGO
====================================== */

const informacionCatalogos = {
  tipos_buque: {
    nombre: "Tipos de buque",
    entidad: "Tipo de buque",
  },

  tipos_carga: {
    nombre: "Tipos de carga",
    entidad: "Tipo de carga",
  },

  tipos_contenedor: {
    nombre: "Tipos de contenedor",
    entidad: "Tipo de contenedor",
  },

  tipos_inspeccion: {
    nombre: "Tipos de inspección",
    entidad: "Tipo de inspección",
  },

  tipos_incidencia: {
    nombre: "Tipos de incidencia",
    entidad: "Tipo de incidencia",
  },
};


function crearError(
  mensaje,
  estado
) {
  const error =
    new Error(mensaje);

  error.status =
    estado;

  return error;
}


/* ======================================
   VALIDAR CATÁLOGO
====================================== */

function validarCatalogo(
  clave
) {
  const configuracion =
    obtenerConfiguracionCatalogo(
      clave
    );


  if (!configuracion) {
    throw crearError(
      "El catálogo solicitado no es válido.",
      400
    );
  }


  return clave;
}


/* ======================================
   VALIDAR ID
====================================== */

function validarId(
  idRegistro
) {
  const id =
    Number(idRegistro);


  if (
    !Number.isInteger(id)
    ||
    id <= 0
  ) {
    throw crearError(
      "El identificador del registro no es válido.",
      400
    );
  }


  return id;
}


/* ======================================
   VALIDAR DATOS
====================================== */

function validarDatos(
  datos
) {
  const nombre =
    String(
      datos?.nombre ?? ""
    ).trim();


  const descripcion =
    String(
      datos?.descripcion ?? ""
    ).trim();


  if (!nombre) {
    throw crearError(
      "El nombre es obligatorio.",
      400
    );
  }


  if (
    nombre.length > 100
  ) {
    throw crearError(
      "El nombre no puede superar los 100 caracteres.",
      400
    );
  }


  if (!descripcion) {
    throw crearError(
      "La descripción es obligatoria.",
      400
    );
  }


  if (
    descripcion.length > 250
  ) {
    throw crearError(
      "La descripción no puede superar los 250 caracteres.",
      400
    );
  }


  return {
    nombre,
    descripcion,

    activo:
      typeof datos?.activo ===
      "boolean"
        ? datos.activo
        : true,
  };
}


/* ======================================
   ERROR POSTGRESQL
====================================== */

function manejarErrorPostgreSQL(
  error
) {
  if (
    error.code ===
    "23505"
  ) {
    throw crearError(
      "Ya existe un registro con ese nombre en este catálogo.",
      409
    );
  }


  throw error;
}


/* ======================================
   DATOS PARA AUDITORÍA
====================================== */

function datosCatalogoAuditoria(
  registro
) {
  return {
    nombre:
      registro.nombre,

    descripcion:
      registro.descripcion,

    activo:
      registro.activo,
  };
}


function obtenerInformacionCatalogo(
  clave
) {
  return (
    informacionCatalogos[
      clave
    ]
    ||
    {
      nombre: clave,
      entidad: "Registro de catálogo",
    }
  );
}


/* ======================================
   LISTAR TODOS
====================================== */

export async function obtenerTodosLosCatalogos() {
  const claves =
    obtenerClavesCatalogos();


  const resultados =
    await Promise.all(
      claves.map(
        async (clave) => [
          clave,
          await listarCatalogo(
            clave
          ),
        ]
      )
    );


  return Object.fromEntries(
    resultados
  );
}


/* ======================================
   LISTAR UNO
====================================== */

export async function obtenerCatalogo(
  clave
) {
  validarCatalogo(
    clave
  );


  return await listarCatalogo(
    clave
  );
}


/* ======================================
   CREAR REGISTRO
====================================== */

export async function registrarEnCatalogo(
  clave,
  datos,
  idUsuario
) {
  validarCatalogo(
    clave
  );


  const registroValidado =
    validarDatos(
      datos
    );


  try {
    const registro =
      await crearRegistro(
        clave,
        registroValidado
      );


    const informacion =
      obtenerInformacionCatalogo(
        clave
      );


    await registrarEventoAuditoria({
      idUsuario,

      accion:
        "CREACIÓN",

      modulo:
        "Catálogos",

      entidad:
        informacion.entidad,

      idRegistroAfectado:
        registro.id,

      valoresAnteriores:
        null,

      valoresNuevos:
        datosCatalogoAuditoria(
          registro
        ),

      descripcion:
        `Se creó el registro "${registro.nombre}" en ${informacion.nombre.toLowerCase()}.`,
    });


    return registro;


  } catch (error) {
    manejarErrorPostgreSQL(
      error
    );
  }
}


/* ======================================
   EDITAR REGISTRO
====================================== */

export async function editarEnCatalogo(
  clave,
  idRegistro,
  datos,
  idUsuario
) {
  validarCatalogo(
    clave
  );


  const id =
    validarId(
      idRegistro
    );


  const registroAnterior =
    await buscarRegistroPorId(
      clave,
      id
    );


  if (!registroAnterior) {
    throw crearError(
      "El registro solicitado no existe.",
      404
    );
  }


  const registroValidado =
    validarDatos(
      datos
    );


  try {
    const registroActualizado =
      await actualizarRegistro(
        clave,
        id,
        registroValidado
      );


    const informacion =
      obtenerInformacionCatalogo(
        clave
      );


    await registrarEventoAuditoria({
      idUsuario,

      accion:
        "ACTUALIZACIÓN",

      modulo:
        "Catálogos",

      entidad:
        informacion.entidad,

      idRegistroAfectado:
        id,

      valoresAnteriores:
        datosCatalogoAuditoria(
          registroAnterior
        ),

      valoresNuevos:
        datosCatalogoAuditoria(
          registroActualizado
        ),

      descripcion:
        `Se actualizó el registro "${registroActualizado.nombre}" en ${informacion.nombre.toLowerCase()}.`,
    });


    return registroActualizado;


  } catch (error) {
    manejarErrorPostgreSQL(
      error
    );
  }
}


/* ======================================
   CAMBIAR ESTADO
====================================== */

export async function cambiarEstadoEnCatalogo(
  clave,
  idRegistro,
  activo,
  idUsuario
) {
  validarCatalogo(
    clave
  );


  const id =
    validarId(
      idRegistro
    );


  const registroAnterior =
    await buscarRegistroPorId(
      clave,
      id
    );


  if (!registroAnterior) {
    throw crearError(
      "El registro solicitado no existe.",
      404
    );
  }


  if (
    typeof activo !==
    "boolean"
  ) {
    throw crearError(
      "El estado enviado no es válido.",
      400
    );
  }


  const registroActualizado =
    await actualizarEstadoRegistro(
      clave,
      id,
      activo
    );


  const informacion =
    obtenerInformacionCatalogo(
      clave
    );


  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "CAMBIO DE ESTADO",

    modulo:
      "Catálogos",

    entidad:
      informacion.entidad,

    idRegistroAfectado:
      id,

    valoresAnteriores: {
      nombre:
        registroAnterior.nombre,

      activo:
        registroAnterior.activo,
    },

    valoresNuevos: {
      nombre:
        registroActualizado.nombre,

      activo:
        registroActualizado.activo,
    },

    descripcion:
      registroActualizado.activo
        ? `Se reactivó el registro "${registroActualizado.nombre}" en ${informacion.nombre.toLowerCase()}.`
        : `Se desactivó el registro "${registroActualizado.nombre}" en ${informacion.nombre.toLowerCase()}.`,
  });


  return registroActualizado;
}