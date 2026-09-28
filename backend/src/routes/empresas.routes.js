import express
  from "express";

import {
  actualizar,
  cambiarEstado,
  crear,
  listar,
} from "../controllers/empresas.controller.js";

import {
  verificarToken,
} from "../middlewares/auth.middleware.js";

import {
  verificarPermiso,
} from "../middlewares/permisos.middleware.js";


const router =
  express.Router();


/* ======================================
   AUTENTICACIÓN
====================================== */

router.use(
  verificarToken
);


/* ======================================
   CONSULTAR
====================================== */

router.get(
  "/",
  verificarPermiso(
    "EMP_VER"
  ),
  listar
);


/* ======================================
   CREAR
====================================== */

router.post(
  "/",
  verificarPermiso(
    "EMP_GESTIONAR"
  ),
  crear
);


/* ======================================
   EDITAR
====================================== */

router.put(
  "/:id",
  verificarPermiso(
    "EMP_GESTIONAR"
  ),
  actualizar
);


/* ======================================
   CAMBIAR ESTADO
====================================== */

router.patch(
  "/:id/estado",
  verificarPermiso(
    "EMP_GESTIONAR"
  ),
  cambiarEstado
);


export default router;