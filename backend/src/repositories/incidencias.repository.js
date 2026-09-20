import pool from "../config/db.js";


/* ======================================
   EVIDENCIAS
====================================== */

function convertirEvidencias(valor) {
  if (!valor) {
    return [];
  }

  if (Array.isArray(valor)) {
    return valor;
  }

  try {
    return JSON.parse(valor);
  } catch {
    return [];
  }
}


function normalizarIncidencia(fila) {
  if (!fila) {
    return null;
  }

  return {
    ...fila,
    evidencias:
      convertirEvidencias(
        fila.evidencias
      ),
  };
}


/* ======================================
   SELECT BASE
====================================== */

const SELECT_BASE = `
  SELECT
    i.*,

    op.codigo AS operacion,

    b.nombre AS buque,

    c.codigo AS contenedor,

    m.codigo AS muelle,

    COALESCE(
      NULLIF(
        CONCAT_WS(
          ' ',
          to_jsonb(ur)->>'nombres',
          to_jsonb(ur)->>'apellidos'
        ),
        ''
      ),
      to_jsonb(ur)->>'nombre_completo',
      to_jsonb(ur)->>'usuario',
      to_jsonb(ur)->>'username',
      to_jsonb(ur)->>'correo',
      'Usuario'
    ) AS reportante,

    COALESCE(
      NULLIF(
        CONCAT_WS(
          ' ',
          to_jsonb(ures)->>'nombres',
          to_jsonb(ures)->>'apellidos'
        ),
        ''
      ),
      to_jsonb(ures)->>'nombre_completo',
      to_jsonb(ures)->>'usuario',
      to_jsonb(ures)->>'username',
      to_jsonb(ures)->>'correo',
      'Sin responsable'
    ) AS responsable,

    COALESCE(
      to_jsonb(ti)->>'nombre',
      to_jsonb(ti)->>'descripcion',
      to_jsonb(ti)->>'codigo',
      'Incidencia'
    ) AS tipo_incidencia

  FROM incidencias i

  LEFT JOIN operaciones_portuarias op
    ON op.id_operacion =
       i.id_operacion

  LEFT JOIN buques b
    ON b.id_buque =
       op.id_buque

  LEFT JOIN contenedores c
    ON c.id_contenedor =
       i.id_contenedor

  LEFT JOIN muelles m
    ON m.id_muelle =
       i.id_muelle

  LEFT JOIN usuarios ur
    ON ur.id_usuario =
       i.id_usuario_reportante

  LEFT JOIN usuarios ures
    ON ures.id_usuario =
       i.id_usuario_responsable

  LEFT JOIN tipos_incidencia ti
    ON ti.id_tipo_incidencia =
       i.id_tipo_incidencia
`;


/* ======================================
   LISTAR
====================================== */

export async function obtenerTodasLasIncidencias() {
  const consulta = `
    ${SELECT_BASE}

    ORDER BY
      i.fecha_reporte DESC,
      i.id_incidencia DESC;
  `;

  const resultado =
    await pool.query(
      consulta
    );

  return resultado.rows.map(
    normalizarIncidencia
  );
}


/* ======================================
   DETALLE
====================================== */

export async function obtenerIncidenciaPorId(
  idIncidencia
) {
  const consulta = `
    ${SELECT_BASE}

    WHERE
      i.id_incidencia = $1;
  `;

  const resultado =
    await pool.query(
      consulta,
      [idIncidencia]
    );

  return normalizarIncidencia(
    resultado.rows[0]
  );
}


/* ======================================
   SEGUIMIENTO
====================================== */

export async function obtenerSeguimientoPorIncidencia(
  idIncidencia
) {
  const consulta = `
    SELECT
      s.*,

      COALESCE(
        NULLIF(
          CONCAT_WS(
            ' ',
            to_jsonb(u)->>'nombres',
            to_jsonb(u)->>'apellidos'
          ),
          ''
        ),
        to_jsonb(u)->>'nombre_completo',
        to_jsonb(u)->>'usuario',
        to_jsonb(u)->>'username',
        to_jsonb(u)->>'correo',
        'Sistema'
      ) AS usuario

    FROM incidencia_seguimiento s

    LEFT JOIN usuarios u
      ON u.id_usuario =
         s.id_usuario

    WHERE
      s.id_incidencia = $1

    ORDER BY
      s.fecha_hora DESC,
      s.id_seguimiento DESC;
  `;

  const resultado =
    await pool.query(
      consulta,
      [idIncidencia]
    );

  return resultado.rows;
}


