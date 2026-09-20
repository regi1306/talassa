import { Router } from "express";

import {
  actualizarLlegadaOperacion,
  actualizarOperacion,
  actualizarSalidaOperacion,
  crearOperacion,
  obtenerOperacion,
  obtenerOperaciones,
  obtenerOpcionesOperacion,
  
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

router.patch(
  "/:id/llegada",
  actualizarLlegadaOperacion
);


router.patch(
  "/:id/salida",
  actualizarSalidaOperacion
);

export default router;