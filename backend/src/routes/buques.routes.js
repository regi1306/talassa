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


const router = Router();


/* ======================================
   PROTEGER RUTAS CON JWT
====================================== */

router.use(
  verificarToken
);


/* ======================================
   OPCIONES DEL FORMULARIO
====================================== */

router.get(
  "/opciones-formulario",
  obtenerOpcionesBuque
);


/* ======================================
   LISTADO
====================================== */

router.get(
  "/",
  obtenerBuques
);


/* ======================================
   DETALLE
====================================== */

router.get(
  "/:id",
  obtenerBuque
);


/* ======================================
   CREAR
====================================== */

router.post(
  "/",
  crearBuque
);


/* ======================================
   EDITAR
====================================== */

router.put(
  "/:id",
  actualizarBuque
);


/* ======================================
   CAMBIAR ESTADO
====================================== */

router.patch(
  "/:id/estado",
  actualizarEstadoBuque
);


export default router;