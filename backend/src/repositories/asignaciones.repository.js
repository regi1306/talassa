import pool from "../config/db.js";


/* =========================================================
   OBTENER OPERACIÓN PARA EVALUACIÓN
========================================================= */

export async function obtenerOperacionParaEvaluacion(
  idOperacion,
  conexion = pool
) {
  const consulta = `
    SELECT
      op.id_operacion,
      op.codigo,
      op.id_buque,
      op.id_tipo_carga,
      op.llegada_estimada,
      op.salida_estimada,
      op.estado,

      b.nombre AS buque,
      b.eslora_m,
      b.calado_m,

      e.id_empresa,
      e.nombre AS empresa,

      tc.nombre AS tipo_carga

    FROM operaciones_portuarias op

    INNER JOIN buques b
      ON b.id_buque = op.id_buque

    INNER JOIN empresas e
      ON e.id_empresa = b.id_empresa

    INNER JOIN tipos_carga tc
      ON tc.id_tipo_carga = op.id_tipo_carga

    WHERE op.id_operacion = $1;
  `;

  const resultado =
    await conexion.query(
      consulta,
      [idOperacion]
    );

  return resultado.rows[0] || null;
}


/* =========================================================
   EVALUAR TODOS LOS MUELLES

   IMPORTANTE:
   Lee TODOS los muelles activos de PostgreSQL.
   No hay códigos M-01, M-02, etc. quemados.
========================================================= */

export async function obtenerMuellesEvaluados(
  idOperacion,
  conexion = pool
) {
  const consulta = `
    WITH operacion_objetivo AS (
      SELECT
        op.id_operacion,
        op.id_tipo_carga,
        op.llegada_estimada,
        op.salida_estimada,
        b.eslora_m,
        b.calado_m

      FROM operaciones_portuarias op

      INNER JOIN buques b
        ON b.id_buque = op.id_buque

      WHERE op.id_operacion = $1
    )

    SELECT
      m.id_muelle,
      m.codigo,
      m.nombre,
      m.longitud_maxima,
      m.calado_maximo,
      m.estado_operativo,
      m.restricciones_adicionales,
      m.observaciones,

      op.eslora_m AS eslora_buque,
      op.calado_m AS calado_buque,
      op.id_tipo_carga,
      op.llegada_estimada,
      op.salida_estimada,

      /* =====================================
         ESTADO OPERATIVO
      ===================================== */

      (
        m.estado_operativo = 'Disponible'
      ) AS validacion_estado_operativo,


      /* =====================================
         COMPATIBILIDAD FÍSICA
      ===================================== */

      (
        m.longitud_maxima >= op.eslora_m
        AND
        m.calado_maximo >= op.calado_m
      ) AS validacion_compatibilidad_fisica,


      /* =====================================
         COMPATIBILIDAD DE CARGA
      ===================================== */

      EXISTS (
        SELECT 1

        FROM muelle_tipo_carga mtc

        WHERE
          mtc.id_muelle = m.id_muelle
          AND
          mtc.id_tipo_carga = op.id_tipo_carga
      ) AS validacion_compatibilidad_carga,


      /* =====================================
         SIN CONFLICTO HORARIO
      ===================================== */

      NOT EXISTS (
        SELECT 1

        FROM asignaciones_muelle am

        WHERE
          am.id_muelle = m.id_muelle

          AND am.estado = 'Confirmada'

          AND am.id_operacion <> op.id_operacion

          AND am.inicio_asignacion < op.salida_estimada

          AND am.fin_asignacion > op.llegada_estimada
      ) AS validacion_sin_conflicto_horario,


      /* =====================================
         DISPONIBILIDAD GENERAL
      ===================================== */

      (
        m.estado_operativo = 'Disponible'

        AND NOT EXISTS (
          SELECT 1

          FROM asignaciones_muelle am2

          WHERE
            am2.id_muelle = m.id_muelle

            AND am2.estado = 'Confirmada'

            AND am2.id_operacion <> op.id_operacion

            AND am2.inicio_asignacion < op.salida_estimada

            AND am2.fin_asignacion > op.llegada_estimada
        )
      ) AS validacion_disponibilidad,


      /* =====================================
         INFORMACIÓN DEL CONFLICTO
      ===================================== */

      conflicto.operacion_conflicto,

      conflicto.buque_conflicto,

      conflicto.inicio_conflicto,

      conflicto.fin_conflicto

    FROM muelles m

    CROSS JOIN operacion_objetivo op


    LEFT JOIN LATERAL (

      SELECT
        op_conf.codigo AS operacion_conflicto,

        b_conf.nombre AS buque_conflicto,

        am.inicio_asignacion AS inicio_conflicto,

        am.fin_asignacion AS fin_conflicto

      FROM asignaciones_muelle am

      INNER JOIN operaciones_portuarias op_conf
        ON op_conf.id_operacion = am.id_operacion

      INNER JOIN buques b_conf
        ON b_conf.id_buque = op_conf.id_buque

      WHERE
        am.id_muelle = m.id_muelle

        AND am.estado = 'Confirmada'

        AND am.id_operacion <> op.id_operacion

        AND am.inicio_asignacion < op.salida_estimada

        AND am.fin_asignacion > op.llegada_estimada

      ORDER BY
        am.inicio_asignacion ASC

      LIMIT 1

    ) conflicto
      ON TRUE


    WHERE m.activo = TRUE

    ORDER BY
      m.codigo ASC;
  `;

  const resultado =
    await conexion.query(
      consulta,
      [idOperacion]
    );

  return resultado.rows;
}


