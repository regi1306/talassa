import { Router } from "express";

import {
  obtenerBuques,
} from "../controllers/buques.controller.js";


const router = Router();


router.get("/", obtenerBuques);


export default router;