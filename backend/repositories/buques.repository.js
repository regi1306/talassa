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