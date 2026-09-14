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

import "../../styles/dashboard.css";


/* ======================================
   DATOS TEMPORALES DEL DASHBOARD

   Más adelante serán reemplazados
   por información proveniente de la API.
====================================== */

const estadisticas = [
  {
    titulo: "Buques en puerto",
    valor: 4,
    detalle: "+1 respecto a ayer",
    icono: Ship,
    tono: "azul",
  },
  {
    titulo: "Operaciones del día",
    valor: 7,
    detalle: "+2 respecto a ayer",
    icono: RefreshCw,
    tono: "menta",
  },
  {
    titulo: "Inspecciones pendientes",
    valor: 5,
    detalle: "Pendientes de revisión",
    icono: ClipboardCheck,
    tono: "azul",
  },
  {
    titulo: "Incidencias activas",
    valor: 3,
    detalle: "+1 respecto a ayer",
    icono: AlertTriangle,
    tono: "roja",
  },
];


const muelles = [
  {
    codigo: "Muelle 01",
    estado: "Disponible",
    detalle: "Sin asignación",
    etiqueta: "Libre",
    tono: "verde",
    icono: Anchor,
  },
  {
    codigo: "Muelle 02",
    estado: "Ocupado",
    detalle: "Pacific Queen",
    etiqueta: "En operación",
    tono: "rojo",
    icono: Ship,
  },
  {
    codigo: "Muelle 03",
    estado: "Reservado",
    detalle: "Ocean Star",
    etiqueta: "Asignado",
    tono: "azul",
    icono: Ship,
  },
  {
    codigo: "Muelle 04",
    estado: "Mantenimiento",
    detalle: "Fuera de servicio temporalmente",
    etiqueta: "No disponible",
    tono: "gris",
    icono: Wrench,
  },
];


const proximasOperaciones = [
  {
    hora: "14:00",
    buque: "Atlantic Star",
    operacion: "Descarga",
    muelle: "M-02",
    estado: "Programada",
    tono: "azul",
  },
  {
    hora: "16:30",
    buque: "Pacific Queen",
    operacion: "Carga",
    muelle: "M-01",
    estado: "Programada",
    tono: "azul",
  },
  {
    hora: "18:15",
    buque: "Horizon",
    operacion: "Descarga",
    muelle: "M-04",
    estado: "En espera",
    tono: "naranja",
  },
  {
    hora: "21:00",
    buque: "Marina Bay",
    operacion: "Carga",
    muelle: "M-03",
    estado: "Programada",
    tono: "azul",
  },
];


const actividadReciente = [
  {
    titulo: "Operación OP-052 iniciada",
    detalle: "Ocean Star · M-03",
    hora: "08:17",
    tono: "verde",
  },
  {
    titulo: "Inspección INS-001 finalizada",
    detalle: "Operación OP-052",
    hora: "07:45",
    tono: "azul",
  },
  {
    titulo: "Incidencia INC-01 reportada",
    detalle: "Prioridad alta",
    hora: "06:32",
    tono: "rojo",
  },
  {
    titulo: "Muelle M-01 reservado",
    detalle: "Pacific Queen",
    hora: "05:20",
    tono: "azul",
  },
];


