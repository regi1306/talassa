import {
  Router,
} from "express";

import {
  mostrarResumenDashboard,
} from "../controllers/dashboard.controller.js";


const router =
  Router();


router.get(
  "/resumen",
  mostrarResumenDashboard
);


export default router;