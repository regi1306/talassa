import express from "express";
import cors from "cors";

import pool from "./config/db.js";

/* ======================================
   RUTAS DE AUTENTICACIÓN Y ADMINISTRACIÓN
====================================== */

import authRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import rolesRoutes from "./routes/roles.routes.js";
import empresasRoutes from "./routes/empresas.routes.js";
import catalogosRoutes from "./routes/catalogos.routes.js";
import auditoriaRoutes from "./routes/auditoria.routes.js";

/* ======================================
   RUTAS DE ALEXANDRA
====================================== */

import buquesRoutes from "./routes/buques.routes.js";
import operacionesRoutes from "./routes/operaciones.routes.js";
import contenedoresRoutes from "./routes/contenedores.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

/* ======================================
   RUTAS DE STEPHANIEE
====================================== */

import muellesRoutes from "./routes/muelles.routes.js";
import inspeccionesRoutes from "./routes/inspecciones.routes.js";
import incidenciasRoutes from "./routes/incidencias.routes.js";
import asignacionesRoutes from "./routes/asignaciones.routes.js";


const app = express();


/* ======================================
   MIDDLEWARES GENERALES
====================================== */

app.use(cors());

app.use(
  express.json({
    limit: "15mb",
  })
);


/* ======================================
   RUTAS DE REGINA
====================================== */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/usuarios",
  usuariosRoutes
);

app.use(
  "/api/roles",
  rolesRoutes
);

app.use(
  "/api/empresas",
  empresasRoutes
);

app.use(
  "/api/catalogos",
  catalogosRoutes
);

app.use(
  "/api/auditoria",
  auditoriaRoutes
);


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

app.use(
  "/api/contenedores",
  contenedoresRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);


/* ======================================
   RUTAS DE STEPHANIEE
====================================== */

app.use(
  "/api/muelles",
  muellesRoutes
);

app.use(
  "/api/inspecciones",
  inspeccionesRoutes
);

app.use(
  "/api/incidencias",
  incidenciasRoutes
);

app.use(
  "/api/asignaciones",
  asignacionesRoutes
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