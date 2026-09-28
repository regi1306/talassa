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
  obtenerOpcionesContenedor
);


/* ======================================
   LISTAR CONTENEDORES
====================================== */

router.get(
  "/",
  obtenerContenedores
);


/* ======================================
   OBTENER CONTENEDOR
====================================== */

router.get(
  "/:id",
  obtenerContenedor
);


/* ======================================
   CREAR CONTENEDOR
====================================== */

router.post(
  "/",
  crearContenedor
);


/* ======================================
   ACTUALIZAR CONTENEDOR
====================================== */

router.put(
  "/:id",
  actualizarContenedor
);


export default router;