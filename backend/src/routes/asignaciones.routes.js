import {
  Router,
} from "express";

import {
  confirmar,
  evaluarMuelles,
} from "../controllers/asignaciones.controller.js";


const router =
  Router();


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