/* =========================================================
   OBTENER UN MUELLE EVALUADO
   Se usa nuevamente al CONFIRMAR.
========================================================= */

export async function obtenerMuelleEvaluado(
  idOperacion,
  idMuelle,
  conexion = pool
) {
  const muelles =
    await obtenerMuellesEvaluados(
      idOperacion,
      conexion
    );

  return (
    muelles.find(
      (muelle) =>
        Number(muelle.id_muelle) ===
        Number(idMuelle)
    ) ||
    null
  );
}


/* =========================================================
   VERIFICAR ASIGNACIÓN CONFIRMADA DE LA OPERACIÓN
========================================================= */

export async function obtenerAsignacionConfirmadaOperacion(
  idOperacion,
  conexion = pool
) {
  const consulta = `
    SELECT
      am.id_asignacion,
      am.id_operacion,
      am.id_muelle,
      am.inicio_asignacion,
      am.fin_asignacion,
      am.estado,
      m.codigo AS muelle_codigo,
      m.nombre AS muelle_nombre

    FROM asignaciones_muelle am

    INNER JOIN muelles m
      ON m.id_muelle = am.id_muelle

    WHERE
      am.id_operacion = $1
      AND am.estado = 'Confirmada'

    LIMIT 1;
  `;

  const resultado =
    await conexion.query(
      consulta,
      [idOperacion]
    );

  return resultado.rows[0] || null;
}


/* =========================================================
   VALIDAR USUARIO RESPONSABLE
========================================================= */

export async function obtenerUsuarioActivoPorId(
  idUsuario,
  conexion = pool
) {
  const consulta = `
    SELECT
      u.id_usuario,
      u.nombres,
      u.apellidos,
      u.nombre_usuario,
      r.nombre AS rol

    FROM usuarios u

    INNER JOIN roles r
      ON r.id_rol = u.id_rol

    WHERE
      u.id_usuario = $1
      AND u.activo = TRUE;
  `;

  const resultado =
    await conexion.query(
      consulta,
      [idUsuario]
    );

  return resultado.rows[0] || null;
}


/* =========================================================
   CREAR ASIGNACIÓN
========================================================= */

export async function insertarAsignacion(
  datos,
  conexion
) {
  const consulta = `
    INSERT INTO asignaciones_muelle (
      id_operacion,
      id_muelle,
      id_usuario_responsable,
      inicio_asignacion,
      fin_asignacion,
      estado,
      validacion_disponibilidad,
      validacion_compatibilidad_fisica,
      validacion_compatibilidad_carga,
      validacion_sin_conflicto_horario,
      validacion_estado_operativo,
      observaciones
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      'Confirmada',
      TRUE,
      TRUE,
      TRUE,
      TRUE,
      TRUE,
      $6
    )
    RETURNING
      id_asignacion,
      id_operacion,
      id_muelle,
      id_usuario_responsable,
      inicio_asignacion,
      fin_asignacion,
      estado,
      fecha_asignacion;
  `;

  const valores = [
    datos.id_operacion,
    datos.id_muelle,
    datos.id_usuario_responsable,
    datos.inicio_asignacion,
    datos.fin_asignacion,
    datos.observaciones || null,
  ];

  const resultado =
    await conexion.query(
      consulta,
      valores
    );

  return resultado.rows[0];
}


/* =========================================================
   ACTUALIZAR ESTADO DE OPERACIÓN
========================================================= */

export async function marcarOperacionConMuelle(
  idOperacion,
  conexion
) {
  await conexion.query(
    `
      UPDATE operaciones_portuarias

      SET
        estado = 'Muelle asignado',
        fecha_actualizacion = NOW()

      WHERE id_operacion = $1;
    `,
    [idOperacion]
  );
}


/* =========================================================
   AUDITORÍA
========================================================= */

export async function registrarAuditoriaAsignacion(
  datos,
  conexion
) {
  await conexion.query(
    `
      INSERT INTO auditoria (
        id_usuario,
        accion,
        modulo,
        entidad,
        id_registro_afectado,
        valores_nuevos,
        descripcion
      )
      VALUES (
        $1,
        'CONFIRMAR_ASIGNACION_MUELLE',
        'Asignación de muelles',
        'asignaciones_muelle',
        $2,
        $3::jsonb,
        $4
      );
    `,
    [
      datos.id_usuario,
      String(
        datos.id_asignacion
      ),
      JSON.stringify(
        datos.valores_nuevos
      ),
      datos.descripcion,
    ]
  );
}


/* =========================================================
   TRANSACCIÓN
========================================================= */

export async function ejecutarEnTransaccion(
  callback
) {
  const cliente =
    await pool.connect();

  try {
    await cliente.query(
      "BEGIN"
    );

    const resultado =
      await callback(
        cliente
      );

    await cliente.query(
      "COMMIT"
    );

    return resultado;

  } catch (error) {
    await cliente.query(
      "ROLLBACK"
    );

    throw error;

  } finally {
    cliente.release();
  }
}


/* =========================================================
   BLOQUEOS TRANSACCIONALES

   Evitan:
   - dos muelles para la misma operación
   - dos operaciones confirmando el mismo muelle
     simultáneamente
========================================================= */

export async function bloquearOperacionYMuelle(
  idOperacion,
  idMuelle,
  conexion
) {
  await conexion.query(
    `
      SELECT pg_advisory_xact_lock(
        82000,
        $1
      );
    `,
    [idOperacion]
  );


  await conexion.query(
    `
      SELECT pg_advisory_xact_lock(
        82001,
        $1
      );
    `,
    [idMuelle]
  );
}