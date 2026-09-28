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


const router =
  Router();


/* ======================================
   TODAS LAS RUTAS REQUIEREN JWT
====================================== */

router.use(
  verificarToken
);


/* ======================================
   OPCIONES
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
  obtenerIncidencias
);


/* ======================================
   CREAR
====================================== */

router.post(
  "/",
  crearIncidencia
);


/* ======================================
   CAMBIAR ESTADO
====================================== */

router.patch(
  "/:id/estado",
  actualizarEstado
);


/* ======================================
   AGREGAR SEGUIMIENTO
====================================== */

router.post(
  "/:id/seguimiento",
  agregarSeguimiento
);


/* ======================================
   DETALLE
====================================== */

router.get(
  "/:id",
  obtenerIncidencia
);


/* ======================================
   EDITAR
====================================== */

router.put(
  "/:id",
  actualizarIncidencia
);


/* ======================================
   ELIMINAR
====================================== */

router.delete(
  "/:id",
  borrarIncidencia
);


export default router;