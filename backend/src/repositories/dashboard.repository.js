import pool
  from "../config/db.js";


/* ======================================
   INDICADORES GENERALES
====================================== */

export async function obtenerEstadisticasDashboard() {
  const consulta = `
    SELECT

      (
        SELECT COUNT(DISTINCT op.id_buque)::int
        FROM operaciones_portuarias op
        WHERE op.estado IN (
          'En puerto',
          'En operación'
        )
      ) AS buques_en_puerto,

      (
        SELECT COUNT(*)::int
        FROM operaciones_portuarias op
        WHERE op.llegada_estimada::date =
              CURRENT_DATE
      ) AS operaciones_del_dia,

      (
        SELECT COUNT(*)::int
        FROM inspecciones i
        WHERE LOWER(
          TRIM(
            COALESCE(
              i.estado,
              ''
            )
          )
        ) IN (
          'pendiente',
          'programada'
        )
      ) AS inspecciones_pendientes,

      (
        SELECT COUNT(*)::int
        FROM incidencias inc
        WHERE LOWER(
          TRIM(
            COALESCE(
              inc.estado,
              ''
            )
          )
        ) NOT IN (
          'cerrada',
          'cerrado',
          'resuelta',
          'resuelto',
          'finalizada',
          'finalizado'
        )
      ) AS incidencias_activas;
  `;


  const resultado =
    await pool.query(
      consulta
    );


  return resultado.rows[0];
}


/* ======================================
   OPERACIÓN DESTACADA
====================================== */

export async function obtenerOperacionDestacada() {
  const consulta = `
    SELECT
      op.id_operacion,
      op.codigo,
      op.estado,
      op.llegada_estimada,
      op.salida_estimada,
      op.llegada_real,
      op.salida_real,

      b.nombre AS buque,

      tc.nombre AS tipo_carga,

      m.id_muelle,
      m.codigo AS muelle,

      insp.codigo AS codigo_inspeccion,
      insp.estado AS estado_inspeccion,
      insp.resultado AS resultado_inspeccion

    FROM operaciones_portuarias op

    INNER JOIN buques b
      ON b.id_buque =
         op.id_buque

    LEFT JOIN tipos_carga tc
      ON tc.id_tipo_carga =
         op.id_tipo_carga


    /* Última asignación del muelle */

    LEFT JOIN LATERAL (
      SELECT
        a.id_muelle
      FROM asignaciones_muelle a
      WHERE a.id_operacion =
            op.id_operacion
      ORDER BY
        a.fecha_asignacion DESC
          NULLS LAST,
        a.id_asignacion DESC
      LIMIT 1
    ) asignacion
      ON TRUE


    LEFT JOIN muelles m
      ON m.id_muelle =
         asignacion.id_muelle


    /* Última inspección */

    LEFT JOIN LATERAL (
      SELECT
        i.codigo,
        i.estado,
        i.resultado
      FROM inspecciones i
      WHERE i.id_operacion =
            op.id_operacion
      ORDER BY
        i.fecha_hora DESC
          NULLS LAST,
        i.id_inspeccion DESC
      LIMIT 1
    ) insp
      ON TRUE


    WHERE op.estado <> 'Finalizada'

    ORDER BY

      CASE op.estado
        WHEN 'En operación'
          THEN 1
        WHEN 'En puerto'
          THEN 2
        WHEN 'Muelle asignado'
          THEN 3
        WHEN 'Programada'
          THEN 4
        ELSE 5
      END,

      COALESCE(
        op.llegada_real,
        op.llegada_estimada
      ) ASC
        NULLS LAST

    LIMIT 1;
  `;


  const resultado =
    await pool.query(
      consulta
    );


  return (
    resultado.rows[0] ||
    null
  );
}


/* ======================================
   ESTADO ACTUAL DE MUELLES
====================================== */

export async function obtenerEstadoMuellesDashboard() {
  const consulta = `
    SELECT
      m.id_muelle,
      m.codigo,
      m.nombre,
      m.estado_operativo,
      m.activo,

      asignacion.id_operacion,
      asignacion.codigo_operacion,
      asignacion.estado_operacion,
      asignacion.buque,

      CASE

        WHEN m.activo = FALSE
          THEN 'Fuera de servicio'

        WHEN m.estado_operativo
             <> 'Disponible'
          THEN m.estado_operativo

        WHEN asignacion.estado_operacion
             = 'Muelle asignado'
          THEN 'Reservado'

        WHEN asignacion.estado_operacion
             IN (
               'En puerto',
               'En operación'
             )
          THEN 'Ocupado'

        ELSE 'Disponible'

      END AS estado_dashboard

    FROM muelles m


    LEFT JOIN LATERAL (

      SELECT
        op.id_operacion,
        op.codigo
          AS codigo_operacion,
        op.estado
          AS estado_operacion,
        b.nombre
          AS buque

      FROM asignaciones_muelle a

      INNER JOIN operaciones_portuarias op
        ON op.id_operacion =
           a.id_operacion

      INNER JOIN buques b
        ON b.id_buque =
           op.id_buque

      WHERE
        a.id_muelle =
        m.id_muelle

        AND op.estado IN (
          'Muelle asignado',
          'En puerto',
          'En operación'
        )

        AND a.id_asignacion = (

          SELECT
            a2.id_asignacion

          FROM asignaciones_muelle a2

          WHERE
            a2.id_operacion =
            a.id_operacion

          ORDER BY
            a2.fecha_asignacion DESC
              NULLS LAST,
            a2.id_asignacion DESC

          LIMIT 1
        )

      ORDER BY
        a.fecha_asignacion DESC
          NULLS LAST,
        a.id_asignacion DESC

      LIMIT 1

    ) asignacion
      ON TRUE


    WHERE m.activo = TRUE

    ORDER BY
      m.codigo;
  `;


  const resultado =
    await pool.query(
      consulta
    );


  return resultado.rows;
}


