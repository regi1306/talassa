import {
  Router,
} from "express";

import {
  confirmar,
  evaluarMuelles,
} from "../controllers/asignaciones.controller.js";

import {
  verificarToken,
} from "../middlewares/auth.middleware.js";

import {
  verificarPermiso,
} from "../middlewares/permisos.middleware.js";


const router =
  Router();


/* ======================================
   TODAS LAS RUTAS REQUIEREN SESIÓN
====================================== */

router.use(
  verificarToken
);


/* ======================================
   EVALUACIÓN DE MUELLES
====================================== */

router.get(
  "/evaluar/:idOperacion",
  verificarPermiso(
    "MUE_GESTIONAR"
  ),
  evaluarMuelles
);


/* ======================================
   CONFIRMACIÓN DE ASIGNACIÓN
====================================== */

router.post(
  "/confirmar",
  verificarPermiso(
    "MUE_GESTIONAR"
  ),
  confirmar
);


export default router;