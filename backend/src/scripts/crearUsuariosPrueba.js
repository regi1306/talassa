import "dotenv/config";
import bcrypt from "bcryptjs";

import pool from "../config/db.js";


const usuariosPrueba = [
  {
    nombres: "Carlos",
    apellidos: "Hernández",
    correo: "carlos.hernandez@talassa.com",
    nombreUsuario: "carlos.hernandez",
    rol: "Operador portuario",
    password: process.env.OPERADOR_PASSWORD,
  },
  {
    nombres: "María",
    apellidos: "López",
    correo: "maria.lopez@talassa.com",
    nombreUsuario: "maria.lopez",
    rol: "Inspector",
    password: process.env.INSPECTOR_PASSWORD,
  },
];


async function crearUsuario(datos) {
  const {
    nombres,
    apellidos,
    correo,
    nombreUsuario,
    rol,
    password,
  } = datos;


  if (!password) {
    throw new Error(
      `No se configuró la contraseña para ${nombreUsuario}.`
    );
  }


  const resultadoRol =
    await pool.query(
      `
        SELECT id_rol
        FROM roles
        WHERE nombre = $1
          AND activo = TRUE
        LIMIT 1
      `,
      [rol]
    );


  if (resultadoRol.rows.length === 0) {
    throw new Error(
      `No existe el rol "${rol}".`
    );
  }


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


  if (existente.rows.length > 0) {
    console.log(
      `El usuario ${nombreUsuario} ya existe.`
    );

    return;
  }


  const passwordHash =
    await bcrypt.hash(
      password,
      12
    );


  const resultado =
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
        resultadoRol.rows[0].id_rol,
      ]
    );


  console.log(
    `Usuario ${nombreUsuario} creado correctamente:`
  );

  console.log(
    resultado.rows[0]
  );
}


async function ejecutar() {
  try {

    for (
      const usuario
      of usuariosPrueba
    ) {
      await crearUsuario(
        usuario
      );
    }

    console.log(
      "Usuarios de prueba preparados correctamente."
    );

  } catch (error) {

    console.error(
      "Error al crear usuarios de prueba:",
      error.message
    );

  } finally {

    await pool.end();

  }
}


ejecutar();