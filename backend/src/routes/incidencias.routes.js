import {
  Router,
} from "express";

import {
  actualizarEstado,
  actualizarIncidencia,
  agregarSeguimiento,
  borrarIncidencia,
  crearIncidencia,
  obtenerIncidencia,
  obtenerIncidencias,
  obtenerOpcionesFormulario,
} from "../controllers/incidencias.controller.js";

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
====================================== */

router.get(
  "/opciones-formulario",
  verificarPermiso(
    "INC_VER"
  ),
  obtenerOpcionesFormulario
);


/* ======================================
   LISTAR
====================================== */

router.get(
  "/",
  verificarPermiso(
    "INC_VER"
  ),
  obtenerIncidencias
);


/* ======================================
   CREAR
====================================== */

router.post(
  "/",
  verificarPermiso(
    "INC_GESTIONAR"
  ),
  crearIncidencia
);


/* ======================================
   CAMBIAR ESTADO
====================================== */

router.patch(
  "/:id/estado",
  verificarPermiso(
    "INC_GESTIONAR"
  ),
  actualizarEstado
);


/* ======================================
   AGREGAR SEGUIMIENTO
====================================== */

router.post(
  "/:id/seguimiento",
  verificarPermiso(
    "INC_GESTIONAR"
  ),
  agregarSeguimiento
);


/* ======================================
   DETALLE
====================================== */

router.get(
  "/:id",
  verificarPermiso(
    "INC_VER"
  ),
  obtenerIncidencia
);


/* ======================================
   EDITAR
====================================== */

router.put(
  "/:id",
  verificarPermiso(
    "INC_GESTIONAR"
  ),
  actualizarIncidencia
);


/* ======================================
   ELIMINAR
====================================== */

router.delete(
  "/:id",
  verificarPermiso(
    "INC_GESTIONAR"
  ),
  borrarIncidencia
);


export default router;