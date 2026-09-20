import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import ConfirmacionAsignacionModal
  from "../../components/common/asignaciones/ConfirmacionAsignacionModal.jsx";

import {
  evaluarMuelles,
  confirmarAsignacionMuelle,
} from "../../services/asignacionesService.js";

import {
  Anchor,
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Container,
  FileText,
  Ruler,
  Search,
  Ship,
  TriangleAlert,
  Wrench,
} from "lucide-react";

import "../../styles/evaluacionMuelles.css";


/* =========================================================
   FORMATEAR FECHA
========================================================= */

function formatearFecha(
  fecha
) {
  if (!fecha) {
    return "-";
  }


  return new Intl.DateTimeFormat(
    "es-SV",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone:
        "America/El_Salvador",
    }
  ).format(
    new Date(fecha)
  );
}


/* =========================================================
   FORMATEAR HORA
========================================================= */

function formatearHora(
  fecha
) {
  if (!fecha) {
    return "--:--";
  }


  return new Intl.DateTimeFormat(
    "es-SV",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone:
        "America/El_Salvador",
    }
  ).format(
    new Date(fecha)
  );
}


/* =========================================================
   OBTENER ID DE USUARIO DE LA SESIÓN

   Busca en localStorage y sessionStorage
   para poder enviar el responsable al backend.
========================================================= */

function obtenerIdUsuarioSesion() {
  const almacenamientos = [
    localStorage,
    sessionStorage,
  ];


  const claves = [
    "usuario",
    "user",
    "authUser",
    "auth",
    "sesion",
    "session",
  ];


  for (
    const almacenamiento
    of almacenamientos
  ) {
    for (
      const clave
      of claves
    ) {
      try {
        const valor =
          almacenamiento.getItem(
            clave
          );


        if (!valor) {
          continue;
        }


        const datos =
          JSON.parse(valor);


        const id =
          datos?.id_usuario ??
          datos?.usuario?.id_usuario ??
          datos?.user?.id_usuario ??
          datos?.datos?.id_usuario ??
          datos?.datos?.usuario?.id_usuario;


        if (
          id &&
          Number(id) > 0
        ) {
          return Number(id);
        }

      } catch {
        /*
         * Puede existir alguna clave
         * que no sea JSON.
         */
      }
    }
  }


  return null;
}


/* =========================================================
   COMPONENTE
========================================================= */

