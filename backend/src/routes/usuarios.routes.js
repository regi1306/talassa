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
   CONSULTAR USUARIOS
====================================== */

router.get(
  "/",
  verificarPermiso(
    "USR_VER"
  ),
  listar
);


router.get(
  "/:id",
  verificarPermiso(
    "USR_VER"
  ),
  obtenerPorId
);


/* ======================================
   CREAR USUARIO
====================================== */

router.post(
  "/",
  verificarPermiso(
    "USR_CREAR"
  ),
  crear
);


/* ======================================
   EDITAR USUARIO
====================================== */

router.put(
  "/:id",
  verificarPermiso(
    "USR_EDITAR"
  ),
  actualizar
);


/* ======================================
   CAMBIAR ESTADO
====================================== */

router.patch(
  "/:id/estado",
  verificarPermiso(
    "USR_EDITAR"
  ),
  cambiarEstado
);


export default router;