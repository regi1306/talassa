import {
  Activity,
  AlertTriangle,
  Anchor,
  ArrowUpRight,
  Boxes,
  ClipboardCheck,
  Clock,
  RefreshCw,
  Ship,
  Star,
  Wrench,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  obtenerResumenDashboard,
} from "../../services/dashboardService.js";

import "../../styles/dashboard.css";


/* ======================================
   FUNCIONES AUXILIARES
====================================== */

function formatearHora(fecha) {
  if (!fecha) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "es-SV",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(
    new Date(fecha)
  );
}


function obtenerTonoMuelle(
  estado
) {
  switch (estado) {

    case "Disponible":
      return "verde";

    case "Ocupado":
      return "rojo";

    case "Reservado":
      return "azul";

    case "Mantenimiento":
    case "Fuera de servicio":
      return "gris";

    default:
      return "gris";
  }
}


function obtenerEtiquetaMuelle(
  estado
) {
  switch (estado) {

    case "Disponible":
      return "Libre";

    case "Ocupado":
      return "En operación";

    case "Reservado":
      return "Asignado";

    case "Mantenimiento":
    case "Fuera de servicio":
      return "No disponible";

    default:
      return estado || "Sin estado";
  }
}


function obtenerDetalleMuelle(
  muelle
) {
  if (muelle.buque) {
    return muelle.buque;
  }


  switch (
    muelle.estado_dashboard
  ) {

    case "Disponible":
      return "Sin asignación";

    case "Mantenimiento":
      return "Muelle en mantenimiento";

    case "Fuera de servicio":
      return "No disponible actualmente";

    default:
      return (
        muelle.nombre ||
        "Sin información adicional"
      );
  }
}


function obtenerIconoMuelle(
  estado
) {
  if (
    estado === "Mantenimiento" ||
    estado === "Fuera de servicio"
  ) {
    return Wrench;
  }


  if (
    estado === "Ocupado" ||
    estado === "Reservado"
  ) {
    return Ship;
  }


  return Anchor;
}


function obtenerTonoOperacion(
  estado
) {
  switch (estado) {

    case "Programada":
      return "azul";

    case "Muelle asignado":
      return "azul";

    case "En puerto":
    case "En operación":
      return "verde";

    default:
      return "naranja";
  }
}


function obtenerTonoActividad(
  tipo
) {
  switch (tipo) {

    case "incidencia":
      return "rojo";

    case "inspeccion":
      return "azul";

    case "asignacion":
      return "azul";

    case "operacion":
      return "verde";

    default:
      return "azul";
  }
}


function inspeccionFinalizada(
  estado
) {
  if (!estado) {
    return false;
  }


  const valor =
    estado
      .trim()
      .toLowerCase();


  return (
    valor.includes(
      "final"
    ) ||
    valor.includes(
      "complet"
    ) ||
    valor.includes(
      "realiz"
    )
  );
}


