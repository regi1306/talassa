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


const router =
  Router();


/* ======================================
   LISTAR
====================================== */

router.get(
  "/",
  obtenerMuelles
);

router.get(
  "/opciones-formulario",
  obtenerOpcionesMuelle
);

/* ======================================
   DETALLE
====================================== */

router.get(
  "/:id",
  obtenerMuelle
);


/* ======================================
   REGISTRAR
====================================== */

router.post(
  "/",
  crearMuelle
);


/* ======================================
   EDITAR
====================================== */

router.put(
  "/:id",
  actualizarMuelle
);


/* ======================================
   ELIMINAR
====================================== */

router.delete(
  "/:id",
  borrarMuelle
);


export default router;