import express from "express";
import cors from "cors";

import buquesRoutes from "./routes/buques.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/buques", buquesRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "API de TALASSA funcionando correctamente",
  });
});

export default app;