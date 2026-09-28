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
    "OPE_GESTIONAR"
  ),
  obtenerOpcionesOperacion
);


/* ======================================
   LISTADO
====================================== */

router.get(
  "/",
  verificarPermiso(
    "OPE_VER"
  ),
  obtenerOperaciones
);


/* ======================================
   DETALLE
====================================== */

router.get(
  "/:id",
  verificarPermiso(
    "OPE_VER"
  ),
  obtenerOperacion
);


/* ======================================
   CREAR
====================================== */

router.post(
  "/",
  verificarPermiso(
    "OPE_GESTIONAR"
  ),
  crearOperacion
);


/* ======================================
   EDITAR
====================================== */

router.put(
  "/:id",
  verificarPermiso(
    "OPE_GESTIONAR"
  ),
  actualizarOperacion
);


/* ======================================
   REGISTRAR LLEGADA
====================================== */

router.patch(
  "/:id/llegada",
  verificarPermiso(
    "OPE_GESTIONAR"
  ),
  actualizarLlegadaOperacion
);


/* ======================================
   REGISTRAR SALIDA
====================================== */

router.patch(
  "/:id/salida",
  verificarPermiso(
    "OPE_GESTIONAR"
  ),
  actualizarSalidaOperacion
);


export default router;