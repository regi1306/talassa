import {
  Router,
} from "express";

import {
  login,
  perfilActual,
} from "../controllers/auth.controller.js";

import {
  verificarToken,
} from "../middlewares/auth.middleware.js";


const router =
  Router();


router.post(
  "/login",
  login
);


router.get(
  "/me",
  verificarToken,
  perfilActual
);


export default router;