import bcrypt from "bcryptjs";

import pool from "../config/db.js";


async function crearAdministrador() {
  try {

    /* ======================================
       BUSCAR ROL ADMINISTRADOR
    ====================================== */

    const resultadoRol =
      await pool.query(
        `
          SELECT id_rol
          FROM roles
          WHERE nombre = $1
            AND activo = TRUE
          LIMIT 1
        `,
        ["Administrador"]
      );


    if (
      resultadoRol.rows.length === 0
    ) {
      throw new Error(
        "No existe el rol Administrador."
      );
    }


    const idRol =
      resultadoRol.rows[0].id_rol;


    /* ======================================
       DATOS DEL ADMINISTRADOR
    ====================================== */

    const nombres =
      "Regina";

    const apellidos =
      "Cadenas";

    const correo =
      "regina.cadenas@talassa.com";

    const nombreUsuario =
      "regina.cadenas";

    /*
      Cambia esta contraseña antes
      de ejecutar el script.
    */

    const password =
      process.env.ADMIN_PASSWORD;


    /* ======================================
       VERIFICAR SI YA EXISTE
    ====================================== */

    const existente =
      await pool.query(
        `
          SELECT id_usuario
          FROM usuarios
          WHERE correo = $1
             OR nombre_usuario = $2
          LIMIT 1
        `,
        [
          correo,
          nombreUsuario,
        ]
      );


    if (
      existente.rows.length > 0
    ) {
      console.log(
        "El administrador ya existe."
      );

      return;
    }


    /* ======================================
       GENERAR HASH
    ====================================== */

    const passwordHash =
      await bcrypt.hash(
        password,
        12
      );


    /* ======================================
       CREAR USUARIO
    ====================================== */

    const resultadoUsuario =
      await pool.query(
        `
          INSERT INTO usuarios (
            nombres,
            apellidos,
            correo,
            nombre_usuario,
            password_hash,
            id_rol,
            activo
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            TRUE
          )
          RETURNING
            id_usuario,
            nombres,
            apellidos,
            correo,
            nombre_usuario
        `,
        [
          nombres,
          apellidos,
          correo,
          nombreUsuario,
          passwordHash,
          idRol,
        ]
      );


    const usuario =
      resultadoUsuario.rows[0];


    console.log(
      "Administrador creado correctamente:"
    );

    console.log(usuario);

  } catch (error) {

    console.error(
      "Error al crear administrador:",
      error.message
    );

  } finally {

    await pool.end();

  }
}


crearAdministrador();