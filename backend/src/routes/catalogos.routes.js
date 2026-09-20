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


const router =
  express.Router();


router.use(
  verificarToken
);


router.get(
  "/",
  listarTodos
);


router.get(
  "/:catalogo",
  listarUno
);


router.post(
  "/:catalogo",
  crear
);


router.put(
  "/:catalogo/:id",
  actualizar
);


router.patch(
  "/:catalogo/:id/estado",
  cambiarEstado
);


export default router;