function DashboardPage() {
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
        <h1>Dashboard</h1>

        <p>
          Vista general del estado actual de las operaciones portuarias.
        </p>
      </div>


      {/* ======================================
          INDICADORES GENERALES
      ====================================== */}

      <div className="estadisticas-dashboard">

        {estadisticas.map((estadistica) => {
          const Icono = estadistica.icono;

          return (
            <article
              key={estadistica.titulo}
              className={
                `tarjeta-estadistica ` +
                `tarjeta-estadistica-${estadistica.tono}`
              }
            >
              <div className="icono-estadistica">
                <Icono size={25} />
              </div>

              <div className="contenido-estadistica">
                <span>
                  {estadistica.titulo}
                </span>

                <strong>
                  {estadistica.valor}
                </strong>

                <small>
                  {estadistica.detalle}
                </small>
              </div>

              <ArrowUpRight
                className="tendencia-estadistica"
                size={21}
              />
            </article>
          );
        })}

      </div>


      {/* ======================================
          BLOQUE PRINCIPAL
      ====================================== */}

      <div className="rejilla-principal-dashboard">

        {/* ======================================
            OPERACION DESTACADA
        ====================================== */}

        <article className="glass-card tarjeta-operacion-destacada">

          <div className="encabezado-tarjeta-dashboard">

            <h2>
              <Star size={21} />
              Operación destacada
            </h2>

            <button type="button">
              Ver detalles
              <ArrowUpRight size={16} />
            </button>

          </div>


          <div className="contenido-operacion-destacada">

            <div className="informacion-operacion-destacada">

              <h3>
                Ocean Star
              </h3>

              <span className="codigo-operacion-destacada">
                OP-052
              </span>


              <div className="estado-operacion">
                <span />
                En operación
              </div>


              <div className="detalles-operacion-destacada">

                <div>
                  <Anchor size={18} />

                  <div>
                    <small>Muelle</small>
                    <strong>M-03</strong>
                  </div>
                </div>


                <div>
                  <Clock size={18} />

                  <div>
                    <small>Llegada</small>
                    <strong>08:17</strong>
                  </div>
                </div>


                <div>
                  <Clock size={18} />

                  <div>
                    <small>Salida estimada</small>
                    <strong>17:00</strong>
                  </div>
                </div>

              </div>

            </div>


            {/* Imagen independiente para la operación destacada */}

            <div className="imagen-buque-destacado" />

          </div>


          {/* ======================================
              PROGRESO DE OPERACION
          ====================================== */}

          <div className="progreso-operacion">

            <div className="linea-progreso" />


            <div className="paso-progreso completado">
              <span />

              <small>Arribo</small>

              <strong>08:17</strong>
            </div>


            <div className="paso-progreso actual">
              <span />

              <small>Operación</small>

              <strong>En curso</strong>
            </div>


            <div className="paso-progreso">
              <span />

              <small>Inspección</small>

              <strong>Pendiente</strong>
            </div>


            <div className="paso-progreso">
              <span />

              <small>Zarpe</small>

              <strong>17:00</strong>
            </div>

          </div>

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

            <button type="button">
              Ver todos
              <ArrowUpRight size={16} />
            </button>

          </div>


          <div className="lista-muelles">

            {muelles.map((muelle) => {
              const Icono = muelle.icono;

              return (
                <div
                  className="item-muelle"
                  key={muelle.codigo}
                >

                  <div className="icono-muelle">
                    <Icono size={20} />
                  </div>


                  <div className="informacion-muelle">

                    <strong>
                      {muelle.codigo}
                    </strong>

                    <span>

                      <i
                        className={
                          `punto-muelle ` +
                          `punto-muelle-${muelle.tono}`
                        }
                      />

                      {muelle.estado}

                    </span>

                    <small>
                      {muelle.detalle}
                    </small>

                  </div>


                  <span
                    className={
                      `etiqueta-muelle ` +
                      `etiqueta-muelle-${muelle.tono}`
                    }
                  >
                    {muelle.etiqueta}
                  </span>

                </div>
              );
            })}

          </div>

        </article>

      </div>


      {/* ======================================
          BLOQUE INFERIOR
      ====================================== */}

      <div className="rejilla-inferior-dashboard">


        {/* ======================================
            PROXIMAS OPERACIONES
        ====================================== */}

        <article className="glass-card proximas-operaciones-dashboard">

          <div className="encabezado-tarjeta-dashboard">

            <h2>
              <Clock size={21} />
              Próximas operaciones
            </h2>

            <button type="button">
              Ver todas
              <ArrowUpRight size={16} />
            </button>

          </div>


          <div className="contenedor-tabla-dashboard">

            <table className="tabla-dashboard">

              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Buque</th>
                  <th>Operación</th>
                  <th>Muelle</th>
                  <th>Estado</th>
                </tr>
              </thead>


              <tbody>

                {proximasOperaciones.map((operacion) => (
                  <tr
                    key={`${operacion.buque}-${operacion.hora}`}
                  >

                    <td>
                      {operacion.hora}
                    </td>

                    <td>
                      {operacion.buque}
                    </td>

                    <td>
                      {operacion.operacion}
                    </td>

                    <td>
                      {operacion.muelle}
                    </td>

                    <td>

                      <span
                        className={
                          `etiqueta-estado-operacion ` +
                          `etiqueta-estado-operacion-${operacion.tono}`
                        }
                      >
                        {operacion.estado}
                      </span>

                    </td>

                  </tr>
                ))}

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

            <button type="button">
              Ver detalles
              <ArrowUpRight size={16} />
            </button>

          </div>


          <small>
            Total registrados
          </small>


          <div className="total-contenedores">
            128
          </div>


          <div className="barras-contenedores">


            <div>

              <span>
                Procesados

                <strong>
                  94
                </strong>
              </span>


              <div className="fondo-barra-progreso">

                <div
                  className="relleno-barra-progreso procesados"
                  style={{
                    width: "73%",
                  }}
                />

              </div>

            </div>


            <div>

              <span>
                Pendientes

                <strong>
                  34
                </strong>
              </span>


              <div className="fondo-barra-progreso">

                <div
                  className="relleno-barra-progreso pendientes"
                  style={{
                    width: "27%",
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

            <button type="button">
              Ver todas
              <ArrowUpRight size={16} />
            </button>

          </div>


          <div className="lista-actividad">

            {actividadReciente.map((actividad) => (

              <div
                className="item-actividad"
                key={`${actividad.titulo}-${actividad.hora}`}
              >

                <span
                  className={
                    `punto-actividad ` +
                    `punto-actividad-${actividad.tono}`
                  }
                />


                <div>

                  <strong>
                    {actividad.titulo}
                  </strong>

                  <small>
                    {actividad.detalle}
                  </small>

                </div>


                <time>
                  {actividad.hora}
                </time>

              </div>

            ))}

          </div>

        </article>

      </div>

    </section>
  );
}

export default DashboardPage;