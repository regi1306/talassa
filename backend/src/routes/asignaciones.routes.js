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


const router =
  Router();


/* ======================================
   TODAS LAS RUTAS REQUIEREN SESIÓN
====================================== */

router.use(
  verificarToken
);


/* ======================================
   EVALUACIÓN
====================================== */

router.get(
  "/evaluar/:idOperacion",
  evaluarMuelles
);


/* ======================================
   CONFIRMACIÓN
====================================== */

router.post(
  "/confirmar",
  confirmar
);


export default router;