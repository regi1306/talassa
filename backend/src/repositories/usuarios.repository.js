import pool from "../config/db.js";


/* ======================================
   LISTAR USUARIOS
====================================== */

export async function listarUsuarios() {
  const resultado =
    await pool.query(
      `
        SELECT
          u.id_usuario,
          u.nombres,
          u.apellidos,
          u.correo,
          u.nombre_usuario AS usuario,
          u.activo,
          u.ultimo_acceso,
          u.fecha_creacion,
          r.id_rol,
          r.nombre AS rol
        FROM usuarios u
        INNER JOIN roles r
          ON r.id_rol = u.id_rol
        ORDER BY
          u.nombres,
          u.apellidos
      `
    );


  return resultado.rows;
}


/* ======================================
   BUSCAR USUARIO POR ID
====================================== */

export async function buscarUsuarioPorId(
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
          u.nombre_usuario AS usuario,
          u.activo,
          u.ultimo_acceso,
          u.fecha_creacion,
          r.id_rol,
          r.nombre AS rol
        FROM usuarios u
        INNER JOIN roles r
          ON r.id_rol = u.id_rol
        WHERE u.id_usuario = $1
      `,
      [idUsuario]
    );


  return resultado.rows[0];
}


/* ======================================
   BUSCAR ROL POR NOMBRE
====================================== */

export async function buscarRolPorNombre(
  nombreRol
) {
  const resultado =
    await pool.query(
      `
        SELECT
          id_rol,
          nombre
        FROM roles
        WHERE nombre = $1
      `,
      [nombreRol]
    );


  return resultado.rows[0];
}


/* ======================================
   BUSCAR CORREO DUPLICADO
====================================== */

export async function buscarCorreoExistente(
  correo,
  idExcluir = null
) {
  const resultado =
    await pool.query(
      `
        SELECT
          id_usuario
        FROM usuarios
        WHERE LOWER(correo) =
              LOWER($1)
          AND (
            $2::integer IS NULL
            OR id_usuario <> $2
          )
        LIMIT 1
      `,
      [
        correo,
        idExcluir,
      ]
    );


  return resultado.rows[0];
}


/* ======================================
   BUSCAR NOMBRE DE USUARIO DUPLICADO
====================================== */

export async function buscarNombreUsuarioExistente(
  nombreUsuario,
  idExcluir = null
) {
  const resultado =
    await pool.query(
      `
        SELECT
          id_usuario
        FROM usuarios
        WHERE LOWER(nombre_usuario) =
              LOWER($1)
          AND (
            $2::integer IS NULL
            OR id_usuario <> $2
          )
        LIMIT 1
      `,
      [
        nombreUsuario,
        idExcluir,
      ]
    );


  return resultado.rows[0];
}


/* ======================================
   CREAR USUARIO
====================================== */

export async function crearUsuario({
  idRol,
  nombres,
  apellidos,
  correo,
  usuario,
  passwordHash,
  activo,
}) {
  const resultado =
    await pool.query(
      `
        INSERT INTO usuarios (
          id_rol,
          nombres,
          apellidos,
          correo,
          nombre_usuario,
          password_hash,
          activo,
          fecha_creacion
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          NOW()
        )
        RETURNING id_usuario
      `,
      [
        idRol,
        nombres,
        apellidos,
        correo,
        usuario,
        passwordHash,
        activo,
      ]
    );


  return resultado.rows[0];
}


/* ======================================
   ACTUALIZAR USUARIO
====================================== */

export async function actualizarUsuario({
  idUsuario,
  idRol,
  nombres,
  apellidos,
  correo,
  usuario,
  passwordHash,
  activo,
}) {
  /*
    Si se recibió una contraseña nueva,
    se actualiza también password_hash.
  */

  if (passwordHash) {
    await pool.query(
      `
        UPDATE usuarios
        SET
          id_rol = $1,
          nombres = $2,
          apellidos = $3,
          correo = $4,
          nombre_usuario = $5,
          password_hash = $6,
          activo = $7
        WHERE id_usuario = $8
      `,
      [
        idRol,
        nombres,
        apellidos,
        correo,
        usuario,
        passwordHash,
        activo,
        idUsuario,
      ]
    );

    return;
  }


  /*
    Si no se recibió contraseña,
    conservamos el hash actual.
  */

  await pool.query(
    `
      UPDATE usuarios
      SET
        id_rol = $1,
        nombres = $2,
        apellidos = $3,
        correo = $4,
        nombre_usuario = $5,
        activo = $6
      WHERE id_usuario = $7
    `,
    [
      idRol,
      nombres,
      apellidos,
      correo,
      usuario,
      activo,
      idUsuario,
    ]
  );
}


/* ======================================
   ACTIVAR / DESACTIVAR
====================================== */

export async function cambiarEstadoUsuario(
  idUsuario,
  activo
) {
  await pool.query(
    `
      UPDATE usuarios
      SET
        activo = $1
      WHERE id_usuario = $2
    `,
    [
      activo,
      idUsuario,
    ]
  );
}