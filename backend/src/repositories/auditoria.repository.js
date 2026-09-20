import pool from "../config/db.js";


/* ======================================
   LISTAR AUDITORÍA
====================================== */

export async function listarRegistrosAuditoria() {
  const consulta = `
    SELECT
      a.id_auditoria,
      a.id_usuario,

      COALESCE(
        NULLIF(
          TRIM(
            CONCAT_WS(
              ' ',
              u.nombres,
              u.apellidos
            )
          ),
          ''
        ),
        'Sistema'
      ) AS usuario,

      COALESCE(
        r.nombre,
        'Sin rol'
      ) AS rol,

      a.accion,
      a.modulo,
      a.entidad,
      a.id_registro_afectado,

      a.fecha_hora AS fecha,

      a.valores_anteriores
        AS datos_anteriores,

      a.valores_nuevos
        AS datos_nuevos,

      a.descripcion

    FROM auditoria a

    LEFT JOIN usuarios u
      ON u.id_usuario =
        a.id_usuario

    LEFT JOIN roles r
      ON r.id_rol =
        u.id_rol

    ORDER BY
      a.fecha_hora DESC,
      a.id_auditoria DESC;
  `;


  const resultado =
    await pool.query(
      consulta
    );


  return resultado.rows;
}


/* ======================================
   DETALLE DE AUDITORÍA
====================================== */

export async function buscarAuditoriaPorId(
  idAuditoria
) {
  const consulta = `
    SELECT
      a.id_auditoria,
      a.id_usuario,

      COALESCE(
        NULLIF(
          TRIM(
            CONCAT_WS(
              ' ',
              u.nombres,
              u.apellidos
            )
          ),
          ''
        ),
        'Sistema'
      ) AS usuario,

      COALESCE(
        r.nombre,
        'Sin rol'
      ) AS rol,

      a.accion,
      a.modulo,
      a.entidad,
      a.id_registro_afectado,

      a.fecha_hora AS fecha,

      a.valores_anteriores
        AS datos_anteriores,

      a.valores_nuevos
        AS datos_nuevos,

      a.descripcion

    FROM auditoria a

    LEFT JOIN usuarios u
      ON u.id_usuario =
        a.id_usuario

    LEFT JOIN roles r
      ON r.id_rol =
        u.id_rol

    WHERE
      a.id_auditoria = $1;
  `;


  const resultado =
    await pool.query(
      consulta,
      [idAuditoria]
    );


  return resultado.rows[0];
}


/* ======================================
   REGISTRAR EVENTO
====================================== */

export async function insertarAuditoria({
  idUsuario,
  accion,
  modulo,
  entidad,
  idRegistroAfectado,
  valoresAnteriores = null,
  valoresNuevos = null,
  descripcion = null,
}) {
  const consulta = `
    INSERT INTO auditoria (
      id_usuario,
      accion,
      modulo,
      entidad,
      id_registro_afectado,
      fecha_hora,
      valores_anteriores,
      valores_nuevos,
      descripcion
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      NOW(),
      $6::jsonb,
      $7::jsonb,
      $8
    )
    RETURNING id_auditoria;
  `;


  const resultado =
    await pool.query(
      consulta,
      [
        idUsuario || null,
        accion,
        modulo,
        entidad,
        idRegistroAfectado
          ? String(
              idRegistroAfectado
            )
          : null,

        valoresAnteriores
          ? JSON.stringify(
              valoresAnteriores
            )
          : null,

        valoresNuevos
          ? JSON.stringify(
              valoresNuevos
            )
          : null,

        descripcion,
      ]
    );


  return resultado.rows[0];
}