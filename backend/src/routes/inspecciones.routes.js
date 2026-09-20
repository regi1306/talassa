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


const router =
  Router();


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