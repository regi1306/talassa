import {
  Router,
} from "express";

import {
  actualizar,
  cambiarEstado,
  crear,
  listar,
  obtenerPorId,
} from "../controllers/usuarios.controller.js";

import {
  verificarToken,
} from "../middlewares/auth.middleware.js";


const router =
  Router();


/*
  Solo exigimos que exista una sesión
  autenticada válida.

  No agregaremos aquí la capa extra
  de permisos de backend que decidieron
  dejar fuera del alcance.
*/

router.use(
  verificarToken
);


/* ======================================
   RUTAS
====================================== */

router.get(
  "/",
  listar
);


router.get(
  "/:id",
  obtenerPorId
);


router.post(
  "/",
  crear
);


router.put(
  "/:id",
  actualizar
);


router.patch(
  "/:id/estado",
  cambiarEstado
);


export default router;