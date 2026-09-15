import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import buquesRoutes from "./routes/buques.routes.js";
import operacionesRoutes from "./routes/operaciones.routes.js";

import pool from "./config/db.js";


const app = express();


app.use(cors());

app.use(express.json());


/* ======================================
   RUTAS DE ALEXANDRA
====================================== */

app.use(
  "/api/buques",
  buquesRoutes
);

app.use(
  "/api/operaciones",
  operacionesRoutes
);

/* ======================================
   RUTAS DE REGINA
====================================== */

app.use(
  "/api/auth",
  authRoutes
);

/* ======================================
   PRUEBA GENERAL DE LA API
====================================== */

app.get(
  "/api/health",
  (req, res) => {
    res
      .status(200)
      .json({
        ok: true,

        message:
          "API de TALASSA funcionando correctamente",
      });
  }
);


/* ======================================
   PRUEBA DE POSTGRESQL
====================================== */

app.get(
  "/api/health/database",
  async (req, res) => {
    try {

      const resultado =
        await pool.query(`
          SELECT
            current_database() AS database,
            current_user AS usuario,
            NOW() AS fecha_servidor
        `);


      res
        .status(200)
        .json({
          ok: true,

          message:
            "Conexión con PostgreSQL exitosa",

          data:
            resultado.rows[0],
        });

    } catch (error) {

      console.error(
        "Error al conectar con PostgreSQL:",
        error
      );


      res
        .status(500)
        .json({
          ok: false,

          message:
            "No fue posible conectar con PostgreSQL",
        });
    }
  }
);


export default app;