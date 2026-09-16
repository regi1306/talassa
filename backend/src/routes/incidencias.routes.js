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


const router =
  Router();


router.get(
  "/opciones-formulario",
  obtenerOpcionesFormulario
);


router.get(
  "/",
  obtenerIncidencias
);


router.post(
  "/",
  crearIncidencia
);


router.patch(
  "/:id/estado",
  actualizarEstado
);


router.post(
  "/:id/seguimiento",
  agregarSeguimiento
);


router.get(
  "/:id",
  obtenerIncidencia
);


router.put(
  "/:id",
  actualizarIncidencia
);


router.delete(
  "/:id",
  borrarIncidencia
);


export default router;