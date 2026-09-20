import pool from "../config/db.js";


const CONFIG_CATALOGOS = {
  tipos_buque: {
    tabla: "tipos_buque",
    id: "id_tipo_buque",
  },

  tipos_carga: {
    tabla: "tipos_carga",
    id: "id_tipo_carga",
  },

  tipos_contenedor: {
    tabla: "tipos_contenedor",
    id: "id_tipo_contenedor",
  },

  tipos_inspeccion: {
    tabla: "tipos_inspeccion",
    id: "id_tipo_inspeccion",
  },

  tipos_incidencia: {
    tabla: "tipos_incidencia",
    id: "id_tipo_incidencia",
  },
};


export function obtenerConfiguracionCatalogo(
  clave
) {
  return CONFIG_CATALOGOS[
    clave
  ] || null;
}


export function obtenerClavesCatalogos() {
  return Object.keys(
    CONFIG_CATALOGOS
  );
}


export async function listarCatalogo(
  clave
) {
  const configuracion =
    obtenerConfiguracionCatalogo(
      clave
    );


  const {
    tabla,
    id,
  } = configuracion;


  const consulta = `
    SELECT
      ${id} AS id,
      nombre,
      descripcion,
      activo
    FROM ${tabla}
    ORDER BY nombre ASC;
  `;


  const resultado =
    await pool.query(
      consulta
    );


  return resultado.rows;
}


export async function buscarRegistroPorId(
  clave,
  idRegistro
) {
  const configuracion =
    obtenerConfiguracionCatalogo(
      clave
    );


  const {
    tabla,
    id,
  } = configuracion;


  const consulta = `
    SELECT
      ${id} AS id,
      nombre,
      descripcion,
      activo
    FROM ${tabla}
    WHERE ${id} = $1;
  `;


  const resultado =
    await pool.query(
      consulta,
      [idRegistro]
    );


  return resultado.rows[0];
}


export async function crearRegistro(
  clave,
  datos
) {
  const configuracion =
    obtenerConfiguracionCatalogo(
      clave
    );


  const {
    tabla,
    id,
  } = configuracion;


  const consulta = `
    INSERT INTO ${tabla} (
      nombre,
      descripcion,
      activo
    )
    VALUES (
      $1,
      $2,
      $3
    )
    RETURNING
      ${id} AS id,
      nombre,
      descripcion,
      activo;
  `;


  const resultado =
    await pool.query(
      consulta,
      [
        datos.nombre,
        datos.descripcion,
        datos.activo,
      ]
    );


  return resultado.rows[0];
}


export async function actualizarRegistro(
  clave,
  idRegistro,
  datos
) {
  const configuracion =
    obtenerConfiguracionCatalogo(
      clave
    );


  const {
    tabla,
    id,
  } = configuracion;


  const consulta = `
    UPDATE ${tabla}
    SET
      nombre = $1,
      descripcion = $2,
      activo = $3
    WHERE ${id} = $4
    RETURNING
      ${id} AS id,
      nombre,
      descripcion,
      activo;
  `;


  const resultado =
    await pool.query(
      consulta,
      [
        datos.nombre,
        datos.descripcion,
        datos.activo,
        idRegistro,
      ]
    );


  return resultado.rows[0];
}


export async function actualizarEstadoRegistro(
  clave,
  idRegistro,
  activo
) {
  const configuracion =
    obtenerConfiguracionCatalogo(
      clave
    );


  const {
    tabla,
    id,
  } = configuracion;


  const consulta = `
    UPDATE ${tabla}
    SET activo = $1
    WHERE ${id} = $2
    RETURNING
      ${id} AS id,
      nombre,
      descripcion,
      activo;
  `;


  const resultado =
    await pool.query(
      consulta,
      [
        activo,
        idRegistro,
      ]
    );


  return resultado.rows[0];
}