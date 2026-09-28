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

import {
  verificarPermiso,
} from "../middlewares/permisos.middleware.js";


const router =
  Router();


/* ======================================
   TODAS LAS RUTAS REQUIEREN SESIÓN
====================================== */

router.use(
  verificarToken
);


/* ======================================
   OPCIONES
   Va antes de /:id
====================================== */

router.get(
  "/opciones-formulario",
  verificarPermiso(
    "INS_VER"
  ),
  obtenerOpcionesFormulario
);


/* ======================================
   LISTAR
====================================== */

router.get(
  "/",
  verificarPermiso(
    "INS_VER"
  ),
  obtenerInspecciones
);


/* ======================================
   DETALLE
====================================== */

router.get(
  "/:id",
  verificarPermiso(
    "INS_VER"
  ),
  obtenerInspeccion
);


/* ======================================
   CREAR
====================================== */

router.post(
  "/",
  verificarPermiso(
    "INS_GESTIONAR"
  ),
  crearInspeccion
);


/* ======================================
   EDITAR
====================================== */

router.put(
  "/:id",
  verificarPermiso(
    "INS_GESTIONAR"
  ),
  actualizarInspeccion
);


/* ======================================
   ELIMINAR
====================================== */

router.delete(
  "/:id",
  verificarPermiso(
    "INS_GESTIONAR"
  ),
  borrarInspeccion
);


export default router;