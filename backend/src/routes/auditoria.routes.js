import express
  from "express";

import {
  detalle,
  listar,
} from "../controllers/auditoria.controller.js";

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
    "AUD_VER"
  )
);


/* ======================================
   RUTAS DE AUDITORÍA
====================================== */

router.get(
  "/",
  listar
);


router.get(
  "/:id",
  detalle
);


export default router;