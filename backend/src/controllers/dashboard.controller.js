import {
  obtenerResumenDashboard,
} from "../services/dashboard.service.js";


export async function mostrarResumenDashboard(
  req,
  res
) {
  try {

    const datos =
      await obtenerResumenDashboard();


    return res
      .status(200)
      .json({
        ok: true,

        datos,
      });

  } catch (error) {

    console.error(
      "Error al obtener el Dashboard:",
      error
    );


    return res
      .status(500)
      .json({
        ok: false,

        mensaje:
          "No fue posible obtener la información del Dashboard.",
      });
  }
}