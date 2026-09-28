import {
  Router,
} from "express";

import {
  obtenerContenedor,
  obtenerContenedores,
  obtenerOpcionesContenedor,
  crearContenedor,
  actualizarContenedor,
} from "../controllers/contenedores.controller.js";

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
   OPCIONES DEL FORMULARIO
====================================== */

router.get(
  "/opciones-formulario",
  verificarPermiso(
    "CONT_GESTIONAR"
  ),
  obtenerOpcionesContenedor
);


/* ======================================
   LISTAR CONTENEDORES
====================================== */

router.get(
  "/",
  verificarPermiso(
    "CONT_VER"
  ),
  obtenerContenedores
);


/* ======================================
   OBTENER CONTENEDOR
====================================== */

router.get(
  "/:id",
  verificarPermiso(
    "CONT_VER"
  ),
  obtenerContenedor
);


/* ======================================
   CREAR CONTENEDOR
====================================== */

router.post(
  "/",
  verificarPermiso(
    "CONT_GESTIONAR"
  ),
  crearContenedor
);


/* ======================================
   ACTUALIZAR CONTENEDOR
====================================== */

router.put(
  "/:id",
  verificarPermiso(
    "CONT_GESTIONAR"
  ),
  actualizarContenedor
);


export default router;