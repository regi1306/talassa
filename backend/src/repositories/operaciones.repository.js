import pool from "../config/db.js";


export async function obtenerTodasLasOperaciones() {
  const consulta = `
    SELECT
      op.id_operacion,
      op.codigo,

      op.id_buque,
      b.nombre AS buque,
      b.identificacion AS identificacion_buque,

      op.id_tipo_carga,
      tc.nombre AS tipo_carga,

      op.procedencia,
      op.destino,

      op.llegada_estimada,
      op.salida_estimada,
      op.llegada_real,
      op.salida_real,

      op.estado,
      op.observaciones,

      op.fecha_creacion,
      op.fecha_actualizacion,

      (
        SELECT COUNT(*)::int
        FROM contenedores c
        WHERE c.id_operacion = op.id_operacion
      ) AS total_contenedores

    FROM operaciones_portuarias op

    INNER JOIN buques b
      ON b.id_buque = op.id_buque

    INNER JOIN tipos_carga tc
      ON tc.id_tipo_carga = op.id_tipo_carga

    ORDER BY
      op.llegada_estimada DESC,
      op.id_operacion DESC;
  `;

  const resultado =
    await pool.query(consulta);

  return resultado.rows;
}


export async function obtenerOperacionPorId(
  idOperacion
) {
  const consulta = `
    SELECT
      op.id_operacion,
      op.codigo,

      op.id_buque,
      b.nombre AS buque,
      b.identificacion AS identificacion_buque,
      b.bandera AS bandera_buque,

      e.nombre AS empresa,

      op.id_tipo_carga,
      tc.nombre AS tipo_carga,

      op.procedencia,
      op.destino,

      op.llegada_estimada,
      op.salida_estimada,
      op.llegada_real,
      op.salida_real,

      op.estado,
      op.observaciones,

      op.fecha_creacion,
      op.fecha_actualizacion,

      (
        SELECT COUNT(*)::int
        FROM contenedores c
        WHERE c.id_operacion =
          op.id_operacion
      ) AS total_contenedores,

      (
        SELECT COUNT(*)::int
        FROM inspecciones i
        WHERE i.id_operacion =
          op.id_operacion
      ) AS total_inspecciones,

      (
        SELECT COUNT(*)::int
        FROM incidencias inc
        WHERE inc.id_operacion =
          op.id_operacion
        AND inc.estado IN (
          'Abierta',
          'En revisión'
        )
      ) AS incidencias_activas

    FROM operaciones_portuarias op

    INNER JOIN buques b
      ON b.id_buque =
        op.id_buque

    INNER JOIN empresas e
      ON e.id_empresa =
        b.id_empresa

    INNER JOIN tipos_carga tc
      ON tc.id_tipo_carga =
        op.id_tipo_carga

    WHERE op.id_operacion = $1;
  `;

  const resultado =
    await pool.query(
      consulta,
      [idOperacion]
    );

  return resultado.rows[0] || null;
}


export async function consultarOpcionesFormularioOperacion() {
  const consultaBuques = `
    SELECT
      id_buque,
      nombre,
      identificacion
    FROM buques
    WHERE activo = TRUE
    ORDER BY nombre ASC;
  `;

  const consultaTiposCarga = `
    SELECT
      id_tipo_carga,
      nombre
    FROM tipos_carga
    ORDER BY nombre ASC;
  `;

  const [
    resultadoBuques,
    resultadoTiposCarga,
  ] = await Promise.all([
    pool.query(consultaBuques),
    pool.query(consultaTiposCarga),
  ]);

  return {
    buques: resultadoBuques.rows,
    tipos_carga:
      resultadoTiposCarga.rows,
  };
}


export async function existeBuqueActivo(
  idBuque
) {
  const consulta = `
    SELECT EXISTS (
      SELECT 1
      FROM buques
      WHERE id_buque = $1
        AND activo = TRUE
    ) AS existe;
  `;

  const resultado =
    await pool.query(
      consulta,
      [idBuque]
    );

  return resultado.rows[0].existe;
}


