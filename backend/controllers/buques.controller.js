import {
  listarBuques,
} from "../services/buques.service.js";


export async function obtenerBuques(req, res) {
  try {
    const buques = await listarBuques();

    res.status(200).json({
      ok: true,
      total: buques.length,
      datos: buques,
    });
  } catch (error) {
    console.error(
      "Error al obtener los buques:",
      error
    );

    res.status(500).json({
      ok: false,
      mensaje:
        "No fue posible obtener los buques.",
    });
  }
}