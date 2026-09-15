import { Router } from "express";

import {
  crearOperacion,
  obtenerOperacion,
  obtenerOperaciones,
  obtenerOpcionesOperacion,
  actualizarOperacion,
  
} from "../controllers/operaciones.controller.js";


const router = Router();


router.get(
  "/opciones-formulario",
  obtenerOpcionesOperacion
);


router.get(
  "/",
  obtenerOperaciones
);


router.get(
  "/:id",
  obtenerOperacion
);


router.post(
  "/",
  crearOperacion
);
router.put(
  "/:id",
  actualizarOperacion
);


export default router;