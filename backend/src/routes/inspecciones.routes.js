import {
  Router,
} from "express";

import {
  actualizarInspeccion,
  borrarInspeccion,
  crearInspeccion,
  obtenerInspeccion,
  obtenerInspecciones,
  obtenerOpcionesFormulario,
} from "../controllers/inspecciones.controller.js";

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
   OPCIONES DEL FORMULARIO

   IMPORTANTE:
   Va antes de /:id
====================================== */

router.get(
  "/opciones-formulario",
  obtenerOpcionesFormulario
);


/* ======================================
   LISTAR
====================================== */

router.get(
  "/",
  obtenerInspecciones
);


/* ======================================
   DETALLE
====================================== */

router.get(
  "/:id",
  obtenerInspeccion
);


/* ======================================
   CREAR
====================================== */

router.post(
  "/",
  crearInspeccion
);


/* ======================================
   EDITAR
====================================== */

router.put(
  "/:id",
  actualizarInspeccion
);


/* ======================================
   ELIMINAR
====================================== */

router.delete(
  "/:id",
  borrarInspeccion
);


export default router;