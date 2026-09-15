import { Router } from "express";

import {
  actualizarBuque,
  actualizarEstadoBuque,
  crearBuque,
  obtenerBuque,
  obtenerBuques,
  obtenerOpcionesBuque,
} from "../controllers/buques.controller.js";


const router = Router();


router.get(
  "/opciones-formulario",
  obtenerOpcionesBuque
);


router.get(
  "/",
  obtenerBuques
);


router.get(
  "/:id",
  obtenerBuque
);


router.post(
  "/",
  crearBuque
);


router.put(
  "/:id",
  actualizarBuque
);


router.patch(
  "/:id/estado",
  actualizarEstadoBuque
);


export default router;