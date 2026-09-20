import pool from "../config/db.js";


export async function listarRoles() {
  const consulta = `
    SELECT
      r.id_rol,
      r.nombre,
      r.descripcion,
      r.activo,
      COUNT(u.id_usuario)::INTEGER AS usuarios
    FROM roles r
    LEFT JOIN usuarios u
      ON u.id_rol = r.id_rol
    GROUP BY
      r.id_rol,
      r.nombre,
      r.descripcion,
      r.activo
    ORDER BY r.id_rol;
  `;

  const resultado =
    await pool.query(consulta);

  return resultado.rows;
}


export async function listarPermisos() {
  const consulta = `
    SELECT
      id_permiso,
      codigo,
      nombre,
      modulo,
      descripcion
    FROM permisos
    ORDER BY
      modulo,
      id_permiso;
  `;

  const resultado =
    await pool.query(consulta);

  return resultado.rows;
}


export async function buscarRolPorId(
  idRol
) {
  const consulta = `
    SELECT
      id_rol,
      nombre,
      descripcion,
      activo
    FROM roles
    WHERE id_rol = $1;
  `;

  const resultado =
    await pool.query(
      consulta,
      [idRol]
    );

  return resultado.rows[0];
}


export async function obtenerPermisosRol(
  idRol
) {
  const consulta = `
    SELECT
      p.id_permiso,
      p.codigo,
      p.nombre,
      p.modulo,
      p.descripcion
    FROM permisos p
    INNER JOIN rol_permiso rp
      ON rp.id_permiso = p.id_permiso
    WHERE rp.id_rol = $1
    ORDER BY
      p.modulo,
      p.id_permiso;
  `;

  const resultado =
    await pool.query(
      consulta,
      [idRol]
    );

  return resultado.rows;
}


export async function obtenerPermisosExistentes(
  idsPermisos
) {
  if (idsPermisos.length === 0) {
    return [];
  }


  const consulta = `
    SELECT id_permiso
    FROM permisos
    WHERE id_permiso = ANY($1::INTEGER[]);
  `;


  const resultado =
    await pool.query(
      consulta,
      [idsPermisos]
    );


  return resultado.rows.map(
    (fila) =>
      fila.id_permiso
  );
}


export async function reemplazarPermisosRol(
  idRol,
  idsPermisos
) {
  const cliente =
    await pool.connect();


  try {
    await cliente.query(
      "BEGIN"
    );


    await cliente.query(
      `
        DELETE FROM rol_permiso
        WHERE id_rol = $1;
      `,
      [idRol]
    );


    for (
      const idPermiso
      of idsPermisos
    ) {
      await cliente.query(
        `
          INSERT INTO rol_permiso (
            id_rol,
            id_permiso
          )
          VALUES ($1, $2);
        `,
        [
          idRol,
          idPermiso,
        ]
      );
    }


    await cliente.query(
      "COMMIT"
    );


  } catch (error) {
    await cliente.query(
      "ROLLBACK"
    );

    throw error;

  } finally {
    cliente.release();
  }
}