import pool from "../config/db.js";


export async function obtenerTodosLosContenedores() {
  const consulta = `
    SELECT
      c.id_contenedor,
      c.codigo,

      c.id_operacion,
      op.codigo AS codigo_operacion,

      b.nombre AS buque,
      b.identificacion AS identificacion_buque,

      c.id_tipo_contenedor,
      tcon.nombre AS tipo_contenedor,

      c.id_tipo_carga,
      tc.nombre AS tipo_carga,

      c.peso_kg,
      c.estado,
      c.observaciones,
      c.fecha_registro,
      c.fecha_actualizacion

    FROM contenedores c

    INNER JOIN operaciones_portuarias op
      ON op.id_operacion = c.id_operacion

    INNER JOIN buques b
      ON b.id_buque = op.id_buque

    INNER JOIN tipos_contenedor tcon
      ON tcon.id_tipo_contenedor =
        c.id_tipo_contenedor

    INNER JOIN tipos_carga tc
      ON tc.id_tipo_carga =
        c.id_tipo_carga

    ORDER BY
      c.fecha_registro DESC,
      c.id_contenedor DESC;
  `;

  const resultado =
    await pool.query(consulta);

  return resultado.rows;
}


export async function obtenerContenedorPorId(
  idContenedor
) {
  const consulta = `
    SELECT
      c.id_contenedor,
      c.codigo,

      c.id_operacion,
      op.codigo AS codigo_operacion,
      op.estado AS estado_operacion,

      b.nombre AS buque,
      b.identificacion AS identificacion_buque,
      b.bandera AS bandera_buque,

      c.id_tipo_contenedor,
      tcon.nombre AS tipo_contenedor,
      tcon.descripcion AS descripcion_tipo_contenedor,

      c.id_tipo_carga,
      tc.nombre AS tipo_carga,

      c.peso_kg,
      c.estado,
      c.observaciones,
      c.fecha_registro,
      c.fecha_actualizacion

    FROM contenedores c

    INNER JOIN operaciones_portuarias op
      ON op.id_operacion = c.id_operacion

    INNER JOIN buques b
      ON b.id_buque = op.id_buque

    INNER JOIN tipos_contenedor tcon
      ON tcon.id_tipo_contenedor =
        c.id_tipo_contenedor

    INNER JOIN tipos_carga tc
      ON tc.id_tipo_carga =
        c.id_tipo_carga

    WHERE c.id_contenedor = $1;
  `;

  const resultado =
    await pool.query(
      consulta,
      [idContenedor]
    );

  return resultado.rows[0] || null;
}


export async function consultarOpcionesFormularioContenedor() {
  const consultaOperaciones = `
    SELECT
      op.id_operacion,
      op.codigo,
      op.estado,
      b.nombre AS buque
    FROM operaciones_portuarias op
    INNER JOIN buques b
      ON b.id_buque = op.id_buque
    WHERE op.estado IN (
      'En puerto',
      'En operación'
    )
    ORDER BY op.codigo ASC;
  `;

  const consultaTiposContenedor = `
    SELECT
      id_tipo_contenedor,
      nombre,
      descripcion
    FROM tipos_contenedor
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
    resultadoOperaciones,
    resultadoTiposContenedor,
    resultadoTiposCarga,
  ] = await Promise.all([
    pool.query(consultaOperaciones),
    pool.query(consultaTiposContenedor),
    pool.query(consultaTiposCarga),
  ]);

  return {
    operaciones:
      resultadoOperaciones.rows,

    tipos_contenedor:
      resultadoTiposContenedor.rows,

    tipos_carga:
      resultadoTiposCarga.rows,
  };
}

export async function existeCodigoContenedor(
  codigo
) {
  const consulta = `
    SELECT EXISTS (
      SELECT 1
      FROM contenedores
      WHERE UPPER(codigo) = UPPER($1)
    ) AS existe;
  `;

  const resultado =
    await pool.query(
      consulta,
      [codigo]
    );

  return resultado.rows[0].existe;
}


export async function obtenerOperacionHabilitadaParaContenedor(
  idOperacion
) {
  const consulta = `
    SELECT
      id_operacion,
      codigo,
      estado
    FROM operaciones_portuarias
    WHERE id_operacion = $1
      AND estado IN (
        'En puerto',
        'En operación'
      );
  `;

  const resultado =
    await pool.query(
      consulta,
      [idOperacion]
    );

  return resultado.rows[0] || null;
}


export async function existeTipoContenedorActivo(
  idTipoContenedor
) {
  const consulta = `
    SELECT EXISTS (
      SELECT 1
      FROM tipos_contenedor
      WHERE id_tipo_contenedor = $1
        AND activo = TRUE
    ) AS existe;
  `;

  const resultado =
    await pool.query(
      consulta,
      [idTipoContenedor]
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


export async function insertarContenedor(
  datosContenedor
) {
  const cliente =
    await pool.connect();

  try {
    await cliente.query(
      "BEGIN"
    );

    const consultaInsertar = `
      INSERT INTO contenedores (
        codigo,
        id_operacion,
        id_tipo_contenedor,
        id_tipo_carga,
        peso_kg,
        observaciones
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
      RETURNING id_contenedor;
    `;

    const valores = [
      datosContenedor.codigo,
      datosContenedor.id_operacion,
      datosContenedor.id_tipo_contenedor,
      datosContenedor.id_tipo_carga,
      datosContenedor.peso_kg,
      datosContenedor.observaciones,
    ];

    const resultado =
      await cliente.query(
        consultaInsertar,
        valores
      );

    await cliente.query(
      `
        UPDATE operaciones_portuarias
        SET
          estado = 'En operación',
          fecha_actualizacion = NOW()
        WHERE id_operacion = $1
          AND estado = 'En puerto';
      `,
      [
        datosContenedor.id_operacion,
      ]
    );

    await cliente.query(
      "COMMIT"
    );

    return resultado.rows[0];
  } catch (error) {
    await cliente.query(
      "ROLLBACK"
    );

    throw error;
  } finally {
    cliente.release();
  }
}

export async function existeCodigoContenedorEnOtroRegistro(
  codigo,
  idContenedor
) {
  const consulta = `
    SELECT EXISTS (
      SELECT 1
      FROM contenedores
      WHERE UPPER(codigo) = UPPER($1)
        AND id_contenedor <> $2
    ) AS existe;
  `;

  const resultado =
    await pool.query(
      consulta,
      [
        codigo,
        idContenedor,
      ]
    );

  return resultado.rows[0].existe;
}


export async function actualizarContenedorPorId(
  idContenedor,
  datosContenedor
) {
  const consulta = `
    UPDATE contenedores
    SET
      codigo = $1,
      id_tipo_contenedor = $2,
      id_tipo_carga = $3,
      peso_kg = $4,
      observaciones = $5,
      fecha_actualizacion = NOW()
    WHERE id_contenedor = $6
    RETURNING id_contenedor;
  `;

  const valores = [
    datosContenedor.codigo,
    datosContenedor.id_tipo_contenedor,
    datosContenedor.id_tipo_carga,
    datosContenedor.peso_kg,
    datosContenedor.observaciones,
    idContenedor,
  ];

  const resultado =
    await pool.query(
      consulta,
      valores
    );

  return resultado.rowCount > 0;
}