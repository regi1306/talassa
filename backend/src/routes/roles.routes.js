import express
  from "express";

import {
  actualizarPermisos,
  listar,
  listarTodosLosPermisos,
  permisosDelRol,
} from "../controllers/roles.controller.js";

import {
  verificarToken,
} from "../middlewares/auth.middleware.js";

import {
  verificarPermiso,
} from "../middlewares/permisos.middleware.js";


const router =
  express.Router();


/* ======================================
   AUTENTICACIÓN
====================================== */

router.use(
  verificarToken
);


/* ======================================
   AUTORIZACIÓN
====================================== */

router.use(
  verificarPermiso(
    "ROL_GESTIONAR"
  )
);


/* ======================================
   RUTAS
====================================== */

router.get(
  "/",
  listar
);


router.get(
  "/permisos",
  listarTodosLosPermisos
);


router.get(
  "/:id/permisos",
  permisosDelRol
);


router.put(
  "/:id/permisos",
  actualizarPermisos
);


export default router;