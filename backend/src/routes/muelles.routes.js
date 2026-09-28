import {
  Router,
} from "express";

import {
  actualizarMuelle,
  borrarMuelle,
  crearMuelle,
  obtenerMuelle,
  obtenerMuelles,
  obtenerOpcionesMuelle,
} from "../controllers/muelles.controller.js";

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
   LISTAR
====================================== */

router.get(
  "/",
  verificarPermiso(
    "MUE_VER"
  ),
  obtenerMuelles
);


/* ======================================
   OPCIONES
====================================== */

router.get(
  "/opciones-formulario",
  verificarPermiso(
    "MUE_VER"
  ),
  obtenerOpcionesMuelle
);


/* ======================================
   DETALLE
====================================== */

router.get(
  "/:id",
  verificarPermiso(
    "MUE_VER"
  ),
  obtenerMuelle
);


/* ======================================
   REGISTRAR
====================================== */

router.post(
  "/",
  verificarPermiso(
    "MUE_GESTIONAR"
  ),
  crearMuelle
);


/* ======================================
   EDITAR
====================================== */

router.put(
  "/:id",
  verificarPermiso(
    "MUE_GESTIONAR"
  ),
  actualizarMuelle
);


/* ======================================
   ELIMINAR / DESACTIVAR
====================================== */

router.delete(
  "/:id",
  verificarPermiso(
    "MUE_GESTIONAR"
  ),
  borrarMuelle
);


export default router;