/* ======================================
   GENERAR CÓDIGO
====================================== */

export async function generarCodigoIncidencia() {
  const consulta = `
    SELECT codigo
    FROM incidencias
    WHERE codigo ~ '^INC-[0-9]+$'

    ORDER BY
      CAST(
        SUBSTRING(
          codigo
          FROM '[0-9]+$'
        ) AS INTEGER
      ) DESC

    LIMIT 1;
  `;

  const resultado =
    await pool.query(
      consulta
    );

  if (
    resultado.rows.length === 0
  ) {
    return "INC-01";
  }

  const numeroActual =
    Number(
      resultado.rows[0]
        .codigo
        .replace(
          "INC-",
          ""
        )
    );

  return `INC-${String(
    numeroActual + 1
  ).padStart(
    2,
    "0"
  )}`;
}


/* ======================================
   INSERT
====================================== */

export async function insertarIncidencia(
  datos
) {
  const consulta = `
    INSERT INTO incidencias (
      codigo,
      id_operacion,
      id_inspeccion,
      id_contenedor,
      id_muelle,
      id_usuario_reportante,
      id_usuario_responsable,
      id_tipo_incidencia,
      prioridad,
      descripcion,
      estado,
      resolucion,
      evidencias
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13
    )
    RETURNING id_incidencia;
  `;

  const resultado =
    await pool.query(
      consulta,
      [
        datos.codigo,
        datos.id_operacion,
        datos.id_inspeccion,
        datos.id_contenedor,
        datos.id_muelle,
        datos.id_usuario_reportante,
        datos.id_usuario_responsable,
        datos.id_tipo_incidencia,
        datos.prioridad,
        datos.descripcion,
        datos.estado,
        datos.resolucion,
        JSON.stringify(
          datos.evidencias || []
        ),
      ]
    );

  return resultado.rows[0];
}


/* ======================================
   UPDATE
====================================== */

export async function actualizarIncidenciaPorId(
  idIncidencia,
  datos
) {
  const consulta = `
    UPDATE incidencias

    SET
      id_operacion = $1,
      id_inspeccion = $2,
      id_contenedor = $3,
      id_muelle = $4,
      id_usuario_reportante = $5,
      id_usuario_responsable = $6,
      id_tipo_incidencia = $7,
      prioridad = $8,
      descripcion = $9,
      estado = $10,
      resolucion = $11,
      evidencias = $12,

      fecha_resolucion =
        CASE
          WHEN $10 = 'Resuelta'
          THEN COALESCE(
            fecha_resolucion,
            NOW()
          )
          ELSE fecha_resolucion
        END,

      fecha_cierre =
        CASE
          WHEN $10 = 'Cerrada'
          THEN COALESCE(
            fecha_cierre,
            NOW()
          )
          ELSE fecha_cierre
        END,

      fecha_actualizacion =
        NOW()

    WHERE
      id_incidencia = $13

    RETURNING
      id_incidencia;
  `;

  const resultado =
    await pool.query(
      consulta,
      [
        datos.id_operacion,
        datos.id_inspeccion,
        datos.id_contenedor,
        datos.id_muelle,
        datos.id_usuario_reportante,
        datos.id_usuario_responsable,
        datos.id_tipo_incidencia,
        datos.prioridad,
        datos.descripcion,
        datos.estado,
        datos.resolucion,
        JSON.stringify(
          datos.evidencias || []
        ),
        idIncidencia,
      ]
    );

  return (
    resultado.rowCount > 0
  );
}


/* ======================================
   CAMBIO DE ESTADO
====================================== */