export async function existeTipoCarga(
  idTipoCarga
) {
  const consulta = `
    SELECT EXISTS (
      SELECT 1
      FROM tipos_carga
      WHERE id_tipo_carga = $1
    ) AS existe;
  `;

  const resultado =
    await pool.query(
      consulta,
      [idTipoCarga]
    );

  return resultado.rows[0].existe;
}


export async function insertarOperacion(
  datosOperacion
) {
  const {
    id_buque,
    id_tipo_carga,
    procedencia,
    destino,
    llegada_estimada,
    salida_estimada,
    observaciones,
  } = datosOperacion;


  const consulta = `
    WITH siguiente AS (
      SELECT
        nextval(
          pg_get_serial_sequence(
            'operaciones_portuarias',
            'id_operacion'
          )
        ) AS id_operacion
    )

    INSERT INTO operaciones_portuarias (
      id_operacion,
      codigo,
      id_buque,
      id_tipo_carga,
      procedencia,
      destino,
      llegada_estimada,
      salida_estimada,
      observaciones
    )

    SELECT
      id_operacion,
      'OP-' ||
      LPAD(
        id_operacion::text,
        6,
        '0'
      ),
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7

    FROM siguiente

    RETURNING
      id_operacion,
      codigo;
  `;


  const valores = [
    id_buque,
    id_tipo_carga,
    procedencia,
    destino,
    llegada_estimada,
    salida_estimada,
    observaciones,
  ];


  const resultado =
    await pool.query(
      consulta,
      valores
    );


  return resultado.rows[0];
}

export async function actualizarOperacionPorId(
  idOperacion,
  datosOperacion
) {
  const {
    id_buque,
    id_tipo_carga,
    procedencia,
    destino,
    llegada_estimada,
    salida_estimada,
    observaciones,
  } = datosOperacion;


  const consulta = `
    UPDATE operaciones_portuarias
    SET
      id_buque = $1,
      id_tipo_carga = $2,
      procedencia = $3,
      destino = $4,
      llegada_estimada = $5,
      salida_estimada = $6,
      observaciones = $7,
      fecha_actualizacion = NOW()
    WHERE id_operacion = $8
    RETURNING id_operacion;
  `;


  const valores = [
    id_buque,
    id_tipo_carga,
    procedencia,
    destino,
    llegada_estimada,
    salida_estimada,
    observaciones,
    idOperacion,
  ];


  const resultado =
    await pool.query(
      consulta,
      valores
    );


  return resultado.rowCount > 0;
}

export async function registrarLlegadaRealPorId(
  idOperacion,
  llegadaReal
) {
  const consulta = `
    UPDATE operaciones_portuarias
    SET
      llegada_real = $1,
      estado = 'En puerto',
      fecha_actualizacion = NOW()
    WHERE id_operacion = $2
      AND estado = 'Muelle asignado'
      AND llegada_real IS NULL
    RETURNING id_operacion;
  `;

  const resultado =
    await pool.query(
      consulta,
      [
        llegadaReal,
        idOperacion,
      ]
    );

  return resultado.rowCount > 0;
}


export async function registrarSalidaRealPorId(
  idOperacion,
  salidaReal
) {
  const consulta = `
    UPDATE operaciones_portuarias
    SET
      salida_real = $1,
      estado = 'Finalizada',
      fecha_actualizacion = NOW()
    WHERE id_operacion = $2
      AND llegada_real IS NOT NULL
      AND salida_real IS NULL
      AND estado IN (
        'En puerto',
        'En operación'
      )
    RETURNING id_operacion;
  `;

  const resultado =
    await pool.query(
      consulta,
      [
        salidaReal,
        idOperacion,
      ]
    );

  return resultado.rowCount > 0;
}