function EvaluacionMuellesPage() {
  const navigate =
    useNavigate();


  const { id } =
    useParams();


  /* =======================================================
     DATOS DEL BACKEND
  ======================================================= */

  const [
    operacion,
    setOperacion,
  ] = useState(null);


  const [
    muelles,
    setMuelles,
  ] = useState([]);


  /* =======================================================
     ESTADO DE CARGA
  ======================================================= */

  const [
    cargando,
    setCargando,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  /* =======================================================
     FILTROS
  ======================================================= */

  const [
    busqueda,
    setBusqueda,
  ] = useState("");


  const [
    filtroResultado,
    setFiltroResultado,
  ] = useState("Todos");


  /* =======================================================
     SELECCIÓN
  ======================================================= */

  const [
    muelleSeleccionado,
    setMuelleSeleccionado,
  ] = useState(null);


  /* =======================================================
     MODAL
  ======================================================= */

  const [
    modalConfirmacionAbierto,
    setModalConfirmacionAbierto,
  ] = useState(false);


  const [
    confirmandoAsignacion,
    setConfirmandoAsignacion,
  ] = useState(false);


  const [
    errorAsignacion,
    setErrorAsignacion,
  ] = useState("");


  /* =======================================================
     CARGAR EVALUACIÓN REAL
  ======================================================= */

  async function cargarEvaluacion() {
    try {
      setCargando(true);

      setError("");


      const respuesta =
        await evaluarMuelles(
          id
        );


      if (!respuesta.ok) {
        throw new Error(
          respuesta.mensaje ||
          "No fue posible evaluar los muelles."
        );
      }


      setOperacion(
        respuesta.datos.operacion
      );


      setMuelles(
        respuesta.datos.candidatos ||
        []
      );


      /*
       * Si ya había un muelle seleccionado,
       * comprobamos que siga siendo compatible.
       */

      setMuelleSeleccionado(
        (actual) => {

          if (!actual) {
            return null;
          }


          const actualizado =
            (
              respuesta.datos.candidatos ||
              []
            ).find(
              (item) =>
                Number(
                  item.id_muelle
                ) ===
                Number(
                  actual.id_muelle
                )
            );


          if (
            !actualizado ||
            !actualizado.seleccionable
          ) {
            return null;
          }


          return actualizado;
        }
      );

    } catch (error) {
      console.error(
        "Error al evaluar muelles:",
        error
      );


      setError(
        error.response?.data?.mensaje ||
        error.message ||
        "No fue posible evaluar los muelles."
      );


      setOperacion(null);

      setMuelles([]);

    } finally {
      setCargando(false);
    }
  }


  useEffect(() => {
    cargarEvaluacion();
  }, [id]);


  /* =======================================================
     FILTRAR RESULTADOS
  ======================================================= */

  const candidatosFiltrados =
    useMemo(() => {

      return muelles.filter(
        (muelle) => {

          const texto =
            busqueda
              .trim()
              .toLowerCase();


          const coincideBusqueda =
            (
              muelle.codigo ||
              ""
            )
              .toLowerCase()
              .includes(texto) ||

            (
              muelle.nombre ||
              ""
            )
              .toLowerCase()
              .includes(texto) ||

            (
              muelle.resultado ||
              ""
            )
              .toLowerCase()
              .includes(texto);


          const coincideFiltro =
            filtroResultado ===
              "Todos" ||

            muelle.tipoResultado ===
              filtroResultado;


          return (
            coincideBusqueda &&
            coincideFiltro
          );
        }
      );

    }, [
      muelles,
      busqueda,
      filtroResultado,
    ]);


  /* =======================================================
     SELECCIONAR MUELLE

     NO GUARDA EN POSTGRESQL.
  ======================================================= */

  function seleccionarMuelle(
    muelle
  ) {
    /*
     * Protección del frontend.
     */

    if (
      !muelle.seleccionable ||
      !muelle.compatible
    ) {
      return;
    }


    setMuelleSeleccionado(
      muelle
    );


    setErrorAsignacion(
      ""
    );


    /*
     * Seleccionar abre el modal,
     * pero todavía NO persiste nada.
     */

    setModalConfirmacionAbierto(
      true
    );
  }


  /* =======================================================
     CONTINUAR CON EL SELECCIONADO
  ======================================================= */

  function continuarConSeleccion() {
    if (
      !muelleSeleccionado ||
      !muelleSeleccionado.seleccionable
    ) {
      return;
    }


    setErrorAsignacion(
      ""
    );


    setModalConfirmacionAbierto(
      true
    );
  }


  /* =======================================================
     CERRAR MODAL
  ======================================================= */

  function cerrarModal() {
    if (
      confirmandoAsignacion
    ) {
      return;
    }


    setModalConfirmacionAbierto(
      false
    );


    setErrorAsignacion(
      ""
    );
  }


  /* =======================================================
     VALIDACIONES QUE VE EL MODAL

     Estas ya vienen de la evaluación REAL.
  ======================================================= */

  const validacionesModal =
    useMemo(() => {

      if (
        !muelleSeleccionado
      ) {
        return [];
      }


      const validaciones =
        muelleSeleccionado
          .validaciones ||
        {};


      const resultado = [];


      if (
        validaciones.disponibilidad
      ) {
        resultado.push({
          titulo:
            "Disponibilidad confirmada",

          descripcion:
            "El muelle se encuentra disponible en el período solicitado.",
        });
      }


      if (
        validaciones.sinConflictoHorario
      ) {
        resultado.push({
          titulo:
            "Sin conflicto horario",

          descripcion:
            "No se encontraron asignaciones solapadas en el muelle.",
        });
      }


      if (
        validaciones.compatibilidadFisica
      ) {
        resultado.push({
          titulo:
            "Compatibilidad física verificada",

          descripcion:
            "El muelle cumple con la eslora y el calado requeridos por el buque.",
        });
      }


      if (
        validaciones.compatibilidadCarga
      ) {
        resultado.push({
          titulo:
            "Compatibilidad de carga verificada",

          descripcion:
            `El muelle está habilitado para ${operacion?.tipoCarga || "el tipo de carga de la operación"}.`,
        });
      }


      if (
        validaciones.estadoOperativo
      ) {
        resultado.push({
          titulo:
            "Estado operativo activo",

          descripcion:
            "El muelle se encuentra disponible para operar.",
        });
      }


      return resultado;

    }, [
      muelleSeleccionado,
      operacion,
    ]);


  /* =======================================================
     DATOS DEL MODAL
  ======================================================= */

  const operacionModal =
    useMemo(() => {

      if (!operacion) {
        return null;
      }


      return {
        ...operacion,

        fecha:
          formatearFecha(
            operacion.llegada_estimada
          ),

        horaInicio:
          formatearHora(
            operacion.llegada_estimada
          ),

        horaFin:
          formatearHora(
            operacion.salida_estimada
          ),
      };

    }, [operacion]);


  /* =======================================================
     CONFIRMAR ASIGNACIÓN REAL

     AQUÍ SÍ SE GUARDA EN POSTGRESQL.
  ======================================================= */

  async function confirmarAsignacion() {
    if (
      !muelleSeleccionado ||
      !operacion
    ) {
      return;
    }


    try {
      setConfirmandoAsignacion(
        true
      );


      setErrorAsignacion(
        ""
      );


      const idUsuario =
        obtenerIdUsuarioSesion();


      if (!idUsuario) {
        throw new Error(
          "No se encontró el usuario responsable en la sesión. Vuelve a iniciar sesión e intenta nuevamente."
        );
      }


      /*
       * POST REAL.
       *
       * El backend vuelve a comprobar
       * TODAS las reglas antes del INSERT.
       */

      const respuesta =
        await confirmarAsignacionMuelle({
          id_operacion:
            operacion.id_operacion,

          id_muelle:
            muelleSeleccionado.id_muelle,

          id_usuario_responsable:
            idUsuario,

          observaciones:
            "Asignación confirmada desde la evaluación de muelles de TALASSA.",
        });


      if (!respuesta.ok) {
        throw new Error(
          respuesta.mensaje ||
          "No fue posible confirmar la asignación."
        );
      }


      setModalConfirmacionAbierto(
        false
      );


      setMuelleSeleccionado(
        null
      );


      /*
       * La operación ya cambió a:
       * Muelle asignado.
       */

      navigate(
        `/operaciones/${operacion.id_operacion}`
      );

    } catch (error) {
      console.error(
        "Error al confirmar asignación:",
        error
      );


      const mensaje =
        error.response?.data?.mensaje ||
        error.message ||
        "No fue posible confirmar la asignación.";


      setErrorAsignacion(
        mensaje
      );


      /*
       * MUY IMPORTANTE:
       *
       * Si el backend responde 409,
       * significa que pudo cambiar
       * la disponibilidad mientras
       * el modal estaba abierto.
       *
       * Volvemos a evaluar PostgreSQL.
       */

      if (
        error.response?.status ===
        409
      ) {
        await cargarEvaluacion();
      }

    } finally {
      setConfirmandoAsignacion(
        false
      );
    }
  }


  /* =======================================================
     CARGANDO
  ======================================================= */

  if (cargando) {
    return (
      <section className="evaluacion-muelles-page">

        <div className="glass-card candidate-card">

          Cargando evaluación de muelles...

        </div>

      </section>
    );
  }


  /* =======================================================
     ERROR GENERAL
  ======================================================= */

  if (
    error ||
    !operacion
  ) {
    return (
      <section className="evaluacion-muelles-page">

        <button
          type="button"
          className="back-link"
          onClick={() =>
            navigate(-1)
          }
        >
          <ArrowLeft size={18} />

          Volver a operación
        </button>


        <div className="glass-card candidate-card">

          <div className="candidate-empty">

            {error ||
              "No fue posible cargar la operación."}

          </div>

        </div>

      </section>
    );
  }


  /* =======================================================
     INTERFAZ
  ======================================================= */

  return (
    <section className="evaluacion-muelles-page">


      {/* ===================================================
          SUPERIOR
      =================================================== */}

      <div className="evaluacion-top">


        <div className="evaluacion-title-area">

          <button
            type="button"
            className="back-link"
            onClick={() =>
              navigate(
                `/operaciones/${operacion.id_operacion}`
              )
            }
          >
            <ArrowLeft size={18} />

            Volver a operación
          </button>


          <div className="page-heading evaluacion-heading">

            <div>

              <h1>
                Evaluación de muelles candidatos
              </h1>


              <p>
                Valida disponibilidad, compatibilidad física
                y conflictos antes de asignar el muelle.
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            PROGRESO
        ================================================= */}

        <div className="assignment-progress">


          <div className="assignment-step completed">

            <div className="assignment-step-circle">

              <Check size={17} />

            </div>

            <span>
              Detalles
              <br />
              operación
            </span>

          </div>


          <div className="assignment-progress-line active" />


          <div className="assignment-step current">

            <div className="assignment-step-circle">
              <span />
            </div>

            <strong>
              Evaluación
              <br />
              de muelles
            </strong>

          </div>


          <div className="assignment-progress-line" />


          <div className="assignment-step">

            <div className="assignment-step-circle" />

            <span>
              Confirmación
            </span>

          </div>


          <div className="assignment-progress-line" />


          <div className="assignment-step">

            <div className="assignment-step-circle" />

            <span>
              Asociar
              <br />
              recursos
            </span>

          </div>

        </div>

      </div>


      {/* ===================================================
          RESUMEN OPERACIÓN
      =================================================== */}

      <div className="glass-card operation-summary-card">

        <h2>
          Resumen de la operación
        </h2>


        <div className="operation-summary-grid">


          <div className="operation-summary-item">

            <FileText size={26} />

            <div>

              <span>
                Operación
              </span>

              <strong>
                {operacion.codigo}
              </strong>

            </div>

          </div>


          <div className="operation-summary-item">

            <Ship size={27} />

            <div>

              <span>
                Buque
              </span>

              <strong>
                {operacion.buque}
              </strong>

            </div>

          </div>


          <div className="operation-summary-item">

            <Building2 size={25} />

            <div>

              <span>
                Empresa
              </span>

              <strong>
                {operacion.empresa}
              </strong>

            </div>

          </div>


          <div className="operation-summary-item">

            <CalendarDays size={25} />

            <div>

              <span>
                Ventana horaria
              </span>

              <strong>
                {
                  formatearFecha(
                    operacion.llegada_estimada
                  )
                }
              </strong>

              <small>

                {
                  formatearHora(
                    operacion.llegada_estimada
                  )
                }

                {" – "}

                {
                  formatearHora(
                    operacion.salida_estimada
                  )
                }

              </small>

            </div>

          </div>


          <div className="operation-summary-item">

            <Ruler size={25} />

            <div>

              <span>
                Eslora del buque
              </span>

              <strong>
                {operacion.eslora} m
              </strong>

            </div>

          </div>


          <div className="operation-summary-item">

            <Anchor size={25} />

            <div>

              <span>
                Calado requerido
              </span>

              <strong>
                {operacion.calado} m
              </strong>

            </div>

          </div>


          <div className="operation-summary-item">

            <Container size={25} />

            <div>

              <span>
                Tipo de carga
              </span>

              <strong>
                {operacion.tipoCarga}
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* ===================================================
          MUELLES CANDIDATOS
      =================================================== */}

      <div className="glass-card candidate-card">


        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="candidate-toolbar">

          <h2>

            Muelles candidatos

            <span>
              {" "}
              ({candidatosFiltrados.length})
            </span>

          </h2>


          <div className="candidate-filters">


            <div className="search-control">

              <Search size={18} />

              <input
                type="text"
                placeholder="Buscar muelle..."
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(
                    event.target.value
                  )
                }
              />

            </div>


            <select
              value={filtroResultado}
              onChange={(event) =>
                setFiltroResultado(
                  event.target.value
                )
              }
            >

              <option value="Todos">
                Todos los resultados
              </option>

              <option value="compatible">
                Compatible
              </option>

              <option value="conflicto">
                Conflicto de horario
              </option>

              <option value="restriccion">
                Restricción física
              </option>

              <option value="carga">
                Carga incompatible
              </option>

              <option value="mantenimiento">
                No operativo
              </option>

            </select>

          </div>

        </div>


        {/* =================================================
            LISTADO DINÁMICO
        ================================================= */}

        <div className="candidate-list">


          {candidatosFiltrados.map(
            (muelle) => {

              const seleccionado =
                Number(
                  muelleSeleccionado
                    ?.id_muelle
                ) ===
                Number(
                  muelle.id_muelle
                );


              return (
                <article
                  key={
                    muelle.id_muelle
                  }
                  className={`
                    candidate-row
                    candidate-${muelle.tipoResultado}
                    ${
                      seleccionado
                        ? "selected"
                        : ""
                    }
                  `}
                >


                  {/* MUELLE */}

                  <div className="candidate-main">

                    <div className="candidate-image">

                      <Anchor size={26} />

                    </div>


                    <div className="candidate-title">

                      <strong>
                        {muelle.codigo}
                      </strong>

                      <span>
                        {muelle.nombre}
                      </span>

                    </div>

                  </div>


                  {/* LONGITUD */}

                  <div className="candidate-spec">

                    <span>
                      Longitud máxima
                    </span>

                    <strong>
                      {
                        muelle.longitudMaxima
                      } m
                    </strong>

                  </div>


                  {/* CALADO */}

                  <div className="candidate-spec">

                    <span>
                      Calado máximo
                    </span>

                    <strong>
                      {
                        muelle.caladoMaximo
                      } m
                    </strong>

                  </div>


                  {/* ESTADO */}

                  <div className="candidate-spec">

                    <span>
                      Estado operativo
                    </span>


                    <strong
                      className={
                        muelle.estadoOperativo ===
                          "Disponible"
                          ? "operational-state"
                          : "maintenance-state"
                      }
                    >

                      <i />

                      {
                        muelle.estadoOperativo
                      }

                    </strong>

                  </div>


                  {/* RESULTADO */}

                  <div className="candidate-result">

                    <div className="candidate-result-icon">


                      {
                        muelle.tipoResultado ===
                          "compatible" && (
                          <CheckCircle2 size={27} />
                        )
                      }


                      {
                        muelle.tipoResultado ===
                          "conflicto" && (
                          <Clock3 size={27} />
                        )
                      }


                      {
                        (
                          muelle.tipoResultado ===
                            "restriccion" ||
                          muelle.tipoResultado ===
                            "carga"
                        ) && (
                          <TriangleAlert size={28} />
                        )
                      }


                      {
                        muelle.tipoResultado ===
                          "mantenimiento" && (
                          <Wrench size={27} />
                        )
                      }

                    </div>


                    <div>

                      <strong>
                        {muelle.resultado}
                      </strong>

                      <p>
                        {muelle.motivo}
                      </p>

                    </div>

                  </div>


                  {/* ACCIÓN */}

                  <div className="candidate-action">


                    {muelle.seleccionable ? (

                      <button
                        type="button"
                        className={
                          seleccionado
                            ? "candidate-selected-button"
                            : "candidate-select-button"
                        }
                        onClick={() =>
                          seleccionarMuelle(
                            muelle
                          )
                        }
                      >

                        {seleccionado ? (

                          <>
                            <Check size={18} />

                            Seleccionado
                          </>

                        ) : (

                          <>
                            Seleccionar

                            <ArrowRight size={18} />
                          </>

                        )}

                      </button>

                    ) : (

                      <button
                        type="button"
                        className="candidate-disabled-button"
                        disabled
                      >
                        No disponible
                      </button>

                    )}

                  </div>

                </article>
              );
            }
          )}


          {candidatosFiltrados.length ===
            0 && (

            <div className="candidate-empty">

              No se encontraron muelles con los
              filtros seleccionados.

            </div>

          )}

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="evaluation-footer">

          <button
            type="button"
            className="button button-secondary"
            onClick={() =>
              navigate(
                `/operaciones/${operacion.id_operacion}`
              )
            }
          >
            <ArrowLeft size={18} />

            Volver a operación
          </button>


          <div className="evaluation-next">

            <button
              type="button"
              className="button evaluation-next-button"
              disabled={
                !muelleSeleccionado
              }
              onClick={
                continuarConSeleccion
              }
            >

              Continuar con muelle seleccionado

              <ArrowRight size={18} />

            </button>


            {!muelleSeleccionado ? (

              <small>
                Selecciona un muelle disponible
                para continuar.
              </small>

            ) : (

              <small className="candidate-success-text">

                {
                  muelleSeleccionado.codigo
                }

                {" seleccionado y listo para confirmar."}

              </small>

            )}

          </div>

        </div>

      </div>


      {/* ===================================================
          MODAL
      =================================================== */}

      <ConfirmacionAsignacionModal
        abierto={
          modalConfirmacionAbierto
        }

        operacion={
          operacionModal
        }

        muelle={
          muelleSeleccionado
        }

        validaciones={
          validacionesModal
        }

        confirmando={
          confirmandoAsignacion
        }

        error={
          errorAsignacion
        }

        onCerrar={
          cerrarModal
        }

        onConfirmar={
          confirmarAsignacion
        }
      />

    </section>
  );
}


export default EvaluacionMuellesPage;