function DashboardPage() {
  const navigate =
    useNavigate();


  const [
    datos,
    setDatos,
  ] = useState(null);


  const [
    cargando,
    setCargando,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  async function cargarDashboard() {
    try {
      setCargando(true);

      setError("");


      const respuesta =
        await obtenerResumenDashboard();


      setDatos(
        respuesta
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setCargando(false);

    }
  }


  useEffect(() => {
    cargarDashboard();
  }, []);


  if (cargando) {
    return (
      <section className="pagina-dashboard">

        <div className="fondo-dashboard" />


        <div className="estado-carga-dashboard">

          <RefreshCw
            size={27}
            className="icono-cargando-dashboard"
          />

          <strong>
            Cargando Dashboard...
          </strong>

          <span>
            Consultando información actual de TALASSA.
          </span>

        </div>

      </section>
    );
  }


  if (
    error ||
    !datos
  ) {
    return (
      <section className="pagina-dashboard">

        <div className="fondo-dashboard" />


        <div className="estado-carga-dashboard">

          <AlertTriangle
            size={30}
          />

          <strong>
            No fue posible cargar el Dashboard
          </strong>

          <span>
            {error ||
              "No se recibió información del servidor."}
          </span>


          <button
            type="button"
            onClick={
              cargarDashboard
            }
          >
            <RefreshCw size={17} />

            Intentar nuevamente
          </button>

        </div>

      </section>
    );
  }


  /* ======================================
     INDICADORES
  ====================================== */

  const estadisticas = [
    {
      titulo:
        "Buques en puerto",

      valor:
        datos.estadisticas
          ?.buques_en_puerto ??
        0,

      detalle:
        "Actualmente en puerto",

      icono:
        Ship,

      tono:
        "azul",
    },

    {
      titulo:
        "Operaciones del día",

      valor:
        datos.estadisticas
          ?.operaciones_del_dia ??
        0,

      detalle:
        "Llegadas estimadas para hoy",

      icono:
        RefreshCw,

      tono:
        "menta",
    },

    {
      titulo:
        "Inspecciones pendientes",

      valor:
        datos.estadisticas
          ?.inspecciones_pendientes ??
        0,

      detalle:
        "Pendientes de revisión",

      icono:
        ClipboardCheck,

      tono:
        "azul",
    },

    {
      titulo:
        "Incidencias activas",

      valor:
        datos.estadisticas
          ?.incidencias_activas ??
        0,

      detalle:
        "Actualmente activas",

      icono:
        AlertTriangle,

      tono:
        "roja",
    },
  ];


  /* ======================================
     DATOS DERIVADOS
  ====================================== */

  const operacionDestacada =
    datos.operacion_destacada;


  const muelles =
    (
      datos.muelles ||
      []
    ).slice(
      0,
      4
    );


  const proximasOperaciones =
    datos.proximas_operaciones ||
    [];


  const actividadReciente =
    datos.actividad_reciente ||
    [];


  const totalContenedores =
    Number(
      datos.contenedores
        ?.total ||
      0
    );


  const contenedoresActivos =
    Number(
      datos.contenedores
        ?.operaciones_activas ||
      0
    );


  const contenedoresFinalizados =
    Number(
      datos.contenedores
        ?.operaciones_finalizadas ||
      0
    );


  const porcentajeActivos =
    totalContenedores > 0
      ? Math.round(
          (
            contenedoresActivos /
            totalContenedores
          ) *
          100
        )
      : 0;


  const porcentajeFinalizados =
    totalContenedores > 0
      ? Math.round(
          (
            contenedoresFinalizados /
            totalContenedores
          ) *
          100
        )
      : 0;


  const llegadaOperacion =
    operacionDestacada
      ?.llegada_real ||
    operacionDestacada
      ?.llegada_estimada;


  const salidaOperacion =
    operacionDestacada
      ?.salida_real ||
    operacionDestacada
      ?.salida_estimada;


  const estadoOperacion =
    operacionDestacada
      ?.estado ||
    "";


  const operacionEnCurso =
    estadoOperacion ===
    "En operación";


  const operacionEnPuerto =
    estadoOperacion ===
    "En puerto";


  const operacionFinalizada =
    estadoOperacion ===
    "Finalizada";


  return (
    <section className="pagina-dashboard">


      {/* ======================================
          FONDO DEL DASHBOARD
      ====================================== */}

      <div className="fondo-dashboard" />


      {/* ======================================
          ENCABEZADO
      ====================================== */}

      <div className="encabezado-dashboard">

        <div>

          <h1>
            Dashboard
          </h1>


          <p>
            Vista general del estado actual
            de las operaciones portuarias.
          </p>

        </div>


        <button
          type="button"
          className="boton-actualizar-dashboard"
          onClick={
            cargarDashboard
          }
        >
          <RefreshCw size={17} />

          Actualizar
        </button>

      </div>


      {/* ======================================
          INDICADORES GENERALES
      ====================================== */}

      <div className="estadisticas-dashboard">

        {estadisticas.map(
          (
            estadistica
          ) => {

            const Icono =
              estadistica.icono;


            return (
              <article
                key={
                  estadistica.titulo
                }
                className={
                  `tarjeta-estadistica ` +
                  `tarjeta-estadistica-${estadistica.tono}`
                }
              >

                <div className="icono-estadistica">

                  <Icono
                    size={25}
                  />

                </div>


                <div className="contenido-estadistica">

                  <span>
                    {
                      estadistica.titulo
                    }
                  </span>


                  <strong>
                    {
                      estadistica.valor
                    }
                  </strong>


                  <small>
                    {
                      estadistica.detalle
                    }
                  </small>

                </div>


                <ArrowUpRight
                  className="tendencia-estadistica"
                  size={21}
                />

              </article>
            );
          }
        )}

      </div>


      {/* ======================================
          BLOQUE PRINCIPAL
      ====================================== */}

      <div className="rejilla-principal-dashboard">


        {/* ======================================
            OPERACIÓN DESTACADA
        ====================================== */}

        <article className="glass-card tarjeta-operacion-destacada">

          <div className="encabezado-tarjeta-dashboard">

            <h2>

              <Star size={21} />

              Operación destacada

            </h2>


            {operacionDestacada && (

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/operaciones/${operacionDestacada.id_operacion}`
                  )
                }
              >
                Ver detalles

                <ArrowUpRight
                  size={16}
                />

              </button>

            )}

          </div>


          {operacionDestacada ? (

            <>

              <div className="contenido-operacion-destacada">

                <div className="informacion-operacion-destacada">

                  <h3>
                    {
                      operacionDestacada.buque
                    }
                  </h3>


                  <span className="codigo-operacion-destacada">
                    {
                      operacionDestacada.codigo
                    }
                  </span>


                  <div className="estado-operacion">

                    <span />

                    {
                      operacionDestacada.estado
                    }

                  </div>


                  <div className="detalles-operacion-destacada">


                    <div>

                      <Anchor
                        size={18}
                      />

                      <div>

                        <small>
                          Muelle
                        </small>

                        <strong>
                          {
                            operacionDestacada.muelle ||
                            "Sin asignar"
                          }
                        </strong>

                      </div>

                    </div>


                    <div>

                      <Clock
                        size={18}
                      />

                      <div>

                        <small>
                          Llegada
                        </small>

                        <strong>
                          {
                            formatearHora(
                              llegadaOperacion
                            )
                          }
                        </strong>

                      </div>

                    </div>


                    <div>

                      <Clock
                        size={18}
                      />

                      <div>

                        <small>
                          Salida estimada
                        </small>

                        <strong>
                          {
                            formatearHora(
                              salidaOperacion
                            )
                          }
                        </strong>

                      </div>

                    </div>

                  </div>

                </div>


                <div className="imagen-buque-destacado" />

              </div>


              {/* ======================================
                  PROGRESO DE OPERACIÓN
              ====================================== */}

              <div className="progreso-operacion">

                <div className="linea-progreso" />


                <div
                  className={
                    `paso-progreso ${
                      operacionDestacada.llegada_real
                        ? "completado"
                        : (
                            estadoOperacion ===
                              "Programada" ||
                            estadoOperacion ===
                              "Muelle asignado"
                          )
                          ? "actual"
                          : ""
                    }`
                  }
                >

                  <span />

                  <small>
                    Arribo
                  </small>

                  <strong>
                    {
                      operacionDestacada
                        .llegada_real
                        ? formatearHora(
                            operacionDestacada
                              .llegada_real
                          )
                        : formatearHora(
                            operacionDestacada
                              .llegada_estimada
                          )
                    }
                  </strong>

                </div>


                <div
                  className={
                    `paso-progreso ${
                      operacionFinalizada
                        ? "completado"
                        : (
                            operacionEnCurso ||
                            operacionEnPuerto
                          )
                          ? "actual"
                          : ""
                    }`
                  }
                >

                  <span />

                  <small>
                    Operación
                  </small>

                  <strong>
                    {
                      operacionFinalizada
                        ? "Finalizada"
                        : operacionEnCurso
                          ? "En curso"
                          : operacionEnPuerto
                            ? "Por iniciar"
                            : estadoOperacion ||
                              "Pendiente"
                    }
                  </strong>

                </div>


                <div
                  className={
                    `paso-progreso ${
                      inspeccionFinalizada(
                        operacionDestacada
                          .estado_inspeccion
                      )
                        ? "completado"
                        : operacionDestacada
                            .codigo_inspeccion
                          ? "actual"
                          : ""
                    }`
                  }
                >

                  <span />

                  <small>
                    Inspección
                  </small>

                  <strong>
                    {
                      operacionDestacada
                        .estado_inspeccion ||
                      "Sin registrar"
                    }
                  </strong>

                </div>


                <div
                  className={
                    `paso-progreso ${
                      operacionDestacada
                        .salida_real
                        ? "completado"
                        : ""
                    }`
                  }
                >

                  <span />

                  <small>
                    Zarpe
                  </small>

                  <strong>
                    {
                      operacionDestacada
                        .salida_real
                        ? formatearHora(
                            operacionDestacada
                              .salida_real
                          )
                        : formatearHora(
                            operacionDestacada
                              .salida_estimada
                          )
                    }
                  </strong>

                </div>

              </div>

            </>

          ) : (

            <div className="estado-vacio-dashboard">

              <Ship size={35} />

              <strong>
                No hay operaciones activas
              </strong>

              <span>
                Cuando exista una operación
                activa aparecerá aquí.
              </span>

            </div>

          )}

        </article>


        {/* ======================================
            ESTADO DE MUELLES
        ====================================== */}

        <article className="glass-card muelles-dashboard">

          <div className="encabezado-tarjeta-dashboard">

            <h2>

              <Anchor size={21} />

              Estado de muelles

            </h2>


            <button
              type="button"
              onClick={() =>
                navigate(
                  "/muelles"
                )
              }
            >
              Ver todos

              <ArrowUpRight
                size={16}
              />

            </button>

          </div>


          <div className="lista-muelles">

            {muelles.length > 0 ? (

              muelles.map(
                (
                  muelle
                ) => {

                  const tono =
                    obtenerTonoMuelle(
                      muelle.estado_dashboard
                    );


                  const Icono =
                    obtenerIconoMuelle(
                      muelle.estado_dashboard
                    );


                  return (
                    <div
                      className="item-muelle"
                      key={
                        muelle.id_muelle
                      }
                    >

                      <div className="icono-muelle">

                        <Icono
                          size={20}
                        />

                      </div>


                      <div className="informacion-muelle">

                        <strong>
                          {
                            muelle.codigo
                          }
                        </strong>


                        <span>

                          <i
                            className={
                              `punto-muelle ` +
                              `punto-muelle-${tono}`
                            }
                          />

                          {
                            muelle.estado_dashboard
                          }

                        </span>


                        <small>
                          {
                            obtenerDetalleMuelle(
                              muelle
                            )
                          }
                        </small>

                      </div>


                      <span
                        className={
                          `etiqueta-muelle ` +
                          `etiqueta-muelle-${tono}`
                        }
                      >
                        {
                          obtenerEtiquetaMuelle(
                            muelle.estado_dashboard
                          )
                        }
                      </span>

                    </div>
                  );
                }
              )

            ) : (

              <div className="estado-vacio-dashboard estado-vacio-muelles">

                <Anchor
                  size={30}
                />

                <strong>
                  No hay muelles registrados
                </strong>

                <span>
                  Los muelles registrados
                  aparecerán aquí.
                </span>

              </div>

            )}

          </div>

        </article>

      </div>


      {/* ======================================
          BLOQUE INFERIOR
      ====================================== */}

      <div className="rejilla-inferior-dashboard">


        {/* ======================================
            PRÓXIMAS OPERACIONES
        ====================================== */}

        <article className="glass-card proximas-operaciones-dashboard">

          <div className="encabezado-tarjeta-dashboard">

            <h2>

              <Clock size={21} />

              Próximas operaciones

            </h2>


            <button
              type="button"
              onClick={() =>
                navigate(
                  "/operaciones"
                )
              }
            >
              Ver todas

              <ArrowUpRight
                size={16}
              />

            </button>

          </div>


          <div className="contenedor-tabla-dashboard">

            <table className="tabla-dashboard">

              <thead>

                <tr>

                  <th>
                    Hora
                  </th>

                  <th>
                    Buque
                  </th>

                  <th>
                    Tipo de carga
                  </th>

                  <th>
                    Muelle
                  </th>

                  <th>
                    Estado
                  </th>

                </tr>

              </thead>


              <tbody>

                {proximasOperaciones.length > 0 ? (

                  proximasOperaciones.map(
                    (
                      operacion
                    ) => (

                      <tr
                        key={
                          operacion.id_operacion
                        }
                        onClick={() =>
                          navigate(
                            `/operaciones/${operacion.id_operacion}`
                          )
                        }
                        className="fila-operacion-dashboard"
                      >

                        <td>
                          {
                            formatearHora(
                              operacion.llegada_estimada
                            )
                          }
                        </td>


                        <td>
                          {
                            operacion.buque
                          }
                        </td>


                        <td>
                          {
                            operacion.tipo_carga ||
                            "Sin especificar"
                          }
                        </td>


                        <td>
                          {
                            operacion.muelle ||
                            "Sin asignar"
                          }
                        </td>


                        <td>

                          <span
                            className={
                              `etiqueta-estado-operacion ` +
                              `etiqueta-estado-operacion-${obtenerTonoOperacion(
                                operacion.estado
                              )}`
                            }
                          >
                            {
                              operacion.estado
                            }
                          </span>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="celda-vacia-dashboard"
                    >
                      No hay próximas operaciones programadas.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </article>


        {/* ======================================
            CONTENEDORES
        ====================================== */}

        <article className="glass-card contenedores-dashboard">

          <div className="encabezado-tarjeta-dashboard">

            <h2>

              <Boxes size={21} />

              Contenedores

            </h2>


            <button
              type="button"
              onClick={() =>
                navigate(
                  "/contenedores"
                )
              }
            >
              Ver detalles

              <ArrowUpRight
                size={16}
              />

            </button>

          </div>


          <small>
            Total registrados
          </small>


          <div className="total-contenedores">
            {
              totalContenedores
            }
          </div>


          <div className="barras-contenedores">


            <div>

              <span>

                En operaciones activas

                <strong>
                  {
                    contenedoresActivos
                  }
                </strong>

              </span>


              <div className="fondo-barra-progreso">

                <div
                  className="relleno-barra-progreso procesados"
                  style={{
                    width:
                      `${porcentajeActivos}%`,
                  }}
                />

              </div>

            </div>


            <div>

              <span>

                En operaciones finalizadas

                <strong>
                  {
                    contenedoresFinalizados
                  }
                </strong>

              </span>


              <div className="fondo-barra-progreso">

                <div
                  className="relleno-barra-progreso pendientes"
                  style={{
                    width:
                      `${porcentajeFinalizados}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </article>


        {/* ======================================
            ACTIVIDAD RECIENTE
        ====================================== */}

        <article className="glass-card actividad-dashboard">

          <div className="encabezado-tarjeta-dashboard">

            <h2>

              <Activity size={21} />

              Actividad reciente

            </h2>


            <button
              type="button"
              onClick={
                cargarDashboard
              }
            >
              Actualizar

              <RefreshCw
                size={16}
              />

            </button>

          </div>


          <div className="lista-actividad">

            {actividadReciente.length > 0 ? (

              actividadReciente.map(
                (
                  actividad,
                  indice
                ) => (

                  <div
                    className="item-actividad"
                    key={
                      `${actividad.tipo}-${actividad.fecha}-${indice}`
                    }
                  >

                    <span
                      className={
                        `punto-actividad ` +
                        `punto-actividad-${obtenerTonoActividad(
                          actividad.tipo
                        )}`
                      }
                    />


                    <div>

                      <strong>
                        {
                          actividad.titulo
                        }
                      </strong>


                      <small>
                        {
                          actividad.detalle
                        }
                      </small>

                    </div>


                    <time>
                      {
                        formatearHora(
                          actividad.fecha
                        )
                      }
                    </time>

                  </div>

                )
              )

            ) : (

              <div className="estado-vacio-dashboard">

                <Activity
                  size={27}
                />

                <strong>
                  Sin actividad reciente
                </strong>

                <span>
                  La actividad del sistema
                  aparecerá aquí.
                </span>

              </div>

            )}

          </div>

        </article>

      </div>

    </section>
  );
}


export default DashboardPage;