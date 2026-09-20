import {
  buscarRolPorId,
  listarPermisos,
  listarRoles,
  obtenerPermisosExistentes,
  obtenerPermisosRol,
  reemplazarPermisosRol,
} from "../repositories/roles.repository.js";

import {
  registrarEventoAuditoria,
} from "./auditoria.service.js";


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
   UTILIDADES DE AUDITORÍA
====================================== */

function obtenerCodigosPermisos(
  permisos
) {
  return permisos
    .map(
      (permiso) =>
        permiso.codigo
    )
    .filter(Boolean)
    .sort();
}


function mismosPermisos(
  permisosAnteriores,
  permisosNuevos
) {
  const anteriores =
    [...permisosAnteriores]
      .map(Number)
      .sort(
        (a, b) =>
          a - b
      );


  const nuevos =
    [...permisosNuevos]
      .map(Number)
      .sort(
        (a, b) =>
          a - b
      );


  if (
    anteriores.length !==
    nuevos.length
  ) {
    return false;
  }


  return anteriores.every(
    (id, indice) =>
      id === nuevos[indice]
  );
}


/* ======================================
   LISTAR ROLES
====================================== */

export async function obtenerRoles() {
  return await listarRoles();
}


/* ======================================
   LISTAR PERMISOS
====================================== */

export async function obtenerTodosLosPermisos() {
  return await listarPermisos();
}


/* ======================================
   PERMISOS DE UN ROL
====================================== */

export async function obtenerPermisosDeRol(
  idRol
) {
  const rol =
    await buscarRolPorId(
      idRol
    );


  if (!rol) {
    throw crearError(
      "El rol solicitado no existe.",
      404
    );
  }


  return await obtenerPermisosRol(
    idRol
  );
}


/* ======================================
   ACTUALIZAR PERMISOS DEL ROL
====================================== */

export async function actualizarPermisosDeRol(
  idRol,
  permisos,
  idUsuarioActual
) {
  const rol =
    await buscarRolPorId(
      idRol
    );


  if (!rol) {
    throw crearError(
      "El rol solicitado no existe.",
      404
    );
  }


  if (!Array.isArray(permisos)) {
    throw crearError(
      "La lista de permisos no es válida.",
      400
    );
  }


  const idsPermisos = [
    ...new Set(
      permisos.map(
        (idPermiso) =>
          Number(idPermiso)
      )
    ),
  ];


  const existeIdInvalido =
    idsPermisos.some(
      (idPermiso) =>
        !Number.isInteger(
          idPermiso
        )
        ||
        idPermiso <= 0
    );


  if (existeIdInvalido) {
    throw crearError(
      "Uno o más permisos no son válidos.",
      400
    );
  }


  const permisosExistentes =
    await obtenerPermisosExistentes(
      idsPermisos
    );


  if (
    permisosExistentes.length !==
    idsPermisos.length
  ) {
    throw crearError(
      "Uno o más permisos no existen.",
      400
    );
  }


  /* ======================================
     ESTADO ANTERIOR
  ====================================== */

  const permisosAnteriores =
    await obtenerPermisosRol(
      idRol
    );


  const idsAnteriores =
    permisosAnteriores.map(
      (permiso) =>
        permiso.id_permiso
    );


  /*
    Si el usuario presiona guardar sin
    hacer cambios, no generamos un evento
    de auditoría innecesario.
  */

  if (
    mismosPermisos(
      idsAnteriores,
      idsPermisos
    )
  ) {
    return permisosAnteriores;
  }


  /* ======================================
     GUARDAR CAMBIOS
  ====================================== */

  await reemplazarPermisosRol(
    idRol,
    idsPermisos
  );


  const permisosActualizados =
    await obtenerPermisosRol(
      idRol
    );


  /* ======================================
     AUDITORÍA
  ====================================== */

  const codigosAnteriores =
    obtenerCodigosPermisos(
      permisosAnteriores
    );


  const codigosNuevos =
    obtenerCodigosPermisos(
      permisosActualizados
    );


  await registrarEventoAuditoria({
    idUsuario:
      idUsuarioActual,

    accion:
      "ACTUALIZACIÓN DE PERMISOS",

    modulo:
      "Roles y permisos",

    entidad:
      "rol",

    idRegistroAfectado:
      rol.id_rol,

    valoresAnteriores: {
      rol:
        rol.nombre,

      cantidad_permisos:
        codigosAnteriores.length,

      permisos_asignados:
        codigosAnteriores,
    },

    valoresNuevos: {
      rol:
        rol.nombre,

      cantidad_permisos:
        codigosNuevos.length,

      permisos_asignados:
        codigosNuevos,
    },

    descripcion:
      `Se actualizaron los permisos asignados al rol "${rol.nombre}".`,
  });


  return permisosActualizados;
}