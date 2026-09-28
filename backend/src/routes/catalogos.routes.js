import express
  from "express";

import {
  actualizar,
  cambiarEstado,
  crear,
  listarTodos,
  listarUno,
} from "../controllers/catalogos.controller.js";

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
   CONSULTAR CATÁLOGOS
====================================== */

router.get(
  "/",
  verificarPermiso(
    "CAT_VER"
  ),
  listarTodos
);


router.get(
  "/:catalogo",
  verificarPermiso(
    "CAT_VER"
  ),
  listarUno
);


/* ======================================
   CREAR
====================================== */

router.post(
  "/:catalogo",
  verificarPermiso(
    "CAT_GESTIONAR"
  ),
  crear
);


/* ======================================
   EDITAR
====================================== */

router.put(
  "/:catalogo/:id",
  verificarPermiso(
    "CAT_GESTIONAR"
  ),
  actualizar
);


/* ======================================
   CAMBIAR ESTADO
====================================== */

router.patch(
  "/:catalogo/:id/estado",
  verificarPermiso(
    "CAT_GESTIONAR"
  ),
  cambiarEstado
);


export default router;