import pool from "../config/db.js";


export async function buscarUsuarioPorLogin(
  identificador
) {

  const resultado =
    await pool.query(
      `
        SELECT
          u.id_usuario,
          u.nombres,
          u.apellidos,
          u.correo,
          u.nombre_usuario,
          u.password_hash,
          u.activo,
          u.ultimo_acceso,
          r.id_rol,
          r.nombre AS rol
        FROM usuarios u
        INNER JOIN roles r
          ON r.id_rol = u.id_rol
        WHERE
          u.nombre_usuario = $1
          OR u.correo = $1
        LIMIT 1
      `,
      [identificador]
    );


  return resultado.rows[0];
}


export async function actualizarUltimoAcceso(
  idUsuario
) {

  await pool.query(
    `
      UPDATE usuarios
      SET ultimo_acceso = NOW()
      WHERE id_usuario = $1
    `,
    [idUsuario]
  );
}


export async function obtenerUsuarioPorId(
  idUsuario
) {

  const resultado =
    await pool.query(
      `
        SELECT
          u.id_usuario,
          u.nombres,
          u.apellidos,
          u.correo,
          u.nombre_usuario,
          u.activo,
          u.fecha_creacion,
          u.ultimo_acceso,
          r.id_rol,
          r.nombre AS rol
        FROM usuarios u
        INNER JOIN roles r
          ON r.id_rol = u.id_rol
        WHERE u.id_usuario = $1
        LIMIT 1
      `,
      [idUsuario]
    );


  return resultado.rows[0];
}


export async function registrarLoginAuditoria(
  idUsuario
) {

  await pool.query(
    `
      INSERT INTO auditoria (
        id_usuario,
        accion,
        modulo,
        entidad,
        id_registro_afectado,
        descripcion
      )
      VALUES (
        $1,
        'LOGIN',
        'Autenticación',
        'usuario',
        $2,
        'Inicio de sesión exitoso'
      )
    `,
    [
      idUsuario,
      String(idUsuario),
    ]
  );
}