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
      m.restricciones_adicionales,
      m.observaciones,
      m.activo,

      op.id_operacion,
      op.codigo AS operacion,

      b.id_buque,
      b.nombre AS buque,

      COALESCE(
        tipos.tipos_carga,
        '[]'::json
      ) AS tipos_carga

    FROM muelles m

    LEFT JOIN LATERAL (
      SELECT
        am.id_operacion
      FROM asignaciones_muelle am
      WHERE am.id_muelle = m.id_muelle
        AND am.estado = 'Confirmada'
      ORDER BY
        am.fecha_asignacion DESC NULLS LAST,
        am.id_asignacion DESC
      LIMIT 1
    ) asignacion_actual
      ON TRUE

    LEFT JOIN operaciones_portuarias op
      ON op.id_operacion =
        asignacion_actual.id_operacion

    LEFT JOIN buques b
      ON b.id_buque =
        op.id_buque

    LEFT JOIN LATERAL (
      SELECT
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id_tipo_carga',
            tc.id_tipo_carga,
            'nombre',
            tc.nombre
          )
          ORDER BY tc.nombre
        ) AS tipos_carga

      FROM muelle_tipo_carga mtc

      INNER JOIN tipos_carga tc
        ON tc.id_tipo_carga =
          mtc.id_tipo_carga

      WHERE mtc.id_muelle =
        m.id_muelle
    ) tipos
      ON TRUE

    WHERE m.activo = TRUE

    ORDER BY
      m.codigo ASC;
  `;

  const resultado =
    await pool.query(
      consulta
    );

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
      m.restricciones_adicionales,
      m.observaciones,
      m.activo,

      op.id_operacion,
      op.codigo AS operacion,

      b.id_buque,
      b.nombre AS buque,

      COALESCE(
        tipos.tipos_carga,
        '[]'::json
      ) AS tipos_carga

    FROM muelles m

    LEFT JOIN LATERAL (
      SELECT
        am.id_operacion
      FROM asignaciones_muelle am
      WHERE am.id_muelle = m.id_muelle
        AND am.estado = 'Confirmada'
      ORDER BY
        am.fecha_asignacion DESC NULLS LAST,
        am.id_asignacion DESC
      LIMIT 1
    ) asignacion_actual
      ON TRUE

    LEFT JOIN operaciones_portuarias op
      ON op.id_operacion =
        asignacion_actual.id_operacion

    LEFT JOIN buques b
      ON b.id_buque =
        op.id_buque

    LEFT JOIN LATERAL (
      SELECT
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id_tipo_carga',
            tc.id_tipo_carga,
            'nombre',
            tc.nombre
          )
          ORDER BY tc.nombre
        ) AS tipos_carga

      FROM muelle_tipo_carga mtc

      INNER JOIN tipos_carga tc
        ON tc.id_tipo_carga =
          mtc.id_tipo_carga

      WHERE mtc.id_muelle =
        m.id_muelle
    ) tipos
      ON TRUE

    WHERE m.id_muelle = $1
      AND m.activo = TRUE;
  `;

  const resultado =
    await pool.query(
      consulta,
      [idMuelle]
    );

  return (
    resultado.rows[0] ||
    null
  );
}


/* ======================================
   TIPOS DE CARGA ACTIVOS
====================================== */

export async function obtenerTiposCargaActivos() {
  const consulta = `
    SELECT
      id_tipo_carga,
      nombre,
      descripcion
    FROM tipos_carga
    WHERE activo = TRUE
    ORDER BY nombre ASC;
  `;

  const resultado =
    await pool.query(
      consulta
    );

  return resultado.rows;
}


/* ======================================
   VALIDAR TIPOS DE CARGA
====================================== */

export async function contarTiposCargaActivos(
  idsTiposCarga
) {
  const consulta = `
    SELECT
      COUNT(*)::int AS total
    FROM tipos_carga
    WHERE activo = TRUE
      AND id_tipo_carga =
        ANY($1::int[]);
  `;

  const resultado =
    await pool.query(
      consulta,
      [idsTiposCarga]
    );

  return Number(
    resultado.rows[0].total
  );
}


