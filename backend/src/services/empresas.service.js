import {
  actualizarEmpresa,
  buscarEmpresaPorId,
  cambiarEstadoEmpresa,
  crearEmpresa,
  listarEmpresas,
} from "../repositories/empresas.repository.js";

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


function validarId(
  idEmpresa
) {
  const id =
    Number(idEmpresa);


  if (
    !Number.isInteger(id)
    ||
    id <= 0
  ) {
    throw crearError(
      "El identificador de la empresa no es válido.",
      400
    );
  }


  return id;
}


function validarDatosEmpresa(
  datos
) {
  const nombre =
    String(
      datos?.nombre ?? ""
    ).trim();


  const tipo =
    String(
      datos?.tipo ?? ""
    ).trim();


  const pais =
    String(
      datos?.pais ?? ""
    ).trim();


  if (!nombre) {
    throw crearError(
      "El nombre de la empresa es obligatorio.",
      400
    );
  }


  if (
    nombre.length > 150
  ) {
    throw crearError(
      "El nombre no puede superar los 150 caracteres.",
      400
    );
  }


  if (!tipo) {
    throw crearError(
      "El tipo de empresa es obligatorio.",
      400
    );
  }


  if (
    tipo.length > 80
  ) {
    throw crearError(
      "El tipo no puede superar los 80 caracteres.",
      400
    );
  }


  if (!pais) {
    throw crearError(
      "El país de la empresa es obligatorio.",
      400
    );
  }


  if (
    pais.length > 80
  ) {
    throw crearError(
      "El país no puede superar los 80 caracteres.",
      400
    );
  }


  return {
    nombre,
    tipo,
    pais,

    activo:
      typeof datos?.activo ===
      "boolean"
        ? datos.activo
        : true,
  };
}


/* ======================================
   DATOS PARA AUDITORÍA
====================================== */

function datosEmpresaAuditoria(
  empresa
) {
  return {
    nombre:
      empresa.nombre,

    tipo:
      empresa.tipo,

    pais:
      empresa.pais,

    activo:
      empresa.activo,
  };
}


/* ======================================
   LISTAR
====================================== */

export async function obtenerEmpresas() {
  return await listarEmpresas();
}


/* ======================================
   CREAR
====================================== */

export async function registrarEmpresa(
  datos,
  idUsuario
) {
  const empresaValidada =
    validarDatosEmpresa(
      datos
    );


  const empresa =
    await crearEmpresa(
      empresaValidada
    );


  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "CREACIÓN",

    modulo:
      "Empresas",

    entidad:
      "empresa",

    idRegistroAfectado:
      empresa.id_empresa,

    valoresAnteriores:
      null,

    valoresNuevos:
      datosEmpresaAuditoria(
        empresa
      ),

    descripcion:
      `Se registró la empresa "${empresa.nombre}".`,
  });


  return empresa;
}


/* ======================================
   EDITAR
====================================== */

export async function editarEmpresa(
  idEmpresa,
  datos,
  idUsuario
) {
  const id =
    validarId(
      idEmpresa
    );


  const empresaAnterior =
    await buscarEmpresaPorId(
      id
    );


  if (!empresaAnterior) {
    throw crearError(
      "La empresa solicitada no existe.",
      404
    );
  }


  const empresaValidada =
    validarDatosEmpresa(
      datos
    );


  const empresaActualizada =
    await actualizarEmpresa(
      id,
      empresaValidada
    );


  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "ACTUALIZACIÓN",

    modulo:
      "Empresas",

    entidad:
      "empresa",

    idRegistroAfectado:
      id,

    valoresAnteriores:
      datosEmpresaAuditoria(
        empresaAnterior
      ),

    valoresNuevos:
      datosEmpresaAuditoria(
        empresaActualizada
      ),

    descripcion:
      `Se actualizó la información de la empresa "${empresaActualizada.nombre}".`,
  });


  return empresaActualizada;
}


/* ======================================
   CAMBIAR ESTADO
====================================== */

export async function actualizarEstadoEmpresa(
  idEmpresa,
  activo,
  idUsuario
) {
  const id =
    validarId(
      idEmpresa
    );


  const empresaAnterior =
    await buscarEmpresaPorId(
      id
    );


  if (!empresaAnterior) {
    throw crearError(
      "La empresa solicitada no existe.",
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


  const empresaActualizada =
    await cambiarEstadoEmpresa(
      id,
      activo
    );


  await registrarEventoAuditoria({
    idUsuario,

    accion:
      "CAMBIO DE ESTADO",

    modulo:
      "Empresas",

    entidad:
      "empresa",

    idRegistroAfectado:
      id,

    valoresAnteriores: {
      nombre:
        empresaAnterior.nombre,

      activo:
        empresaAnterior.activo,
    },

    valoresNuevos: {
      nombre:
        empresaActualizada.nombre,

      activo:
        empresaActualizada.activo,
    },

    descripcion:
      empresaActualizada.activo
        ? `Se reactivó la empresa "${empresaActualizada.nombre}".`
        : `Se desactivó la empresa "${empresaActualizada.nombre}".`,
  });


  return empresaActualizada;
}