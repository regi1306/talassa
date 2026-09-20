import express
  from "express";

import {
  detalle,
  listar,
} from "../controllers/auditoria.controller.js";

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
  "/:id",
  detalle
);


export default router;