/* ======================================
   PRÓXIMAS OPERACIONES
====================================== */

export async function obtenerProximasOperacionesDashboard() {
  const consulta = `
    SELECT
      op.id_operacion,
      op.codigo,
      op.estado,
      op.llegada_estimada,

      b.nombre AS buque,

      tc.nombre AS tipo_carga,

      m.codigo AS muelle

    FROM operaciones_portuarias op

    INNER JOIN buques b
      ON b.id_buque =
         op.id_buque

    LEFT JOIN tipos_carga tc
      ON tc.id_tipo_carga =
         op.id_tipo_carga


    LEFT JOIN LATERAL (

      SELECT
        a.id_muelle

      FROM asignaciones_muelle a

      WHERE
        a.id_operacion =
        op.id_operacion

      ORDER BY
        a.fecha_asignacion DESC
          NULLS LAST,
        a.id_asignacion DESC

      LIMIT 1

    ) asignacion
      ON TRUE


    LEFT JOIN muelles m
      ON m.id_muelle =
         asignacion.id_muelle


    WHERE
      op.estado IN (
        'Programada',
        'Muelle asignado'
      )

      AND op.llegada_estimada
          >= NOW()


    ORDER BY
      op.llegada_estimada ASC

    LIMIT 4;
  `;


  const resultado =
    await pool.query(
      consulta
    );


  return resultado.rows;
}


/* ======================================
   CONTENEDORES
====================================== */

export async function obtenerResumenContenedoresDashboard() {
  const consulta = `
    SELECT

      COUNT(*)::int
        AS total,

      COUNT(*) FILTER (
        WHERE op.estado
              <> 'Finalizada'
      )::int
        AS operaciones_activas,

      COUNT(*) FILTER (
        WHERE op.estado
              = 'Finalizada'
      )::int
        AS operaciones_finalizadas

    FROM contenedores c

    INNER JOIN operaciones_portuarias op
      ON op.id_operacion =
         c.id_operacion;
  `;


  const resultado =
    await pool.query(
      consulta
    );


  return resultado.rows[0];
}


/* ======================================
   ACTIVIDAD RECIENTE
====================================== */

export async function obtenerActividadRecienteDashboard() {
  const consulta = `
    SELECT *

    FROM (

      /* OPERACIONES */

      SELECT
        'operacion'
          AS tipo,

        CONCAT(
          'Operación ',
          op.codigo,
          ' actualizada'
        )
          AS titulo,

        CONCAT(
          b.nombre,
          ' · ',
          op.estado
        )
          AS detalle,

        op.fecha_actualizacion
          AS fecha

      FROM operaciones_portuarias op

      INNER JOIN buques b
        ON b.id_buque =
           op.id_buque


      UNION ALL


      /* INSPECCIONES */

      SELECT
        'inspeccion'
          AS tipo,

        CONCAT(
          'Inspección ',
          i.codigo,
          ' · ',
          i.estado
        )
          AS titulo,

        CONCAT(
          'Operación ',
          op.codigo
        )
          AS detalle,

        COALESCE(
          i.fecha_actualizacion,
          i.fecha_creacion
        )
          AS fecha

      FROM inspecciones i

      INNER JOIN operaciones_portuarias op
        ON op.id_operacion =
           i.id_operacion


      UNION ALL


      /* INCIDENCIAS */

      SELECT
        'incidencia'
          AS tipo,

        CONCAT(
          'Incidencia ',
          inc.codigo,
          ' · ',
          inc.estado
        )
          AS titulo,

        CONCAT(
          'Prioridad ',
          inc.prioridad
        )
          AS detalle,

        COALESCE(
          inc.fecha_actualizacion,
          inc.fecha_reporte
        )
          AS fecha

      FROM incidencias inc


      UNION ALL


      /* ASIGNACIONES */

      SELECT
        'asignacion'
          AS tipo,

        CONCAT(
          'Muelle ',
          m.codigo,
          ' asignado'
        )
          AS titulo,

        CONCAT(
          op.codigo,
          ' · ',
          b.nombre
        )
          AS detalle,

        a.fecha_asignacion
          AS fecha

      FROM asignaciones_muelle a

      INNER JOIN muelles m
        ON m.id_muelle =
           a.id_muelle

      INNER JOIN operaciones_portuarias op
        ON op.id_operacion =
           a.id_operacion

      INNER JOIN buques b
        ON b.id_buque =
           op.id_buque

    ) actividad


    WHERE actividad.fecha
          IS NOT NULL

    ORDER BY
      actividad.fecha DESC

    LIMIT 4;
  `;


  const resultado =
    await pool.query(
      consulta
    );


  return resultado.rows;
}