import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  ArrowLeft,
  Box,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  ImagePlus,
  MapPin,
  Save,
  Ship,
  Trash2,
  UserRound,
  Wrench,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  actualizarIncidencia,
  crearIncidencia,
  obtenerIncidenciaPorId,
  obtenerOpcionesIncidencia,
} from "../../services/incidenciasService.js";

import "../../styles/incidencias.css";


/* ======================================
   ESTADO INICIAL
====================================== */

const estadoInicial = {
  id_operacion: "",
  id_inspeccion: "",
  id_contenedor: "",
  id_muelle: "",
  id_usuario_reportante: "",
  id_usuario_responsable: "",
  id_tipo_incidencia: "",
  prioridad: "Media",
  estado: "Abierta",
  descripcion: "",
  resolucion: "",
  evidencias: [],
};


/* ======================================
   ARCHIVO -> BASE64
====================================== */

function archivoADataUrl(
  archivo
) {
  return new Promise(
    (resolve, reject) => {

      const lector =
        new FileReader();


      lector.onload = () => {
        resolve(
          lector.result
        );
      };


      lector.onerror = () => {
        reject(
          new Error(
            "No fue posible leer la imagen."
          )
        );
      };


      lector.readAsDataURL(
        archivo
      );
    }
  );
}


/* ======================================
   FORMATEAR FECHA
====================================== */

