import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Edit3,
  FileText,
  Flag,
  MapPin,
  Package,
  RefreshCw,
  SearchCheck,
  Ship,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  obtenerOperacionPorId,
} from "../../services/operacionesService.js";

import "../../styles/detalleOperacion.css";


const estadosOperacion = [
  "Programada",
  "Muelle asignado",
  "En puerto",
  "En operación",
  "Finalizada",
];


function DetalleOperacionPage() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();


  const [
    operacion,
    setOperacion,
  ] = useState(null);


  const [
    cargando,
    setCargando,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {
    async function cargarOperacion() {
      try {
        setCargando(true);

        setError("");

        const datos =
          await obtenerOperacionPorId(
            id
          );

        setOperacion(datos);
      } catch (error) {
        setError(
          error.message
        );
      } finally {
        setCargando(false);
      }
    }


    cargarOperacion();
  }, [id]);


  function formatearFechaHora(
    fecha
  ) {
    if (!fecha) {
      return "No registrada";
    }

    return new Intl.DateTimeFormat(
      "es-SV",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(
      new Date(fecha)
    );
  }


  function formatearFecha(
    fecha
  ) {
    if (!fecha) {
      return "—";
    }

    return new Intl.DateTimeFormat(
      "es-SV",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(
      new Date(fecha)
    );
  }


  function obtenerClaseEstado(
    estado
  ) {
    switch (estado) {
      case "Programada":
        return "programada";

      case "Muelle asignado":
        return "muelle-asignado";

      case "En puerto":
        return "en-puerto";

      case "En operación":
        return "en-operacion";

      case "Finalizada":
        return "finalizada";

      default:
        return "";
    }
  }


  function obtenerIndiceEstado() {
    return estadosOperacion.indexOf(
      operacion.estado
    );
  }


  if (cargando) {
    return (
      <section className="pagina-detalle-operacion">

        <div className="cargando-detalle-operacion">

          <RefreshCw
            size={27}
            className="icono-cargando-detalle-operacion"
          />

          <span>
            Cargando operación...
          </span>

        </div>

      </section>
    );
  }


  if (error || !operacion) {
    return (
      <section className="pagina-detalle-operacion">

        <button
          type="button"
          className="boton-volver-detalle-operacion"
          onClick={() =>
            navigate(
              "/operaciones"
            )
          }
        >
          <ArrowLeft size={18} />

          Volver a Operaciones
        </button>


        <div className="error-detalle-operacion">

          <Ship size={35} />

          <h2>
            No fue posible mostrar
            la operación
          </h2>

          <p>
            {error ||
              "La operación solicitada no está disponible."}
          </p>

        </div>

      </section>
    );
  }


  const indiceEstado =
    obtenerIndiceEstado();


  return (
    <section className="pagina-detalle-operacion">

      {/* VOLVER */}

      <button
        type="button"
        className="boton-volver-detalle-operacion"
        onClick={() =>
          navigate(
            "/operaciones"
          )
        }
      >
        <ArrowLeft size={18} />

        Volver a Operaciones
      </button>


      {/* ENCABEZADO */}

      <div className="encabezado-detalle-operacion">

        <div className="identidad-operacion">

          <div className="icono-principal-operacion">
            <Ship size={30} />
          </div>


          <div>

            <div className="titulo-operacion">

              <h1>
                {operacion.codigo}
              </h1>


              <span
                className={
                  `estado-detalle-operacion ${obtenerClaseEstado(
                    operacion.estado
                  )}`
                }
              >
                <i />

                {operacion.estado}
              </span>

            </div>


            <p>
              {operacion.buque}
              {" · "}
              {operacion.tipo_carga}
            </p>

          </div>

        </div>


        {operacion.estado !==
          "Finalizada" && (

          <button
            type="button"
            className="boton-editar-operacion"
            onClick={() =>
              navigate(
                `/operaciones/${operacion.id_operacion}/editar`
              )
            }
          >
            <Edit3 size={18} />

            Editar operación
          </button>

        )}

      </div>


      {/* INDICADORES */}

      <div className="resumen-detalle-operacion">

        <article className="tarjeta-indicador-operacion">

          <div>
            <Package size={20} />
          </div>

          <span>
            Contenedores
          </span>

          <strong>
            {
              operacion.total_contenedores
            }
          </strong>

        </article>


        <article className="tarjeta-indicador-operacion">

          <div>
            <SearchCheck size={20} />
          </div>

          <span>
            Inspecciones
          </span>

          <strong>
            {
              operacion.total_inspecciones
            }
          </strong>

        </article>


        <article
          className={
            operacion.incidencias_activas > 0
              ? "tarjeta-indicador-operacion alerta"
              : "tarjeta-indicador-operacion"
          }
        >

          <div>
            <AlertTriangle size={20} />
          </div>

          <span>
            Incidencias activas
          </span>

          <strong>
            {
              operacion.incidencias_activas
            }
          </strong>

        </article>

      </div>


      {/* PROGRESO */}

      <article className="glass-card tarjeta-progreso-operacion">

        <div className="titulo-seccion-detalle-operacion">

          <Clock3 size={20} />

          <div>
            <h2>
              Progreso de la operación
            </h2>

            <p>
              Estado actual dentro del
              flujo portuario.
            </p>
          </div>

        </div>


        <div className="linea-estados-operacion">

          {estadosOperacion.map(
            (
              estado,
              indice
            ) => {

              const completado =
                indice <
                indiceEstado;

              const actual =
                indice ===
                indiceEstado;


              return (
                <div
                  key={estado}
                  className={
                    actual
                      ? "paso-operacion actual"
                      : completado
                        ? "paso-operacion completado"
                        : "paso-operacion"
                  }
                >

                  <div className="circulo-paso-operacion">

                    {completado ? (
                      <CheckCircle2
                        size={16}
                      />
                    ) : (
                      <span>
                        {indice + 1}
                      </span>
                    )}

                  </div>


                  <strong>
                    {estado}
                  </strong>

                </div>
              );
            }
          )}

        </div>

      </article>


      {/* INFORMACION PRINCIPAL */}

      <div className="rejilla-detalle-operacion">


        {/* BUQUE */}

        <article className="glass-card tarjeta-detalle-operacion">

          <div className="titulo-seccion-detalle-operacion">

            <Ship size={20} />

            <div>
              <h2>
                Buque
              </h2>

              <p>
                Embarcación asociada
                a la operación.
              </p>
            </div>

          </div>


          <div className="lista-datos-operacion">

            <div className="dato-operacion">

              <span>
                Nombre
              </span>

              <strong>
                {operacion.buque}
              </strong>

            </div>


            <div className="dato-operacion">

              <span>
                Identificación
              </span>

              <strong>
                {
                  operacion.identificacion_buque
                }
              </strong>

            </div>


            <div className="dato-operacion">

              <span>
                Empresa
              </span>

              <strong>
                {
                  operacion.empresa
                }
              </strong>

            </div>


            <div className="dato-operacion">

              <span>
                Bandera
              </span>

              <strong>
                {
                  operacion.bandera_buque ||
                  "No registrada"
                }
              </strong>

            </div>

          </div>

        </article>


        {/* CARGA */}

        <article className="glass-card tarjeta-detalle-operacion">

          <div className="titulo-seccion-detalle-operacion">

            <Package size={20} />

            <div>
              <h2>
                Carga
              </h2>

              <p>
                Clasificación declarada
                para esta operación.
              </p>
            </div>

          </div>


          <div className="bloque-carga-operacion">

            <div className="icono-carga-operacion">
              <Package size={26} />
            </div>

            <div>

              <span>
                Tipo de carga
              </span>

              <strong>
                {
                  operacion.tipo_carga
                }
              </strong>

            </div>

          </div>

        </article>

      </div>


      {/* RUTA */}

      <article className="glass-card tarjeta-ruta-operacion">

        <div className="titulo-seccion-detalle-operacion">

          <MapPin size={20} />

          <div>
            <h2>
              Ruta
            </h2>

            <p>
              Procedencia y destino
              declarados.
            </p>
          </div>

        </div>


        <div className="ruta-detalle-operacion">

          <div className="punto-ruta-operacion">

            <div className="marcador-ruta origen">
              <MapPin size={19} />
            </div>

            <div>

              <span>
                Procedencia
              </span>

              <strong>
                {
                  operacion.procedencia
                }
              </strong>

            </div>

          </div>


          <div className="linea-ruta-operacion" />


          <div className="punto-ruta-operacion">

            <div className="marcador-ruta destino">
              <MapPin size={19} />
            </div>

            <div>

              <span>
                Destino
              </span>

              <strong>
                {
                  operacion.destino
                }
              </strong>

            </div>

          </div>

        </div>

      </article>


      {/* FECHAS */}

      <article className="glass-card tarjeta-fechas-operacion">

        <div className="titulo-seccion-detalle-operacion">

          <CalendarClock size={20} />

          <div>
            <h2>
              Programación
            </h2>

            <p>
              Fechas estimadas y reales
              de la visita portuaria.
            </p>
          </div>

        </div>


        <div className="rejilla-fechas-operacion">

          <div className="grupo-fechas-operacion">

            <h3>
              Llegada
            </h3>


            <div>

              <span>
                Estimada
              </span>

              <strong>
                {formatearFechaHora(
                  operacion.llegada_estimada
                )}
              </strong>

            </div>


            <div>

              <span>
                Real
              </span>

              <strong
                className={
                  operacion.llegada_real
                    ? "fecha-real registrada"
                    : "fecha-real pendiente"
                }
              >
                {operacion.llegada_real
                  ? formatearFechaHora(
                      operacion.llegada_real
                    )
                  : "Pendiente"}
              </strong>

            </div>

          </div>


          <div className="grupo-fechas-operacion">

            <h3>
              Salida
            </h3>


            <div>

              <span>
                Estimada
              </span>

              <strong>
                {formatearFechaHora(
                  operacion.salida_estimada
                )}
              </strong>

            </div>


            <div>

              <span>
                Real
              </span>

              <strong
                className={
                  operacion.salida_real
                    ? "fecha-real registrada"
                    : "fecha-real pendiente"
                }
              >
                {operacion.salida_real
                  ? formatearFechaHora(
                      operacion.salida_real
                    )
                  : "Pendiente"}
              </strong>

            </div>

          </div>

        </div>

      </article>


      {/* OBSERVACIONES */}

      <article className="glass-card tarjeta-observaciones-operacion">

        <div className="titulo-seccion-detalle-operacion">

          <FileText size={20} />

          <div>
            <h2>
              Observaciones
            </h2>

            <p>
              Información adicional
              registrada.
            </p>
          </div>

        </div>


        <p className="texto-observaciones-operacion">
          {operacion.observaciones ||
            "No se registraron observaciones para esta operación."}
        </p>

      </article>


      {/* REGISTRO */}

      <article className="glass-card tarjeta-registro-operacion">

        <div>

          <span>
            Creada
          </span>

          <strong>
            {formatearFecha(
              operacion.fecha_creacion
            )}
          </strong>

        </div>


        <div>

          <span>
            Última actualización
          </span>

          <strong>
            {formatearFecha(
              operacion.fecha_actualizacion
            )}
          </strong>

        </div>


        <div>

          <span>
            Código interno
          </span>

          <strong>
            {operacion.codigo}
          </strong>

        </div>

      </article>

    </section>
  );
}


export default DetalleOperacionPage;