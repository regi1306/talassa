import {
  obtenerActividadRecienteDashboard,
  obtenerEstadisticasDashboard,
  obtenerEstadoMuellesDashboard,
  obtenerOperacionDestacada,
  obtenerProximasOperacionesDashboard,
  obtenerResumenContenedoresDashboard,
} from "../repositories/dashboard.repository.js";


export async function obtenerResumenDashboard() {

  const [
    estadisticas,
    operacionDestacada,
    muelles,
    proximasOperaciones,
    contenedores,
    actividadReciente,
  ] = await Promise.all([

    obtenerEstadisticasDashboard(),

    obtenerOperacionDestacada(),

    obtenerEstadoMuellesDashboard(),

    obtenerProximasOperacionesDashboard(),

    obtenerResumenContenedoresDashboard(),

    obtenerActividadRecienteDashboard(),

  ]);


  return {
    estadisticas,

    operacion_destacada:
      operacionDestacada,

    muelles,

    proximas_operaciones:
      proximasOperaciones,

    contenedores,

    actividad_reciente:
      actividadReciente,
  };
}