import pool from "../config/db.js";


/* ======================================
   OBTENER TODOS LOS MUELLES ACTIVOS
====================================== */

export async function obtenerTodosLosMuelles() {
  const consulta = `
    SELECT
      m.id_muelle,
      m.codigo,
      m.nombre,
      m.longitud_maxima,
      m.calado_maximo,
      m.estado_operativo,
      m.activo,

      op.id_operacion,
      op.codigo AS operacion,

      b.id_buque,
      b.nombre AS buque

    FROM muelles m

    LEFT JOIN LATERAL (
      SELECT
        am.id_operacion
      FROM asignaciones_muelle am
      WHERE am.id_muelle = m.id_muelle
        AND am.estado = 'Confirmada'
      ORDER BY am.fecha_asignacion DESC
      LIMIT 1
    ) asignacion_actual
      ON TRUE

    LEFT JOIN operaciones_portuarias op
      ON op.id_operacion =
        asignacion_actual.id_operacion

    LEFT JOIN buques b
      ON b.id_buque = op.id_buque

    WHERE m.activo = TRUE

    ORDER BY m.codigo ASC;
  `;

  const resultado =
    await pool.query(consulta);

  return resultado.rows;
}


/* ======================================
   OBTENER MUELLE POR ID
====================================== */

export async function obtenerMuellePorId(
  idMuelle
) {
  const consulta = `
    SELECT
      m.id_muelle,
      m.codigo,
      m.nombre,
      m.longitud_maxima,
      m.calado_maximo,
      m.estado_operativo,
      m.activo,

      op.id_operacion,
      op.codigo AS operacion,

      b.id_buque,
      b.nombre AS buque

    FROM muelles m

    LEFT JOIN LATERAL (
      SELECT
        am.id_operacion
      FROM asignaciones_muelle am
      WHERE am.id_muelle = m.id_muelle
        AND am.estado = 'Confirmada'
      ORDER BY am.fecha_asignacion DESC
      LIMIT 1
    ) asignacion_actual
      ON TRUE

    LEFT JOIN operaciones_portuarias op
      ON op.id_operacion =
        asignacion_actual.id_operacion

    LEFT JOIN buques b
      ON b.id_buque = op.id_buque

    WHERE m.id_muelle = $1
      AND m.activo = TRUE;
  `;

  const resultado =
    await pool.query(
      consulta,
      [idMuelle]
    );

  return resultado.rows[0] || null;
}


/* ======================================
   INSERTAR MUELLE
====================================== */

export async function insertarMuelle(
  datosMuelle
) {
  const {
    codigo,
    nombre,
    longitud_maxima,
    calado_maximo,
    estado_operativo,
  } = datosMuelle;

  const consulta = `
    INSERT INTO muelles (
      codigo,
      nombre,
      longitud_maxima,
      calado_maximo,
      estado_operativo,
      activo
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      TRUE
    )
    RETURNING id_muelle;
  `;

  const valores = [
    codigo,
    nombre,
    longitud_maxima,
    calado_maximo,
    estado_operativo,
  ];

  const resultado =
    await pool.query(
      consulta,
      valores
    );

  return resultado.rows[0];
}


/* ======================================
   ACTUALIZAR MUELLE
====================================== */

export async function actualizarMuellePorId(
  idMuelle,
  datosMuelle
) {
  const {
    codigo,
    nombre,
    longitud_maxima,
    calado_maximo,
    estado_operativo,
  } = datosMuelle;

  const consulta = `
    UPDATE muelles
    SET
      codigo = $1,
      nombre = $2,
      longitud_maxima = $3,
      calado_maximo = $4,
      estado_operativo = $5
    WHERE id_muelle = $6
      AND activo = TRUE
    RETURNING id_muelle;
  `;

  const valores = [
    codigo,
    nombre,
    longitud_maxima,
    calado_maximo,
    estado_operativo,
    idMuelle,
  ];

  const resultado =
    await pool.query(
      consulta,
      valores
    );

  return resultado.rowCount > 0;
}


/* ======================================
   VERIFICAR ASIGNACIÓN CONFIRMADA
====================================== */

export async function muelleTieneAsignacionConfirmada(
  idMuelle
) {
  const consulta = `
    SELECT EXISTS (
      SELECT 1
      FROM asignaciones_muelle
      WHERE id_muelle = $1
        AND estado = 'Confirmada'
    ) AS tiene_asignacion;
  `;

  const resultado =
    await pool.query(
      consulta,
      [idMuelle]
    );

  return resultado.rows[0]
    .tiene_asignacion;
}


/* ======================================
   ELIMINACIÓN LÓGICA
====================================== */

export async function desactivarMuellePorId(
  idMuelle
) {
  const consulta = `
    UPDATE muelles
    SET activo = FALSE
    WHERE id_muelle = $1
      AND activo = TRUE
    RETURNING id_muelle;
  `;

  const resultado =
    await pool.query(
      consulta,
      [idMuelle]
    );

  return resultado.rowCount > 0;
}