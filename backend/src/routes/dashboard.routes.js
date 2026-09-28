import {
  Router,
} from "express";

import {
  mostrarResumenDashboard,
} from "../controllers/dashboard.controller.js";

import {
  verificarToken,
} from "../middlewares/auth.middleware.js";

import {
  verificarPermiso,
} from "../middlewares/permisos.middleware.js";


const router =
  Router();


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
    "DASH_VER"
  )
);


/* ======================================
   RESUMEN
====================================== */

router.get(
  "/resumen",
  mostrarResumenDashboard
);


export default router;