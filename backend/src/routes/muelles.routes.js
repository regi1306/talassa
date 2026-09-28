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