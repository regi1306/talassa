import { Router } from "express";

import {
  actualizarLlegadaOperacion,
  actualizarOperacion,
  actualizarSalidaOperacion,
  crearOperacion,
  obtenerOperacion,
  obtenerOperaciones,
  obtenerOpcionesOperacion,
} from "../controllers/operaciones.controller.js";

import {
  verificarToken,
} from "../middlewares/auth.middleware.js";


const router = Router();


/* ======================================
   PROTEGER TODAS LAS RUTAS CON JWT
====================================== */

router.use(
  verificarToken
);


/* ======================================
   OPCIONES DEL FORMULARIO
====================================== */

router.get(
  "/opciones-formulario",
  obtenerOpcionesOperacion
);


/* ======================================
   LISTADO
====================================== */

router.get(
  "/",
  obtenerOperaciones
);


/* ======================================
   DETALLE
====================================== */

router.get(
  "/:id",
  obtenerOperacion
);


/* ======================================
   CREAR
====================================== */

router.post(
  "/",
  crearOperacion
);


/* ======================================
   EDITAR
====================================== */

router.put(
  "/:id",
  actualizarOperacion
);


/* ======================================
   REGISTRAR LLEGADA
====================================== */

router.patch(
  "/:id/llegada",
  actualizarLlegadaOperacion
);


/* ======================================
   REGISTRAR SALIDA
====================================== */

router.patch(
  "/:id/salida",
  actualizarSalidaOperacion
);


export default router;