export async function actualizarEstadoIncidenciaPorId(
  idIncidencia,
  estado
) {
  const consulta = `
    UPDATE incidencias

    SET
      estado = $1,

      fecha_resolucion =
        CASE
          WHEN $1 = 'Resuelta'
          THEN COALESCE(
            fecha_resolucion,
            NOW()
          )
          ELSE fecha_resolucion
        END,

      fecha_cierre =
        CASE
          WHEN $1 = 'Cerrada'
          THEN COALESCE(
            fecha_cierre,
            NOW()
          )
          ELSE fecha_cierre
        END,

      fecha_actualizacion =
        NOW()

    WHERE
      id_incidencia = $2

    RETURNING
      id_incidencia;
  `;

  const resultado =
    await pool.query(
      consulta,
      [
        estado,
        idIncidencia,
      ]
    );

  return (
    resultado.rowCount > 0
  );
}


/* ======================================
   INSERT SEGUIMIENTO
====================================== */

export async function insertarSeguimiento(
  datos
) {
  const consulta = `
    INSERT INTO incidencia_seguimiento (
      id_incidencia,
      id_usuario,
      tipo_evento,
      estado_anterior,
      estado_nuevo,
      comentario
    )
    VALUES (
      $1, $2, $3, $4, $5, $6
    )
    RETURNING id_seguimiento;
  `;

  const resultado =
    await pool.query(
      consulta,
      [
        datos.id_incidencia,
        datos.id_usuario,
        datos.tipo_evento,
        datos.estado_anterior,
        datos.estado_nuevo,
        datos.comentario,
      ]
    );

  return resultado.rows[0];
}


/* ======================================
   DELETE
====================================== */

export async function eliminarIncidenciaPorId(
  idIncidencia
) {
  const consulta = `
    DELETE FROM incidencias

    WHERE
      id_incidencia = $1

    RETURNING
      id_incidencia,
      codigo;
  `;

  const resultado =
    await pool.query(
      consulta,
      [idIncidencia]
    );

  return (
    resultado.rows[0] ||
    null
  );
}


/* ======================================
   EXISTENCIAS
====================================== */

export async function existeOperacion(id) {
  const resultado =
    await pool.query(
      `
        SELECT EXISTS (
          SELECT 1
          FROM operaciones_portuarias
          WHERE id_operacion = $1
        ) AS existe;
      `,
      [id]
    );

  return resultado.rows[0].existe;
}


export async function existeInspeccion(id) {
  const resultado =
    await pool.query(
      `
        SELECT EXISTS (
          SELECT 1
          FROM inspecciones
          WHERE id_inspeccion = $1
        ) AS existe;
      `,
      [id]
    );

  return resultado.rows[0].existe;
}


export async function inspeccionPerteneceOperacion(
  idInspeccion,
  idOperacion
) {
  const resultado =
    await pool.query(
      `
        SELECT EXISTS (
          SELECT 1
          FROM inspecciones
          WHERE id_inspeccion = $1
            AND id_operacion = $2
        ) AS pertenece;
      `,
      [
        idInspeccion,
        idOperacion,
      ]
    );

  return resultado.rows[0].pertenece;
}


export async function existeContenedor(id) {
  const resultado =
    await pool.query(
      `
        SELECT EXISTS (
          SELECT 1
          FROM contenedores
          WHERE id_contenedor = $1
        ) AS existe;
      `,
      [id]
    );

  return resultado.rows[0].existe;
}


export async function contenedorPerteneceOperacion(
  idContenedor,
  idOperacion
) {
  const resultado =
    await pool.query(
      `
        SELECT EXISTS (
          SELECT 1
          FROM contenedores
          WHERE id_contenedor = $1
            AND id_operacion = $2
        ) AS pertenece;
      `,
      [
        idContenedor,
        idOperacion,
      ]
    );

  return resultado.rows[0].pertenece;
}


export async function existeMuelle(id) {
  const resultado =
    await pool.query(
      `
        SELECT EXISTS (
          SELECT 1
          FROM muelles
          WHERE id_muelle = $1
        ) AS existe;
      `,
      [id]
    );

  return resultado.rows[0].existe;
}


