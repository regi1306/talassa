import pool from "../config/db.js";


export async function obtenerTodosLosBuques() {
  const consulta = `
    SELECT
      b.id_buque,
      b.nombre,
      b.identificacion,
      b.bandera,
      b.eslora_m,
      b.manga_m,
      b.calado_m,
      b.activo,
      b.fecha_creacion,
      b.fecha_actualizacion,

      e.id_empresa,
      e.nombre AS empresa,

      tb.id_tipo_buque,
      tb.nombre AS tipo_buque

    FROM buques b

    INNER JOIN empresas e
      ON e.id_empresa = b.id_empresa

    INNER JOIN tipos_buque tb
      ON tb.id_tipo_buque = b.id_tipo_buque

    ORDER BY b.nombre ASC;
  `;

  const resultado = await pool.query(consulta);

  return resultado.rows;
}


export async function obtenerBuquePorId(idBuque) {
  const consulta = `
    SELECT
      b.id_buque,
      b.nombre,
      b.identificacion,
      b.bandera,
      b.eslora_m,
      b.manga_m,
      b.calado_m,
      b.activo,
      b.fecha_creacion,
      b.fecha_actualizacion,

      e.id_empresa,
      e.nombre AS empresa,
      e.tipo AS tipo_empresa,
      e.pais AS pais_empresa,

      tb.id_tipo_buque,
      tb.nombre AS tipo_buque,
      tb.descripcion AS descripcion_tipo_buque

    FROM buques b

    INNER JOIN empresas e
      ON e.id_empresa = b.id_empresa

    INNER JOIN tipos_buque tb
      ON tb.id_tipo_buque = b.id_tipo_buque

    WHERE b.id_buque = $1;
  `;

  const resultado = await pool.query(
    consulta,
    [idBuque]
  );

  return resultado.rows[0] || null;
}


export async function obtenerOperacionesPorBuque(
  idBuque
) {
  const consulta = `
    SELECT
      op.id_operacion,
      op.codigo,
      op.procedencia,
      op.destino,
      op.llegada_estimada,
      op.salida_estimada,
      op.llegada_real,
      op.salida_real,
      op.estado,
      op.observaciones,

      tc.id_tipo_carga,
      tc.nombre AS tipo_carga,

      m.id_muelle,
      m.codigo AS codigo_muelle,
      m.nombre AS nombre_muelle

    FROM operaciones_portuarias op

    INNER JOIN tipos_carga tc
      ON tc.id_tipo_carga = op.id_tipo_carga

    LEFT JOIN LATERAL (
      SELECT
        am.id_muelle
      FROM asignaciones_muelle am
      WHERE am.id_operacion = op.id_operacion
        AND am.estado IN (
          'Confirmada',
          'Finalizada'
        )
      ORDER BY am.fecha_asignacion DESC
      LIMIT 1
    ) asignacion_actual
      ON TRUE

    LEFT JOIN muelles m
      ON m.id_muelle =
        asignacion_actual.id_muelle

    WHERE op.id_buque = $1

    ORDER BY
      op.llegada_estimada DESC;
  `;

  const resultado = await pool.query(
    consulta,
    [idBuque]
  );

  return resultado.rows;
}


export async function consultarOpcionesFormularioBuque() {
  const consultaEmpresas = `
    SELECT
      id_empresa,
      nombre
    FROM empresas
    WHERE activo = TRUE
    ORDER BY nombre ASC;
  `;

  const consultaTiposBuque = `
    SELECT
      id_tipo_buque,
      nombre
    FROM tipos_buque
    WHERE activo = TRUE
    ORDER BY nombre ASC;
  `;

  const [
    resultadoEmpresas,
    resultadoTiposBuque,
  ] = await Promise.all([
    pool.query(consultaEmpresas),
    pool.query(consultaTiposBuque),
  ]);

  return {
    empresas: resultadoEmpresas.rows,
    tipos_buque: resultadoTiposBuque.rows,
  };
}


export async function existeEmpresaActiva(
  idEmpresa
) {
  const consulta = `
    SELECT EXISTS (
      SELECT 1
      FROM empresas
      WHERE id_empresa = $1
        AND activo = TRUE
    ) AS existe;
  `;

  const resultado = await pool.query(
    consulta,
    [idEmpresa]
  );

  return resultado.rows[0].existe;
}


export async function existeTipoBuqueActivo(
  idTipoBuque
) {
  const consulta = `
    SELECT EXISTS (
      SELECT 1
      FROM tipos_buque
      WHERE id_tipo_buque = $1
        AND activo = TRUE
    ) AS existe;
  `;

  const resultado = await pool.query(
    consulta,
    [idTipoBuque]
  );

  return resultado.rows[0].existe;
}


export async function insertarBuque(
  datosBuque
) {
  const {
    nombre,
    identificacion,
    id_empresa,
    id_tipo_buque,
    bandera,
    eslora_m,
    manga_m,
    calado_m,
  } = datosBuque;

  const consulta = `
    WITH nuevo_buque AS (
      INSERT INTO buques (
        nombre,
        identificacion,
        id_empresa,
        id_tipo_buque,
        bandera,
        eslora_m,
        manga_m,
        calado_m
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8
      )
      RETURNING *
    )

    SELECT
      nb.id_buque,
      nb.nombre,
      nb.identificacion,
      nb.bandera,
      nb.eslora_m,
      nb.manga_m,
      nb.calado_m,
      nb.activo,
      nb.fecha_creacion,
      nb.fecha_actualizacion,

      e.id_empresa,
      e.nombre AS empresa,

      tb.id_tipo_buque,
      tb.nombre AS tipo_buque

    FROM nuevo_buque nb

    INNER JOIN empresas e
      ON e.id_empresa = nb.id_empresa

    INNER JOIN tipos_buque tb
      ON tb.id_tipo_buque =
        nb.id_tipo_buque;
  `;

  const valores = [
    nombre,
    identificacion,
    id_empresa,
    id_tipo_buque,
    bandera,
    eslora_m,
    manga_m,
    calado_m,
  ];

  const resultado = await pool.query(
    consulta,
    valores
  );

  return resultado.rows[0];
}

export async function actualizarBuquePorId(
  idBuque,
  datosBuque
) {
  const {
    nombre,
    identificacion,
    id_empresa,
    id_tipo_buque,
    bandera,
    eslora_m,
    manga_m,
    calado_m,
  } = datosBuque;

  const consulta = `
    UPDATE buques
    SET
      nombre = $1,
      identificacion = $2,
      id_empresa = $3,
      id_tipo_buque = $4,
      bandera = $5,
      eslora_m = $6,
      manga_m = $7,
      calado_m = $8,
      fecha_actualizacion = NOW()
    WHERE id_buque = $9
    RETURNING id_buque;
  `;

  const valores = [
    nombre,
    identificacion,
    id_empresa,
    id_tipo_buque,
    bandera,
    eslora_m,
    manga_m,
    calado_m,
    idBuque,
  ];

  const resultado = await pool.query(
    consulta,
    valores
  );

  return resultado.rowCount > 0;
}


export async function actualizarEstadoBuquePorId(
  idBuque,
  activo
) {
  const consulta = `
    UPDATE buques
    SET
      activo = $1,
      fecha_actualizacion = NOW()
    WHERE id_buque = $2
    RETURNING id_buque;
  `;

  const resultado = await pool.query(
    consulta,
    [
      activo,
      idBuque,
    ]
  );

  return resultado.rowCount > 0;
}