import { Router } from "express";

import {
  actualizarBuque,
  actualizarEstadoBuque,
  crearBuque,
  obtenerBuque,
  obtenerBuques,
  obtenerOpcionesBuque,
} from "../controllers/buques.controller.js";

import {
  verificarToken,
} from "../middlewares/auth.middleware.js";

import {
  verificarPermiso,
} from "../middlewares/permisos.middleware.js";


const router = Router();


/* ======================================
   TODAS LAS RUTAS REQUIEREN SESIÓN
====================================== */

router.use(
  verificarToken
);


/* ======================================
   OPCIONES DEL FORMULARIO
====================================== */

router.get(
  "/opciones-formulario",
  verificarPermiso(
    "BUQ_GESTIONAR"
  ),
  obtenerOpcionesBuque
);


/* ======================================
   LISTADO
====================================== */

router.get(
  "/",
  verificarPermiso(
    "BUQ_VER"
  ),
  obtenerBuques
);


/* ======================================
   DETALLE
====================================== */

router.get(
  "/:id",
  verificarPermiso(
    "BUQ_VER"
  ),
  obtenerBuque
);


/* ======================================
   CREAR
====================================== */

router.post(
  "/",
  verificarPermiso(
    "BUQ_GESTIONAR"
  ),
  crearBuque
);


/* ======================================
   EDITAR
====================================== */

router.put(
  "/:id",
  verificarPermiso(
    "BUQ_GESTIONAR"
  ),
  actualizarBuque
);


/* ======================================
   CAMBIAR ESTADO
====================================== */

router.patch(
  "/:id/estado",
  verificarPermiso(
    "BUQ_GESTIONAR"
  ),
  actualizarEstadoBuque
);


export default router;