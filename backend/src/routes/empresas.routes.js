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


const router =
  express.Router();


router.use(
  verificarToken
);


router.get(
  "/",
  listar
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