/* ======================================
   INSERTAR MUELLE + TIPOS DE CARGA
====================================== */

export async function insertarMuelle(
  datosMuelle
) {
  const cliente =
    await pool.connect();

  try {
    await cliente.query(
      "BEGIN"
    );

    const {
      codigo,
      nombre,
      longitud_maxima,
      calado_maximo,
      estado_operativo,
      restricciones_adicionales,
      observaciones,
      tipos_carga_permitidos,
    } = datosMuelle;


    const consultaMuelle = `
      INSERT INTO muelles (
        codigo,
        nombre,
        longitud_maxima,
        calado_maximo,
        estado_operativo,
        restricciones_adicionales,
        observaciones,
        activo
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        TRUE
      )
      RETURNING id_muelle;
    `;


    const resultado =
      await cliente.query(
        consultaMuelle,
        [
          codigo,
          nombre,
          longitud_maxima,
          calado_maximo,
          estado_operativo,
          restricciones_adicionales,
          observaciones,
        ]
      );


    const idMuelle =
      resultado.rows[0]
        .id_muelle;


    const consultaTipos = `
      INSERT INTO muelle_tipo_carga (
        id_muelle,
        id_tipo_carga
      )
      SELECT
        $1,
        UNNEST($2::int[]);
    `;


    await cliente.query(
      consultaTipos,
      [
        idMuelle,
        tipos_carga_permitidos,
      ]
    );


    await cliente.query(
      "COMMIT"
    );


    return {
      id_muelle:
        idMuelle,
    };

  } catch (error) {

    await cliente.query(
      "ROLLBACK"
    );

    throw error;

  } finally {

    cliente.release();

  }
}


/* ======================================
   ACTUALIZAR MUELLE + TIPOS DE CARGA
====================================== */

export async function actualizarMuellePorId(
  idMuelle,
  datosMuelle
) {
  const cliente =
    await pool.connect();

  try {
    await cliente.query(
      "BEGIN"
    );


    const {
      codigo,
      nombre,
      longitud_maxima,
      calado_maximo,
      estado_operativo,
      restricciones_adicionales,
      observaciones,
      tipos_carga_permitidos,
    } = datosMuelle;


    const consultaMuelle = `
      UPDATE muelles
      SET
        codigo = $1,
        nombre = $2,
        longitud_maxima = $3,
        calado_maximo = $4,
        estado_operativo = $5,
        restricciones_adicionales = $6,
        observaciones = $7,
        fecha_actualizacion = NOW()
      WHERE id_muelle = $8
        AND activo = TRUE
      RETURNING id_muelle;
    `;


    const resultado =
      await cliente.query(
        consultaMuelle,
        [
          codigo,
          nombre,
          longitud_maxima,
          calado_maximo,
          estado_operativo,
          restricciones_adicionales,
          observaciones,
          idMuelle,
        ]
      );


    if (
      resultado.rowCount === 0
    ) {
      await cliente.query(
        "ROLLBACK"
      );

      return false;
    }


    await cliente.query(
      `
        DELETE FROM muelle_tipo_carga
        WHERE id_muelle = $1;
      `,
      [idMuelle]
    );


    await cliente.query(
      `
        INSERT INTO muelle_tipo_carga (
          id_muelle,
          id_tipo_carga
        )
        SELECT
          $1,
          UNNEST($2::int[]);
      `,
      [
        idMuelle,
        tipos_carga_permitidos,
      ]
    );


    await cliente.query(
      "COMMIT"
    );


    return true;

  } catch (error) {

    await cliente.query(
      "ROLLBACK"
    );

    throw error;

  } finally {

    cliente.release();

  }
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
    SET
      activo = FALSE,
      fecha_actualizacion = NOW()
    WHERE id_muelle = $1
      AND activo = TRUE
    RETURNING id_muelle;
  `;

  const resultado =
    await pool.query(
      consulta,
      [idMuelle]
    );

  return (
    resultado.rowCount > 0
  );
}