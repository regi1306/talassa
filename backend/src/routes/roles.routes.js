import express
  from "express";

import {
  actualizarPermisos,
  listar,
  listarTodosLosPermisos,
  permisosDelRol,
} from "../controllers/roles.controller.js";

import {
  verificarToken,
} from "../middlewares/auth.middleware.js";


const router =
  express.Router();


router.use(
  verificarToken
);


router.get(
  "/",
  listar
);


router.get(
  "/permisos",
  listarTodosLosPermisos
);


router.get(
  "/:id/permisos",
  permisosDelRol
);


router.put(
  "/:id/permisos",
  actualizarPermisos
);


export default router;