export async function existeUsuario(id) {
  const resultado =
    await pool.query(
      `
        SELECT EXISTS (
          SELECT 1
          FROM usuarios
          WHERE id_usuario = $1
        ) AS existe;
      `,
      [id]
    );

  return resultado.rows[0].existe;
}


export async function existeTipoIncidencia(id) {
  const resultado =
    await pool.query(
      `
        SELECT EXISTS (
          SELECT 1
          FROM tipos_incidencia
          WHERE id_tipo_incidencia = $1
        ) AS existe;
      `,
      [id]
    );

  return resultado.rows[0].existe;
}


/* ======================================
   OPCIONES DEL FORMULARIO
====================================== */

export async function obtenerOpcionesIncidencia() {
  const [
    operaciones,
    contenedores,
    inspecciones,
    muelles,
    usuarios,
    tipos,
  ] =
    await Promise.all([

      pool.query(`
        SELECT
          op.id_operacion,
          op.codigo,
          op.estado,
          b.nombre AS buque,

          to_jsonb(op)->>'destino'
            AS destino,

          m.id_muelle,
          m.codigo AS muelle

        FROM operaciones_portuarias op

        LEFT JOIN buques b
          ON b.id_buque =
             op.id_buque

        LEFT JOIN LATERAL (
          SELECT
            am.id_muelle

          FROM asignaciones_muelle am

          WHERE
            am.id_operacion =
            op.id_operacion

            AND am.estado =
                'Confirmada'

          ORDER BY
            am.fecha_asignacion DESC

          LIMIT 1
        ) asignacion ON TRUE

        LEFT JOIN muelles m
          ON m.id_muelle =
             asignacion.id_muelle

        ORDER BY
          op.id_operacion DESC;
      `),


      pool.query(`
        SELECT
          id_contenedor,
          codigo,
          id_operacion,
          estado

        FROM contenedores

        ORDER BY
          codigo ASC;
      `),


      pool.query(`
        SELECT
          id_inspeccion,
          codigo,
          id_operacion,
          id_contenedor,
          estado

        FROM inspecciones

        ORDER BY
          id_inspeccion DESC;
      `),


      pool.query(`
        SELECT
          id_muelle,
          codigo,
          nombre,
          estado_operativo

        FROM muelles

        WHERE
          activo = TRUE

        ORDER BY
          codigo ASC;
      `),


      pool.query(`
        SELECT
          u.id_usuario,

          COALESCE(
            NULLIF(
              CONCAT_WS(
                ' ',
                to_jsonb(u)->>'nombres',
                to_jsonb(u)->>'apellidos'
              ),
              ''
            ),
            to_jsonb(u)->>'nombre_completo',
            to_jsonb(u)->>'usuario',
            to_jsonb(u)->>'username',
            to_jsonb(u)->>'correo',
            CONCAT(
              'Usuario ',
              u.id_usuario
            )
          ) AS nombre,

          COALESCE(
            to_jsonb(r)->>'nombre',
            to_jsonb(r)->>'nombre_rol',
            ''
          ) AS rol

        FROM usuarios u

        LEFT JOIN roles r
          ON r.id_rol =
             NULLIF(
               to_jsonb(u)->>'id_rol',
               ''
             )::INTEGER

        ORDER BY
          u.id_usuario ASC;
      `),


      pool.query(`
        SELECT
          id_tipo_incidencia,

          COALESCE(
            to_jsonb(t)->>'nombre',
            to_jsonb(t)->>'descripcion',
            to_jsonb(t)->>'codigo',
            CONCAT(
              'Tipo ',
              id_tipo_incidencia
            )
          ) AS nombre

        FROM tipos_incidencia t

        ORDER BY
          id_tipo_incidencia ASC;
      `),

    ]);


  return {
    operaciones:
      operaciones.rows,

    contenedores:
      contenedores.rows,

    inspecciones:
      inspecciones.rows,

    muelles:
      muelles.rows,

    usuarios:
      usuarios.rows,

    tipos_incidencia:
      tipos.rows,
  };
}