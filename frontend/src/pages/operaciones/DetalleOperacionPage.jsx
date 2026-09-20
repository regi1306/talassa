import {
  AlertTriangle,
  Anchor,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Edit3,
  FileText,
  LoaderCircle,
  MapPin,
  Package,
  RefreshCw,
  SearchCheck,
  Ship,
  X,
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
  registrarLlegadaOperacion,
  registrarSalidaOperacion,
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


  const [
    mostrarModalLlegada,
    setMostrarModalLlegada,
  ] = useState(false);


  const [
    mostrarModalSalida,
    setMostrarModalSalida,
  ] = useState(false);


  const [
    fechaLlegada,
    setFechaLlegada,
  ] = useState("");


  const [
    fechaSalida,
    setFechaSalida,
  ] = useState("");


  const [
    guardandoEvento,
    setGuardandoEvento,
  ] = useState(false);


  const [
    errorEvento,
    setErrorEvento,
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


  function convertirFechaParaInput(
    fecha
  ) {
    if (!fecha) {
      return "";
    }

    const fechaOriginal =
      new Date(fecha);

    const ajuste =
      fechaOriginal.getTimezoneOffset() *
      60000;

    return new Date(
      fechaOriginal.getTime() -
      ajuste
    )
      .toISOString()
      .slice(0, 16);
  }


  function obtenerFechaHoraActualInput() {
    return convertirFechaParaInput(
      new Date()
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


  function irAsignarMuelle() {
    navigate(
      `/operaciones/${encodeURIComponent(
        operacion.codigo
      )}/asignar-muelle`
    );
  }


  function abrirModalLlegada() {
    setFechaLlegada(
      obtenerFechaHoraActualInput()
    );

    setErrorEvento("");

    setMostrarModalLlegada(
      true
    );
  }


  function cerrarModalLlegada() {
    if (guardandoEvento) {
      return;
    }

    setMostrarModalLlegada(
      false
    );

    setErrorEvento("");
  }


  function abrirModalSalida() {
    setFechaSalida(
      obtenerFechaHoraActualInput()
    );

    setErrorEvento("");

    setMostrarModalSalida(
      true
    );
  }


  function cerrarModalSalida() {
    if (guardandoEvento) {
      return;
    }

    setMostrarModalSalida(
      false
    );

    setErrorEvento("");
  }


  async function confirmarLlegada() {
    if (!fechaLlegada) {
      setErrorEvento(
        "Seleccione la fecha y hora real de llegada."
      );

      return;
    }


    try {
      setGuardandoEvento(true);

      setErrorEvento("");


      const resultado =
        await registrarLlegadaOperacion(
          operacion.id_operacion,
          new Date(
            fechaLlegada
          ).toISOString()
        );


      setOperacion(
        resultado.datos
      );


      setMostrarModalLlegada(
        false
      );


      setFechaLlegada("");
    } catch (error) {
      setErrorEvento(
        error.message
      );
    } finally {
      setGuardandoEvento(false);
    }
  }


  async function confirmarSalida() {
    if (!fechaSalida) {
      setErrorEvento(
        "Seleccione la fecha y hora real de salida."
      );

      return;
    }


    try {
      setGuardandoEvento(true);

      setErrorEvento("");


      const resultado =
        await registrarSalidaOperacion(
          operacion.id_operacion,
          new Date(
            fechaSalida
          ).toISOString()
        );


      setOperacion(
        resultado.datos
      );


      setMostrarModalSalida(
        false
      );


      setFechaSalida("");
    } catch (error) {
      setErrorEvento(
        error.message
      );
    } finally {
      setGuardandoEvento(false);
    }
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


        <div className="acciones-encabezado-operacion">

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


          {operacion.estado ===
            "Programada" && (

            <button
              type="button"
              className="boton-asignar-muelle"
              onClick={
                irAsignarMuelle
              }
            >
              <Anchor size={18} />

              Asignar muelle
            </button>

          )}


          {operacion.estado ===
            "Muelle asignado" &&
            !operacion.llegada_real && (

            <button
              type="button"
              className="boton-evento-operacion llegada"
              onClick={
                abrirModalLlegada
              }
            >
              <CalendarClock
                size={18}
              />

              Registrar llegada
            </button>

          )}


          {operacion.llegada_real &&
            !operacion.salida_real &&
            [
              "En puerto",
              "En operación",
            ].includes(
              operacion.estado
            ) && (

            <button
              type="button"
              className="boton-evento-operacion salida"
              onClick={
                abrirModalSalida
              }
            >
              <CheckCircle2
                size={18}
              />

              Registrar salida
            </button>

          )}

        </div>

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


      {/* INFORMACION */}

      <div className="rejilla-detalle-operacion">

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


      {/* MODAL LLEGADA */}

      {mostrarModalLlegada && (

        <div className="fondo-modal-operacion">

          <div className="modal-evento-operacion">

            <button
              type="button"
              className="cerrar-modal-operacion"
              onClick={
                cerrarModalLlegada
              }
              disabled={
                guardandoEvento
              }
            >
              <X size={19} />
            </button>


            <div className="icono-modal-operacion llegada">
              <CalendarClock
                size={27}
              />
            </div>


            <h2>
              Registrar llegada real
            </h2>


            <p>
              Registre la fecha y hora
              en que el buque llegó
              realmente al puerto.
            </p>


            <div className="resumen-evento-operacion">

              <span>
                Operación
              </span>

              <strong>
                {operacion.codigo}
              </strong>


              <span>
                Buque
              </span>

              <strong>
                {operacion.buque}
              </strong>

            </div>


            <div className="campo-modal-operacion">

              <label htmlFor="fechaLlegada">
                Fecha y hora real
              </label>


              <input
                id="fechaLlegada"
                type="datetime-local"
                value={
                  fechaLlegada
                }
                max={
                  obtenerFechaHoraActualInput()
                }
                onChange={(evento) =>
                  setFechaLlegada(
                    evento.target.value
                  )
                }
              />

            </div>


            {errorEvento && (
              <div className="error-modal-operacion">
                {errorEvento}
              </div>
            )}


            <div className="acciones-modal-operacion">

              <button
                type="button"
                className="boton-cancelar-modal-operacion"
                onClick={
                  cerrarModalLlegada
                }
                disabled={
                  guardandoEvento
                }
              >
                Cancelar
              </button>


              <button
                type="button"
                className="boton-confirmar-modal-operacion"
                onClick={
                  confirmarLlegada
                }
                disabled={
                  guardandoEvento
                }
              >

                {guardandoEvento ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="icono-cargando-evento-operacion"
                    />

                    Registrando...
                  </>
                ) : (
                  <>
                    <CalendarClock
                      size={17}
                    />

                    Confirmar llegada
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      )}


      {/* MODAL SALIDA */}

      {mostrarModalSalida && (

        <div className="fondo-modal-operacion">

          <div className="modal-evento-operacion">

            <button
              type="button"
              className="cerrar-modal-operacion"
              onClick={
                cerrarModalSalida
              }
              disabled={
                guardandoEvento
              }
            >
              <X size={19} />
            </button>


            <div className="icono-modal-operacion salida">
              <CheckCircle2
                size={27}
              />
            </div>


            <h2>
              Registrar salida
            </h2>


            <p>
              Registre la salida real
              del buque. Al confirmar,
              la operación quedará
              finalizada.
            </p>


            <div className="resumen-evento-operacion">

              <span>
                Operación
              </span>

              <strong>
                {operacion.codigo}
              </strong>


              <span>
                Llegada real
              </span>

              <strong>
                {formatearFechaHora(
                  operacion.llegada_real
                )}
              </strong>

            </div>


            <div className="campo-modal-operacion">

              <label htmlFor="fechaSalida">
                Fecha y hora real
              </label>


              <input
                id="fechaSalida"
                type="datetime-local"
                value={
                  fechaSalida
                }
                min={
                  convertirFechaParaInput(
                    operacion.llegada_real
                  )
                }
                max={
                  obtenerFechaHoraActualInput()
                }
                onChange={(evento) =>
                  setFechaSalida(
                    evento.target.value
                  )
                }
              />

            </div>


            {errorEvento && (
              <div className="error-modal-operacion">
                {errorEvento}
              </div>
            )}


            <div className="acciones-modal-operacion">

              <button
                type="button"
                className="boton-cancelar-modal-operacion"
                onClick={
                  cerrarModalSalida
                }
                disabled={
                  guardandoEvento
                }
              >
                Cancelar
              </button>


              <button
                type="button"
                className="boton-confirmar-modal-operacion finalizar"
                onClick={
                  confirmarSalida
                }
                disabled={
                  guardandoEvento
                }
              >

                {guardandoEvento ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="icono-cargando-evento-operacion"
                    />

                    Finalizando...
                  </>
                ) : (
                  <>
                    <CheckCircle2
                      size={17}
                    />

                    Registrar y finalizar
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}


export default DetalleOperacionPage;