function formatearFecha(
  valor
) {
  if (!valor) {
    return "-";
  }


  const fecha =
    new Date(valor);


  if (
    Number.isNaN(
      fecha.getTime()
    )
  ) {
    return "-";
  }


  return fecha.toLocaleString(
    "es-SV",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}


/* ======================================
   COMPONENTE
====================================== */

function IncidenciaDetallePage() {
  const navigate =
    useNavigate();


  const location =
    useLocation();


  const { id } =
    useParams();


  /* ======================================
     MODOS
  ====================================== */

  const editando =
    Boolean(id) &&
    location.pathname.endsWith(
      "/editar"
    );


  const soloLectura =
    Boolean(id) &&
    !editando;


  const nueva =
    !id;


  /* ======================================
     ESTADOS
  ====================================== */

  const [
    formulario,
    setFormulario,
  ] = useState(
    estadoInicial
  );


  const [
    incidenciaDetalle,
    setIncidenciaDetalle,
  ] = useState(null);


  const [
    opciones,
    setOpciones,
  ] = useState({
    operaciones: [],
    contenedores: [],
    inspecciones: [],
    muelles: [],
    usuarios: [],
    tipos_incidencia: [],
  });


  const [
    seguimiento,
    setSeguimiento,
  ] = useState([]);


  const [
    cargando,
    setCargando,
  ] = useState(true);


  const [
    guardando,
    setGuardando,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  /* ======================================
     CARGAR DATOS
  ====================================== */

  useEffect(() => {

    async function cargarPantalla() {
      try {
        setCargando(true);

        setError("");


        /* ==============================
           OPCIONES DEL FORMULARIO
        ============================== */

        const respuestaOpciones =
          await obtenerOpcionesIncidencia();


        if (
          !respuestaOpciones.ok
        ) {
          throw new Error(
            respuestaOpciones.mensaje ||
            "No fue posible cargar las opciones."
          );
        }


        const datosOpciones =
          respuestaOpciones.datos ||
          {
            operaciones: [],
            contenedores: [],
            inspecciones: [],
            muelles: [],
            usuarios: [],
            tipos_incidencia: [],
          };


        setOpciones(
          datosOpciones
        );


        /* ==============================
           VER O EDITAR
        ============================== */

        if (id) {
          const respuesta =
            await obtenerIncidenciaPorId(
              id
            );


          if (!respuesta.ok) {
            throw new Error(
              respuesta.mensaje ||
              "No fue posible cargar la incidencia."
            );
          }


          const item =
            respuesta.datos;


          setIncidenciaDetalle(
            item
          );


          setSeguimiento(
            item.seguimiento ||
            []
          );


          setFormulario({
            id_operacion:
              String(
                item.id_operacion ||
                ""
              ),

            id_inspeccion:
              item.id_inspeccion
                ? String(
                    item.id_inspeccion
                  )
                : "",

            id_contenedor:
              item.id_contenedor
                ? String(
                    item.id_contenedor
                  )
                : "",

            id_muelle:
              item.id_muelle
                ? String(
                    item.id_muelle
                  )
                : "",

            id_usuario_reportante:
              String(
                item.id_usuario_reportante ||
                ""
              ),

            id_usuario_responsable:
              item.id_usuario_responsable
                ? String(
                    item.id_usuario_responsable
                  )
                : "",

            id_tipo_incidencia:
              String(
                item.id_tipo_incidencia ||
                ""
              ),

            prioridad:
              item.prioridad ||
              "Media",

            estado:
              item.estado ||
              "Abierta",

            descripcion:
              item.descripcion ||
              "",

            resolucion:
              item.resolucion ||
              "",

            evidencias:
              item.evidencias ||
              [],
          });


          return;
        }


        /* ==============================
           NUEVA INCIDENCIA
        ============================== */

        const usuarios =
          datosOpciones.usuarios ||
          [];


        const inspector =
          usuarios.find(
            (usuario) =>
              (
                usuario.rol ||
                ""
              )
                .toLowerCase()
                .includes(
                  "inspector"
                )
          ) ||
          usuarios[0] ||
          null;


        let operacion =
          datosOpciones
            .operaciones?.[0] ||
          null;


        /*
         * Si se viene desde una inspección
         * intentamos conservar la operación.
         */

        if (
          location.state?.operacion
        ) {
          operacion =
            datosOpciones
              .operaciones
              .find(
                (item) =>
                  item.codigo ===
                  location.state
                    .operacion
              ) ||
            operacion;
        }


        let contenedor =
          null;


        if (
          location.state?.contenedor
        ) {
          contenedor =
            datosOpciones
              .contenedores
              .find(
                (item) =>
                  item.codigo ===
                  location.state
                    .contenedor
              ) ||
            null;
        }


        setFormulario({
          ...estadoInicial,

          id_operacion:
            operacion
              ?.id_operacion
              ? String(
                  operacion.id_operacion
                )
              : "",

          id_contenedor:
            contenedor
              ?.id_contenedor
              ? String(
                  contenedor.id_contenedor
                )
              : "",

          id_muelle:
            operacion
              ?.id_muelle
              ? String(
                  operacion.id_muelle
                )
              : "",

          id_usuario_reportante:
            inspector
              ?.id_usuario
              ? String(
                  inspector.id_usuario
                )
              : "",

          id_tipo_incidencia:
            datosOpciones
              .tipos_incidencia?.[0]
              ?.id_tipo_incidencia
              ? String(
                  datosOpciones
                    .tipos_incidencia[0]
                    .id_tipo_incidencia
                )
              : "",
        });

      } catch (error) {
        console.error(
          "Error al cargar incidencia:",
          error
        );


        setError(
          error.response?.data?.mensaje ||
          error.message ||
          "No fue posible cargar la incidencia."
        );

      } finally {
        setCargando(false);
      }
    }


    cargarPantalla();

  }, [
    id,
  ]);


  /* ======================================
     OPERACIÓN SELECCIONADA
  ====================================== */

  const operacionSeleccionada =
    useMemo(() => {

      return opciones.operaciones.find(
        (item) =>
          String(
            item.id_operacion
          ) ===
          String(
            formulario.id_operacion
          )
      ) || null;

    }, [
      opciones.operaciones,
      formulario.id_operacion,
    ]);


  /* ======================================
     CONTENEDORES DE LA OPERACIÓN
  ====================================== */

  const contenedoresOperacion =
    useMemo(() => {

      return opciones.contenedores.filter(
        (item) =>
          String(
            item.id_operacion
          ) ===
          String(
            formulario.id_operacion
          )
      );

    }, [
      opciones.contenedores,
      formulario.id_operacion,
    ]);


  /* ======================================
     INSPECCIONES DE LA OPERACIÓN
  ====================================== */

  const inspeccionesOperacion =
    useMemo(() => {

      return opciones.inspecciones.filter(
        (item) =>
          String(
            item.id_operacion
          ) ===
          String(
            formulario.id_operacion
          )
      );

    }, [
      opciones.inspecciones,
      formulario.id_operacion,
    ]);


  /* ======================================
     CAMBIAR CAMPO
  ====================================== */

  function cambiarCampo(
    campo,
    valor
  ) {
    if (soloLectura) {
      return;
    }


    setFormulario(
      (anterior) => ({
        ...anterior,

        [campo]:
          valor,
      })
    );


    setError("");
  }


  /* ======================================
     CAMBIAR OPERACIÓN
  ====================================== */

  function cambiarOperacion(
    valor
  ) {
    if (soloLectura) {
      return;
    }


    const operacion =
      opciones.operaciones.find(
        (item) =>
          String(
            item.id_operacion
          ) ===
          String(valor)
      );


    setFormulario(
      (anterior) => ({
        ...anterior,

        id_operacion:
          valor,

        id_inspeccion:
          "",

        id_contenedor:
          "",

        id_muelle:
          operacion
            ?.id_muelle
            ? String(
                operacion.id_muelle
              )
            : "",
      })
    );


    setError("");
  }


  /* ======================================
     AGREGAR IMÁGENES
  ====================================== */

  async function agregarImagenes(
    event
  ) {
    const archivos =
      Array.from(
        event.target.files ||
        []
      );


    if (
      formulario.evidencias.length +
      archivos.length >
      4
    ) {
      setError(
        "Solo puedes agregar hasta 4 imágenes."
      );

      return;
    }


    const nuevas =
      [];


    for (
      const archivo
      of archivos
    ) {
      if (
        !archivo.type.startsWith(
          "image/"
        )
      ) {
        setError(
          "Solo se permiten archivos de imagen."
        );

        continue;
      }


      if (
        archivo.size >
        2 * 1024 * 1024
      ) {
        setError(
          "Cada imagen puede pesar como máximo 2 MB."
        );

        continue;
      }


      const dataUrl =
        await archivoADataUrl(
          archivo
        );


      const posicion =
        formulario
          .evidencias
          .length +
        nuevas.length;


      nuevas.push({
        nombre:
          archivo.name,

        tipo:
          archivo.type,

        categoria:
          posicion === 0
            ? "Evidencia del contenedor"
            : posicion === 1
              ? "Daño observado"
              : "Otra evidencia",

        dataUrl,
      });
    }


    setFormulario(
      (anterior) => ({
        ...anterior,

        evidencias: [
          ...anterior.evidencias,
          ...nuevas,
        ],
      })
    );


    event.target.value = "";
  }


  /* ======================================
     ELIMINAR EVIDENCIA
  ====================================== */

  function eliminarEvidencia(
    indice
  ) {
    setFormulario(
      (anterior) => ({
        ...anterior,

        evidencias:
          anterior.evidencias.filter(
            (_, posicion) =>
              posicion !==
              indice
          ),
      })
    );
  }


  /* ======================================
     CAMBIAR CATEGORÍA DE EVIDENCIA
  ====================================== */

  function cambiarCategoriaEvidencia(
    indice,
    categoria
  ) {
    setFormulario(
      (anterior) => ({
        ...anterior,

        evidencias:
          anterior.evidencias.map(
            (
              evidencia,
              posicion
            ) =>
              posicion === indice
                ? {
                    ...evidencia,
                    categoria,
                  }
                : evidencia
          ),
      })
    );
  }


  /* ======================================
     GUARDAR
  ====================================== */

  async function guardarIncidencia(
    event
  ) {
    event.preventDefault();


    if (soloLectura) {
      return;
    }


    if (
      !formulario.id_operacion
    ) {
      setError(
        "Debe seleccionar una operación."
      );

      return;
    }


    if (
      !formulario.id_usuario_reportante
    ) {
      setError(
        "Debe seleccionar un usuario reportante."
      );

      return;
    }


    if (
      !formulario.id_tipo_incidencia
    ) {
      setError(
        "Debe seleccionar un tipo de incidencia."
      );

      return;
    }


    if (
      !formulario.descripcion
        .trim()
    ) {
      setError(
        "La descripción de la incidencia es obligatoria."
      );

      return;
    }


    try {
      setGuardando(true);

      setError("");


      const datos = {
        id_operacion:
          Number(
            formulario.id_operacion
          ),

        id_inspeccion:
          formulario.id_inspeccion
            ? Number(
                formulario.id_inspeccion
              )
            : null,

        id_contenedor:
          formulario.id_contenedor
            ? Number(
                formulario.id_contenedor
              )
            : null,

        id_muelle:
          formulario.id_muelle
            ? Number(
                formulario.id_muelle
              )
            : null,

        id_usuario_reportante:
          Number(
            formulario.id_usuario_reportante
          ),

        id_usuario_responsable:
          formulario.id_usuario_responsable
            ? Number(
                formulario.id_usuario_responsable
              )
            : null,

        id_tipo_incidencia:
          Number(
            formulario.id_tipo_incidencia
          ),

        prioridad:
          formulario.prioridad,

        descripcion:
          formulario.descripcion
            .trim(),

        estado:
          formulario.estado,

        resolucion:
          formulario.resolucion
            .trim() ||
          null,

        evidencias:
          formulario.evidencias,
      };


      let respuesta;


      if (editando) {
        respuesta =
          await actualizarIncidencia(
            id,
            datos
          );
      } else {
        respuesta =
          await crearIncidencia(
            datos
          );
      }


      if (!respuesta.ok) {
        throw new Error(
          respuesta.mensaje ||
          "No fue posible guardar la incidencia."
        );
      }


      navigate(
        "/incidencias"
      );

    } catch (error) {
      console.error(
        "Error al guardar incidencia:",
        error
      );


      setError(
        error.response?.data?.mensaje ||
        error.message ||
        "No fue posible guardar la incidencia."
      );

    } finally {
      setGuardando(false);
    }
  }


  /* ======================================
     CARGANDO
  ====================================== */

  if (cargando) {
    return (
      <section className="incident-detail-page">

        <div className="glass-card incident-form-card">

          Cargando incidencia...

        </div>

      </section>
    );
  }


  /* ======================================
     MODO OJO
     SOLO LECTURA
  ====================================== */

  if (
    soloLectura &&
    incidenciaDetalle
  ) {
    const estados = [
      "Abierta",
      "En revisión",
      "Resuelta",
      "Cerrada",
    ];


    const indiceEstado =
      estados.indexOf(
        incidenciaDetalle.estado
      );


    return (
      <section className="incident-detail-page incident-readonly-page">


        {/* ==================================
            VOLVER
        ================================== */}

        <button
          type="button"
          className="back-link"
          onClick={() =>
            navigate(
              "/incidencias"
            )
          }
        >
          <ArrowLeft size={18} />

          Volver a incidencias
        </button>


        {/* ==================================
            ENCABEZADO
        ================================== */}

        <div className="page-heading incident-readonly-heading">

          <div>

            <h1>
              Detalle de incidencia
            </h1>

            <p>
              Información completa del evento
              reportado y su seguimiento.
            </p>

          </div>


          {incidenciaDetalle.id_operacion && (

            <button
              type="button"
              className="button button-secondary"
              onClick={() =>
                navigate(
                  `/operaciones/${incidenciaDetalle.id_operacion}`
                )
              }
            >
              <ArrowLeft size={17} />

              Volver a operación
            </button>

          )}

        </div>


        {/* ==================================
            INFORMACIÓN GENERAL
        ================================== */}

        <section className="glass-card incident-readonly-general">

          <div className="incident-readonly-title">

            <FileText size={22} />

            <h2>
              Información general
            </h2>

          </div>


          <div className="incident-info-grid">


            {/* CÓDIGO */}

            <div className="incident-info-item">

              <div className="incident-info-icon">
                <FileText size={22} />
              </div>

              <div>

                <span>
                  Código
                </span>

                <strong>
                  {
                    incidenciaDetalle.codigo ||
                    "-"
                  }
                </strong>

              </div>

            </div>


            {/* OPERACIÓN */}

            <div className="incident-info-item">

              <div className="incident-info-icon">
                <FileText size={22} />
              </div>

              <div>

                <span>
                  Operación
                </span>

                <strong>
                  {
                    incidenciaDetalle.operacion ||
                    "-"
                  }
                </strong>

              </div>

            </div>


            {/* BUQUE */}

            <div className="incident-info-item">

              <div className="incident-info-icon">
                <Ship size={23} />
              </div>

              <div>

                <span>
                  Buque
                </span>

                <strong>
                  {
                    incidenciaDetalle.buque ||
                    "Sin buque"
                  }
                </strong>

              </div>

            </div>


            {/* FECHA */}

            <div className="incident-info-item">

              <div className="incident-info-icon">
                <CalendarDays size={22} />
              </div>

              <div>

                <span>
                  Fecha y hora
                </span>

                <strong>
                  {
                    formatearFecha(
                      incidenciaDetalle.fecha_reporte
                    )
                  }
                </strong>

              </div>

            </div>


            {/* CONTENEDOR */}

            <div className="incident-info-item">

              <div className="incident-info-icon">
                <Box size={22} />
              </div>

              <div>

                <span>
                  Contenedor
                </span>

                <strong>
                  {
                    incidenciaDetalle.contenedor ||
                    "Sin contenedor"
                  }
                </strong>

              </div>

            </div>


            {/* REPORTANTE */}

            <div className="incident-info-item">

              <div className="incident-info-icon">
                <UserRound size={22} />
              </div>

              <div>

                <span>
                  Usuario reportante
                </span>

                <strong>
                  {
                    incidenciaDetalle.reportante ||
                    "Sin información"
                  }
                </strong>

              </div>

            </div>


            {/* TIPO */}

            <div className="incident-info-item">

              <div className="incident-info-icon">
                <Wrench size={22} />
              </div>

              <div>

                <span>
                  Tipo de incidencia
                </span>

                <strong>
                  {
                    incidenciaDetalle.tipo_incidencia ||
                    "-"
                  }
                </strong>

              </div>

            </div>


            {/* MUELLE */}

            <div className="incident-info-item">

              <div className="incident-info-icon">
                <MapPin size={22} />
              </div>

              <div>

                <span>
                  Muelle
                </span>

                <strong>
                  {
                    incidenciaDetalle.muelle ||
                    "Sin muelle"
                  }
                </strong>

              </div>

            </div>


            {/* PRIORIDAD / ESTADO */}

            <div className="incident-info-statuses">

              <div>

                <span>
                  Prioridad
                </span>

                <strong
                  className={`
                    incident-detail-pill
                    incident-detail-priority-${(
                      incidenciaDetalle.prioridad ||
                      ""
                    ).toLowerCase()}
                  `}
                >
                  <i />

                  {
                    incidenciaDetalle.prioridad
                  }
                </strong>

              </div>


              <div>

                <span>
                  Estado actual
                </span>

                <strong className="incident-detail-pill incident-detail-state">

                  <i />

                  {
                    incidenciaDetalle.estado
                  }

                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================
            SEGUIMIENTO
        ================================== */}

        <div className="incident-readonly-middle">


          <section className="glass-card incident-timeline-card">

            <div className="incident-readonly-title">

              <Clock3 size={22} />

              <h2>
                Seguimiento de la incidencia
              </h2>

            </div>


            <div className="incident-timeline">

              {estados.map(
                (
                  estado,
                  indice
                ) => {

                  const alcanzado =
                    indice <=
                    indiceEstado;


                  const actual =
                    indice ===
                    indiceEstado;


                  return (
                    <div
                      className="incident-timeline-step"
                      key={estado}
                    >

                      <div
                        className={`
                          incident-timeline-dot
                          ${
                            alcanzado
                              ? "completed"
                              : ""
                          }
                          ${
                            actual
                              ? "current"
                              : ""
                          }
                        `}
                      >

                        {
                          alcanzado &&
                          indice <
                            indiceEstado
                            ? (
                              <CheckCircle2
                                size={18}
                              />
                            )
                            : null
                        }

                      </div>


                      <strong>
                        {estado}
                      </strong>


                      <small>

                        {
                          actual
                            ? "Estado actual"
                            : alcanzado
                              ? "Completado"
                              : "-"
                        }

                      </small>

                    </div>
                  );
                }
              )}

            </div>

          </section>


          {/* ==================================
              ESTADO ACTUAL
          ================================== */}

          <section className="glass-card incident-current-state-card">

            <div className="incident-readonly-title">

              <Clock3 size={22} />

              <h2>
                Estado actual
              </h2>

            </div>


            <div className="incident-current-state-content">

              <span>
                Situación de la incidencia
              </span>

              <strong>
                {
                  incidenciaDetalle.estado
                }
              </strong>

              <small>
                Prioridad{" "}
                {
                  incidenciaDetalle.prioridad
                }
              </small>

            </div>

          </section>

        </div>


        {/* ==================================
            DESCRIPCIÓN + HISTORIAL
        ================================== */}

        <div className="incident-readonly-bottom">


          {/* ==================================
              DESCRIPCIÓN
          ================================== */}

          <section className="glass-card incident-readonly-description">

            <div className="incident-readonly-title">

              <FileText size={22} />

              <h2>
                Descripción de la incidencia
              </h2>

            </div>


            <p className="incident-description-text">

              {
                incidenciaDetalle.descripcion ||
                "Sin descripción registrada."
              }

            </p>


            {/* ==================================
                EVIDENCIAS
            ================================== */}

            <div className="incident-readonly-evidence-grid">

              {(
                incidenciaDetalle.evidencias ||
                []
              ).map(
                (
                  evidencia,
                  indice
                ) => (

                  <article
                    className="incident-readonly-evidence"
                    key={
                      `${evidencia.nombre}-${indice}`
                    }
                  >

                    <img
                      src={
                        evidencia.dataUrl
                      }
                      alt={
                        evidencia.categoria ||
                        "Evidencia"
                      }
                    />


                    <strong>
                      {
                        evidencia.categoria ||
                        "Evidencia"
                      }
                    </strong>

                  </article>

                )
              )}


              {(
                incidenciaDetalle.evidencias ||
                []
              ).length === 0 && (

                <div className="incident-no-evidence">

                  <ImagePlus size={26} />

                  <span>
                    Sin evidencias fotográficas
                  </span>

                </div>

              )}

            </div>

          </section>


          {/* ==================================
              HISTORIAL
          ================================== */}

          <section className="glass-card incident-readonly-history">

            <div className="incident-readonly-title">

              <FileText size={22} />

              <h2>
                Historial / Seguimiento
              </h2>

            </div>


            {seguimiento.length ===
              0 && (

              <p className="incident-history-empty">

                No hay seguimiento registrado.

              </p>

            )}


            {seguimiento.map(
              (evento) => (

                <div
                  className="incident-history-detail-row"
                  key={
                    evento.id_seguimiento
                  }
                >

                  <div className="incident-history-dot" />


                  <div className="incident-history-main">

                    <strong>

                      {
                        evento.estado_nuevo ||
                        evento.tipo_evento
                      }

                    </strong>


                    <p>

                      {
                        evento.comentario ||
                        "Sin comentario."
                      }

                    </p>

                  </div>


                  <div className="incident-history-meta">

                    <span>

                      {
                        formatearFecha(
                          evento.fecha_hora
                        )
                      }

                    </span>


                    <small>

                      {
                        evento.usuario ||
                        "Sistema"
                      }

                    </small>

                  </div>

                </div>

              )
            )}

          </section>

        </div>


        {/* ==================================
            BOTÓN FINAL
        ================================== */}

        <div className="incident-readonly-actions">

          <button
            type="button"
            className="button button-secondary"
            onClick={() =>
              navigate(
                "/incidencias"
              )
            }
          >
            <ArrowLeft size={18} />

            Volver a incidencias
          </button>

        </div>

      </section>
    );
  }


  /* ======================================
     FORMULARIO
     NUEVA / EDITAR
  ====================================== */

  return (
    <section className="incident-detail-page">


      {/* ==================================
          VOLVER
      ================================== */}

      <button
        type="button"
        className="back-link"
        onClick={() =>
          navigate(
            "/incidencias"
          )
        }
      >
        <ArrowLeft size={18} />

        Volver a incidencias
      </button>


      {/* ==================================
          ENCABEZADO
      ================================== */}

      <div className="page-heading">

        <div>

          <h1>

            {
              nueva
                ? "Nueva incidencia"
                : "Editar incidencia"
            }

          </h1>


          <p>

            {
              nueva
                ? "Registra y da seguimiento a una situación operativa."
                : "Actualiza la información de la incidencia."
            }

          </p>

        </div>


        {operacionSeleccionada && (

          <button
            type="button"
            className="button button-secondary"
            onClick={() =>
              navigate(
                `/operaciones/${operacionSeleccionada.id_operacion}`
              )
            }
          >
            <ArrowLeft size={17} />

            Volver a operación
          </button>

        )}

      </div>


      {/* ==================================
          ERROR
      ================================== */}

      {error && (

        <div className="incident-error">

          <AlertTriangle size={18} />

          {error}

        </div>

      )}


      <form
        onSubmit={
          guardarIncidencia
        }
      >


        {/* ==================================
            INFORMACIÓN GENERAL
        ================================== */}

        <div className="glass-card incident-form-card">

          <h2>
            Información general
          </h2>


          <div className="form-grid">


            {/* OPERACIÓN */}

            <label>

              Operación *

              <select
                value={
                  formulario.id_operacion
                }
                onChange={(event) =>
                  cambiarOperacion(
                    event.target.value
                  )
                }
                required
              >

                <option value="">
                  Seleccionar operación
                </option>


                {opciones.operaciones.map(
                  (item) => (

                    <option
                      key={
                        item.id_operacion
                      }
                      value={
                        item.id_operacion
                      }
                    >
                      {
                        item.codigo
                      }

                      {" — "}

                      {
                        item.buque ||
                        "Sin buque"
                      }

                    </option>

                  )
                )}

              </select>

            </label>


            {/* INSPECCIÓN */}

            <label>

              Inspección

              <select
                value={
                  formulario.id_inspeccion
                }
                onChange={(event) =>
                  cambiarCampo(
                    "id_inspeccion",
                    event.target.value
                  )
                }
              >

                <option value="">
                  Sin inspección asociada
                </option>


                {inspeccionesOperacion.map(
                  (item) => (

                    <option
                      key={
                        item.id_inspeccion
                      }
                      value={
                        item.id_inspeccion
                      }
                    >
                      {
                        item.codigo
                      }
                    </option>

                  )
                )}

              </select>

            </label>


            {/* CONTENEDOR */}

            <label>

              Contenedor

              <select
                value={
                  formulario.id_contenedor
                }
                onChange={(event) =>
                  cambiarCampo(
                    "id_contenedor",
                    event.target.value
                  )
                }
              >

                <option value="">
                  Sin contenedor
                </option>


                {contenedoresOperacion.map(
                  (item) => (

                    <option
                      key={
                        item.id_contenedor
                      }
                      value={
                        item.id_contenedor
                      }
                    >
                      {
                        item.codigo
                      }
                    </option>

                  )
                )}

              </select>

            </label>


            {/* MUELLE */}

            <label>

              Muelle

              <select
                value={
                  formulario.id_muelle
                }
                onChange={(event) =>
                  cambiarCampo(
                    "id_muelle",
                    event.target.value
                  )
                }
              >

                <option value="">
                  Sin muelle
                </option>


                {opciones.muelles.map(
                  (item) => (

                    <option
                      key={
                        item.id_muelle
                      }
                      value={
                        item.id_muelle
                      }
                    >
                      {
                        item.codigo
                      }

                      {" — "}

                      {
                        item.nombre
                      }

                    </option>

                  )
                )}

              </select>

            </label>


            {/* TIPO */}

            <label>

              Tipo *

              <select
                value={
                  formulario.id_tipo_incidencia
                }
                onChange={(event) =>
                  cambiarCampo(
                    "id_tipo_incidencia",
                    event.target.value
                  )
                }
                required
              >

                <option value="">
                  Seleccionar tipo
                </option>


                {opciones.tipos_incidencia.map(
                  (item) => (

                    <option
                      key={
                        item.id_tipo_incidencia
                      }
                      value={
                        item.id_tipo_incidencia
                      }
                    >
                      {
                        item.nombre
                      }
                    </option>

                  )
                )}

              </select>

            </label>


            {/* PRIORIDAD */}

            <label>

              Prioridad *

              <select
                value={
                  formulario.prioridad
                }
                onChange={(event) =>
                  cambiarCampo(
                    "prioridad",
                    event.target.value
                  )
                }
                required
              >

                <option value="Baja">
                  Baja
                </option>

                <option value="Media">
                  Media
                </option>

                <option value="Alta">
                  Alta
                </option>

              </select>

            </label>


            {/* REPORTANTE */}

            <label>

              Usuario reportante *

              <select
                value={
                  formulario.id_usuario_reportante
                }
                onChange={(event) =>
                  cambiarCampo(
                    "id_usuario_reportante",
                    event.target.value
                  )
                }
                required
              >

                <option value="">
                  Seleccionar usuario
                </option>


                {opciones.usuarios.map(
                  (item) => (

                    <option
                      key={
                        item.id_usuario
                      }
                      value={
                        item.id_usuario
                      }
                    >
                      {
                        item.nombre
                      }
                    </option>

                  )
                )}

              </select>

            </label>


            {/* RESPONSABLE */}

            <label>

              Responsable

              <select
                value={
                  formulario.id_usuario_responsable
                }
                onChange={(event) =>
                  cambiarCampo(
                    "id_usuario_responsable",
                    event.target.value
                  )
                }
              >

                <option value="">
                  Sin responsable
                </option>


                {opciones.usuarios.map(
                  (item) => (

                    <option
                      key={
                        item.id_usuario
                      }
                      value={
                        item.id_usuario
                      }
                    >
                      {
                        item.nombre
                      }
                    </option>

                  )
                )}

              </select>

            </label>


            {/* ESTADO */}

            <label>

              Estado *

              <select
                value={
                  formulario.estado
                }
                onChange={(event) =>
                  cambiarCampo(
                    "estado",
                    event.target.value
                  )
                }
                required
              >

                <option value="Abierta">
                  Abierta
                </option>

                <option value="En revisión">
                  En revisión
                </option>

                <option value="Resuelta">
                  Resuelta
                </option>

                <option value="Cerrada">
                  Cerrada
                </option>

              </select>

            </label>

          </div>

        </div>


        {/* ==================================
            DESCRIPCIÓN
        ================================== */}

        <div className="glass-card incident-description-card">

          <h2>
            Descripción de la incidencia
          </h2>


          <textarea
            rows="5"
            value={
              formulario.descripcion
            }
            onChange={(event) =>
              cambiarCampo(
                "descripcion",
                event.target.value
              )
            }
            placeholder="Describe detalladamente la situación detectada..."
            required
          />


          {/* ==================================
              RESOLUCIÓN
          ================================== */}

          {(
            formulario.estado ===
              "Resuelta" ||
            formulario.estado ===
              "Cerrada"
          ) && (

            <>

              <h3>
                Resolución
              </h3>


              <textarea
                rows="3"
                value={
                  formulario.resolucion
                }
                onChange={(event) =>
                  cambiarCampo(
                    "resolucion",
                    event.target.value
                  )
                }
                placeholder="Describe la solución aplicada..."
              />

            </>

          )}


          {/* ==================================
              EVIDENCIAS
          ================================== */}

          <div className="incident-evidence-header">

            <h3>
              Evidencias fotográficas
            </h3>


            <label className="button button-secondary incident-add-image">

              <ImagePlus size={18} />

              Agregar evidencia


              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={
                  agregarImagenes
                }
              />

            </label>

          </div>


          <div className="incident-evidence-grid">

            {formulario.evidencias.map(
              (
                evidencia,
                indice
              ) => (

                <article
                  className="incident-evidence-card"
                  key={
                    `${evidencia.nombre}-${indice}`
                  }
                >

                  <img
                    src={
                      evidencia.dataUrl
                    }
                    alt={
                      evidencia.categoria
                    }
                  />


                  <select
                    value={
                      evidencia.categoria
                    }
                    onChange={(event) =>
                      cambiarCategoriaEvidencia(
                        indice,
                        event.target.value
                      )
                    }
                  >

                    <option value="Evidencia del contenedor">
                      Evidencia del contenedor
                    </option>

                    <option value="Daño observado">
                      Daño observado
                    </option>

                    <option value="Otra evidencia">
                      Otra evidencia
                    </option>

                  </select>


                  <button
                    type="button"
                    className="incident-remove-image"
                    onClick={() =>
                      eliminarEvidencia(
                        indice
                      )
                    }
                  >
                    <Trash2 size={17} />
                  </button>

                </article>

              )
            )}


            {formulario.evidencias.length ===
              0 && (

              <label className="incident-empty-evidence">

                <ImagePlus size={28} />

                <span>
                  Agregar evidencia
                </span>


                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={
                    agregarImagenes
                  }
                />

              </label>

            )}

          </div>

        </div>


        {/* ==================================
            BOTONES
        ================================== */}

        <div className="incident-form-actions">

          <button
            type="button"
            className="button button-secondary"
            onClick={() =>
              navigate(
                "/incidencias"
              )
            }
          >
            <ArrowLeft size={17} />

            Volver a incidencias
          </button>


          <button
            type="submit"
            className="button button-primary"
            disabled={
              guardando
            }
          >
            <Save size={18} />

            {
              guardando
                ? "Guardando..."
                : editando
                  ? "Guardar cambios"
                  : "Guardar incidencia"
            }

          </button>

        </div>

      </form>

    </section>
  );
}


export default IncidenciaDetallePage;