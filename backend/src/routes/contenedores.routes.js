import { Router } from "express";

import {
  obtenerContenedor,
  obtenerContenedores,
  obtenerOpcionesContenedor,
  crearContenedor,
  actualizarContenedor,
} from "../controllers/contenedores.controller.js";


const router = Router();


router.get(
  "/opciones-formulario",
  obtenerOpcionesContenedor
);


router.get(
  "/",
  obtenerContenedores
);


router.get(
  "/:id",
  obtenerContenedor
);

router.post(
  "/",
  crearContenedor
);

router.put(
  "/:id",
  actualizarContenedor
);

export default router;

