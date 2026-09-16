import {
  Router,
} from "express";

import {
  actualizarMuelle,
  borrarMuelle,
  crearMuelle,
  obtenerMuelle,
  obtenerMuelles,
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