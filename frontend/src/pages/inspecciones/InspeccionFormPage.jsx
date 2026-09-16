import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  ClipboardCheck,
  Container,
  LockKeyhole,
  Save,
  Ship,
  UserRound,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  actualizarInspeccion,
  crearInspeccion,
  obtenerInspeccionPorId,
  obtenerOpcionesInspeccion,
} from "../../services/inspeccionesService.js";

import "../../styles/inspecciones.css";


/* ======================================
   FECHA ACTUAL
====================================== */

function obtenerFechaActual() {
  const fecha =
    new Date();

  const compensacion =
    fecha.getTimezoneOffset() *
    60000;

  return new Date(
    fecha.getTime() -
    compensacion
  )
    .toISOString()
    .slice(
      0,
      16
    );
}


/* ======================================
   FECHA POSTGRESQL -> DATETIME LOCAL
====================================== */

function convertirFechaInput(
  valor
) {
  if (!valor) {
    return "";
  }


  const fecha =
    new Date(valor);


  if (
    Number.isNaN(
      fecha.getTime()
    )
  ) {
    return "";
  }


  const compensacion =
    fecha.getTimezoneOffset() *
    60000;


  return new Date(
    fecha.getTime() -
    compensacion
  )
    .toISOString()
    .slice(
      0,
      16
    );
}


/* ======================================
   ESTADO INICIAL
====================================== */

const estadoInicial = {
  id_operacion: "",
  id_contenedor: "",
  id_inspector: "",
  id_tipo_inspeccion: "",
  fecha_hora:
    obtenerFechaActual(),
  resultado: "Conforme",
  estado: "Pendiente",
  observaciones: "",
};


function InspeccionFormPage() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const { id } =
    useParams();


  /* ======================================
     DETECTAR MODO VER
  ====================================== */

  const parametros =
    new URLSearchParams(
      location.search
    );


  const soloLectura =
    parametros.get("modo") ===
    "ver";


  const editando =
    Boolean(id) &&
    !soloLectura;


  const tieneId =
    Boolean(id);


  /* ======================================
     FORMULARIO
  ====================================== */

  const [
    formulario,
    setFormulario,
  ] = useState(
    estadoInicial
  );


  /* ======================================
     OPCIONES
  ====================================== */

  const [
    operaciones,
    setOperaciones,
  ] = useState([]);


  const [
    contenedores,
    setContenedores,
  ] = useState([]);


  const [
    inspectores,
    setInspectores,
  ] = useState([]);


  const [
    tiposInspeccion,
    setTiposInspeccion,
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


  const [
    mensaje,
    setMensaje,
  ] = useState("");


  /* ======================================
     CARGAR OPCIONES Y DATOS
  ====================================== */

  useEffect(() => {

    async function cargarPantalla() {
      try {
        setCargando(true);

        setError("");


        const respuestaOpciones =
          await obtenerOpcionesInspeccion();


        if (
          !respuestaOpciones.ok
        ) {
          throw new Error(
            respuestaOpciones.mensaje ||
            "No fue posible cargar las opciones del formulario."
          );
        }


        const opciones =
          respuestaOpciones.datos ||
          {};


        const operacionesApi =
          opciones.operaciones ||
          [];


        const contenedoresApi =
          opciones.contenedores ||
          [];


        const inspectoresApi =
          opciones.inspectores ||
          [];


        const tiposApi =
          opciones.tipos_inspeccion ||
          [];


        setOperaciones(
          operacionesApi
        );


        setContenedores(
          contenedoresApi
        );


        setInspectores(
          inspectoresApi
        );


        setTiposInspeccion(
          tiposApi
        );


        /* ==================================
           EDITAR O VER
        ================================== */

        if (tieneId) {
          const respuestaInspeccion =
            await obtenerInspeccionPorId(
              id
            );


          if (
            !respuestaInspeccion.ok
          ) {
            throw new Error(
              respuestaInspeccion.mensaje ||
              "No fue posible cargar la inspección."
            );
          }


          const inspeccion =
            respuestaInspeccion.datos;


          setFormulario({
            id_operacion:
              String(
                inspeccion.id_operacion ||
                ""
              ),

            id_contenedor:
              inspeccion.id_contenedor
                ? String(
                    inspeccion.id_contenedor
                  )
                : "",

            id_inspector:
              String(
                inspeccion.id_inspector ||
                ""
              ),

            id_tipo_inspeccion:
              String(
                inspeccion.id_tipo_inspeccion ||
                ""
              ),

            fecha_hora:
              convertirFechaInput(
                inspeccion.fecha_inspeccion ||
                inspeccion.fecha_hora
              ),

            resultado:
              inspeccion.resultado ||
              "Conforme",

            estado:
              inspeccion.estado ||
              "Pendiente",

            observaciones:
              inspeccion.observaciones ||
              "",
          });
        }


        /* ==================================
           NUEVA
        ================================== */

        else {
          setFormulario(
            (anterior) => ({
              ...anterior,

              id_operacion:
                operacionesApi[0]
                  ?.id_operacion
                  ? String(
                      operacionesApi[0]
                        .id_operacion
                    )
                  : "",

              id_inspector:
                inspectoresApi[0]
                  ?.id_inspector
                  ? String(
                      inspectoresApi[0]
                        .id_inspector
                    )
                  : "",

              id_tipo_inspeccion:
                tiposApi[0]
                  ?.id_tipo_inspeccion
                  ? String(
                      tiposApi[0]
                        .id_tipo_inspeccion
                    )
                  : "",
            })
          );
        }

      } catch (error) {
        console.error(
          "Error al cargar formulario:",
          error
        );


        setError(
          error.response?.data?.mensaje ||
          error.message ||
          "No fue posible cargar el formulario."
        );

      } finally {
        setCargando(false);
      }
    }


    cargarPantalla();

  }, [
    id,
    tieneId,
  ]);


  /* ======================================
     OPERACIÓN SELECCIONADA
  ====================================== */

  const operacionSeleccionada =
    useMemo(() => {

      return operaciones.find(
        (operacion) =>
          String(
            operacion.id_operacion
          ) ===
          String(
            formulario.id_operacion
          )
      ) || null;

    }, [
      operaciones,
      formulario.id_operacion,
    ]);


  /* ======================================
     INSPECTOR SELECCIONADO
  ====================================== */

  const inspectorSeleccionado =
    useMemo(() => {

      return inspectores.find(
        (inspector) =>
          String(
            inspector.id_inspector
          ) ===
          String(
            formulario.id_inspector
          )
      ) || null;

    }, [
      inspectores,
      formulario.id_inspector,
    ]);


  /* ======================================
     TIPO SELECCIONADO
  ====================================== */

  const tipoSeleccionado =
    useMemo(() => {

      return tiposInspeccion.find(
        (tipo) =>
          String(
            tipo.id_tipo_inspeccion
          ) ===
          String(
            formulario.id_tipo_inspeccion
          )
      ) || null;

    }, [
      tiposInspeccion,
      formulario.id_tipo_inspeccion,
    ]);


  /* ======================================
     CONTENEDORES DE LA OPERACIÓN
  ====================================== */

  const contenedoresOperacion =
    useMemo(() => {

      return contenedores.filter(
        (contenedor) =>
          String(
            contenedor.id_operacion
          ) ===
          String(
            formulario.id_operacion
          )
      );

    }, [
      contenedores,
      formulario.id_operacion,
    ]);


  /* ======================================
     CONTENEDOR SELECCIONADO
  ====================================== */

  const contenedorSeleccionado =
    useMemo(() => {

      return contenedores.find(
        (contenedor) =>
          String(
            contenedor.id_contenedor
          ) ===
          String(
            formulario.id_contenedor
          )
      ) || null;

    }, [
      contenedores,
      formulario.id_contenedor,
    ]);


  /* ======================================
     ACTUALIZAR
  ====================================== */

  function actualizar(
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

    setMensaje("");
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


    setFormulario(
      (anterior) => ({
        ...anterior,

        id_operacion:
          valor,

        id_contenedor:
          "",
      })
    );


    setError("");

    setMensaje("");
  }


  /* ======================================
     VALIDAR
  ====================================== */

  function validarFormulario() {
    if (
      !formulario.id_operacion
    ) {
      return "Debe seleccionar una operación.";
    }


    if (
      !formulario.id_inspector
    ) {
      return "No hay un inspector asignado.";
    }


    if (
      !formulario.id_tipo_inspeccion
    ) {
      return "Debe seleccionar un tipo de inspección.";
    }


    if (
      !formulario.fecha_hora
    ) {
      return "La fecha y hora son obligatorias.";
    }


    if (
      !formulario.resultado
    ) {
      return "Debe seleccionar un resultado.";
    }


    if (
      !formulario.estado
    ) {
      return "Debe seleccionar un estado.";
    }


    if (
      !formulario.observaciones
        .trim()
    ) {
      return "Las observaciones son obligatorias.";
    }


    return "";
  }


  /* ======================================
     GUARDAR
  ====================================== */

  async function guardar(
    event
  ) {
    event.preventDefault();


    if (soloLectura) {
      return;
    }


    const errorValidacion =
      validarFormulario();


    if (errorValidacion) {
      setError(
        errorValidacion
      );

      return;
    }


    try {
      setGuardando(true);

      setError("");

      setMensaje("");


      const fechaISO =
        new Date(
          formulario.fecha_hora
        ).toISOString();


      const datosInspeccion = {
        id_operacion:
          Number(
            formulario.id_operacion
          ),

        id_contenedor:
          formulario.id_contenedor
            ? Number(
                formulario.id_contenedor
              )
            : null,

        id_inspector:
          Number(
            formulario.id_inspector
          ),

        id_tipo_inspeccion:
          Number(
            formulario.id_tipo_inspeccion
          ),

        fecha_inspeccion:
          fechaISO,

        resultado:
          formulario.resultado,

        estado:
          formulario.estado,

        observaciones:
          formulario.observaciones
            .trim(),
      };


      let respuesta;


      if (editando) {
        respuesta =
          await actualizarInspeccion(
            id,
            datosInspeccion
          );
      } else {
        respuesta =
          await crearInspeccion(
            datosInspeccion
          );
      }


      if (!respuesta.ok) {
        throw new Error(
          respuesta.mensaje ||
          "No fue posible guardar la inspección."
        );
      }


      setMensaje(
        respuesta.mensaje ||
        (
          editando
            ? "Inspección actualizada correctamente."
            : "Inspección registrada correctamente."
        )
      );


      setTimeout(() => {
        navigate(
          "/inspecciones"
        );
      }, 700);

    } catch (error) {
      console.error(
        "Error al guardar inspección:",
        error
      );


      setError(
        error.response?.data?.mensaje ||
        error.message ||
        "No fue posible guardar la inspección."
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
      <section className="inspection-form-page">

        <div className="glass-card inspection-form-card">

          <p>
            Cargando información de la inspección...
          </p>

        </div>

      </section>
    );
  }


  return (
    <section className="inspection-form-page">


      {/* ==================================
          VOLVER
      ================================== */}

      <button
        type="button"
        className="back-link"
        onClick={() =>
          navigate(
            "/inspecciones"
          )
        }
      >
        <ArrowLeft size={18} />

        Volver a inspecciones
      </button>


      {/* ==================================
          TÍTULO
      ================================== */}

      <div className="page-heading">

        <div>

          <h1>

            {
              soloLectura
                ? "Detalle de inspección"
                : editando
                  ? "Actualizar inspección"
                  : "Registrar inspección"
            }

          </h1>


          <p>

            {
              soloLectura
                ? "Consulta la información registrada de la inspección."
                : "Documenta la revisión y actualiza su estado operativo."
            }

          </p>

        </div>

      </div>


      {/* ==================================
          MENSAJES
      ================================== */}

      {error && (

        <div
          style={{
            marginBottom: "16px",
            padding: "13px 16px",
            borderRadius: "12px",
            background:
              "rgba(255, 226, 229, 0.95)",
            color: "#b4232c",
          }}
        >
          {error}
        </div>

      )}


      {mensaje && (

        <div
          style={{
            marginBottom: "16px",
            padding: "13px 16px",
            borderRadius: "12px",
            background:
              "rgba(207, 248, 232, 0.95)",
            color: "#08745d",
          }}
        >
          {mensaje}
        </div>

      )}


      {/* ==================================
          RESUMEN
      ================================== */}

      <div className="glass-card inspection-operation-summary">


        <div className="inspection-operation-main">

          <div className="inspection-operation-icon">

            <Ship size={31} />

          </div>


          <div>

            <div className="inspection-operation-title">

              <strong>

                Operación{" "}

                {
                  operacionSeleccionada
                    ?.codigo ||
                  "Sin seleccionar"
                }

              </strong>


              <span>

                <i />

                {
                  operacionSeleccionada
                    ?.estado ||
                  "Sin estado"
                }

              </span>

            </div>


            <h3>

              {
                operacionSeleccionada
                  ?.buque ||
                "Sin buque"
              }

            </h3>

          </div>

        </div>


        <div className="inspection-summary-item">

          <Container size={24} />

          <div>

            <span>
              Contenedor
            </span>

            <strong>

              {
                contenedorSeleccionado
                  ?.codigo ||
                "Sin contenedor"
              }

            </strong>

            <small>
              Campo opcional
            </small>

          </div>

        </div>


        <div className="inspection-summary-item">

          <ClipboardCheck size={24} />

          <div>

            <span>
              Tipo
            </span>

            <strong>

              {
                tipoSeleccionado
                  ?.nombre ||
                "Sin seleccionar"
              }

            </strong>

          </div>

        </div>


        <div className="inspection-summary-item">

          <UserRound size={24} />

          <div>

            <span>
              Inspector
            </span>

            <strong>

              {
                inspectorSeleccionado
                  ?.nombre ||
                "Sin asignar"
              }

            </strong>

          </div>

        </div>

      </div>


      {/* ==================================
          FORMULARIO
      ================================== */}

      <form
        className="glass-card user-form-card inspection-form-card"
        onSubmit={
          guardar
        }
      >


        <div className="inspection-form-section-title">


          <div className="form-section-icon">

            <ClipboardCheck size={24} />

          </div>


          <div>

            <h2>
              Datos de la inspección
            </h2>

            <p>

              {
                soloLectura
                  ? "Información registrada en TALASSA. Esta vista es únicamente de consulta."
                  : "Completa la información de la inspección. Los campos marcados con * son obligatorios."
              }

            </p>

          </div>

        </div>


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
              disabled={
                soloLectura
              }
              required
            >

              <option value="">
                Seleccionar operación
              </option>


              {operaciones.map(
                (operacion) => (

                  <option
                    key={
                      operacion.id_operacion
                    }
                    value={
                      operacion.id_operacion
                    }
                  >

                    {
                      operacion.codigo
                    }

                    {" — "}

                    {
                      operacion.buque ||
                      "Sin buque"
                    }

                  </option>

                )
              )}

            </select>


            <small>
              Operación que será inspeccionada.
            </small>

          </label>


          {/* INSPECTOR */}

          <label>

            Inspector *


            <div className="inspection-readonly-input">

              <UserRound size={18} />


              <input
                value={
                  inspectorSeleccionado
                    ?.nombre ||
                  ""
                }
                readOnly
              />


              <LockKeyhole size={17} />

            </div>


            <small>
              Asignado automáticamente.
            </small>

          </label>


          {/* CONTENEDOR */}

          <label>

            Contenedor


            <select
              value={
                formulario.id_contenedor
              }
              onChange={(event) =>
                actualizar(
                  "id_contenedor",
                  event.target.value
                )
              }
              disabled={
                soloLectura
              }
            >

              <option value="">
                Sin contenedor asociado
              </option>


              {contenedoresOperacion.map(
                (contenedor) => (

                  <option
                    key={
                      contenedor.id_contenedor
                    }
                    value={
                      contenedor.id_contenedor
                    }
                  >
                    {
                      contenedor.codigo
                    }
                  </option>

                )
              )}

            </select>


            <small>
              Campo opcional.
            </small>

          </label>


          {/* TIPO */}

          <label>

            Tipo *


            <select
              value={
                formulario.id_tipo_inspeccion
              }
              onChange={(event) =>
                actualizar(
                  "id_tipo_inspeccion",
                  event.target.value
                )
              }
              disabled={
                soloLectura
              }
              required
            >

              <option value="">
                Seleccionar tipo
              </option>


              {tiposInspeccion.map(
                (tipo) => (

                  <option
                    key={
                      tipo.id_tipo_inspeccion
                    }
                    value={
                      tipo.id_tipo_inspeccion
                    }
                  >
                    {
                      tipo.nombre
                    }
                  </option>

                )
              )}

            </select>


            <small>
              Proviene del catálogo de tipos
              de inspección.
            </small>

          </label>


          {/* FECHA */}

          <label>

            Fecha y hora *


            <div className="input-with-icon">

              <input
                type="datetime-local"
                value={
                  formulario.fecha_hora
                }
                onChange={(event) =>
                  actualizar(
                    "fecha_hora",
                    event.target.value
                  )
                }
                readOnly={
                  soloLectura
                }
                required
              />


              <CalendarDays
                size={18}
                className="inspection-calendar-icon"
              />

            </div>

          </label>


          {/* ESTADO */}

          <label>

            Estado *


            <select
              value={
                formulario.estado
              }
              onChange={(event) =>
                actualizar(
                  "estado",
                  event.target.value
                )
              }
              disabled={
                soloLectura
              }
              required
            >

              <option value="Pendiente">
                Pendiente
              </option>

              <option value="En proceso">
                En proceso
              </option>

              <option value="Finalizada">
                Finalizada
              </option>

            </select>

          </label>


          {/* RESULTADO */}

          <label>

            Resultado *


            <select
              value={
                formulario.resultado
              }
              onChange={(event) =>
                actualizar(
                  "resultado",
                  event.target.value
                )
              }
              disabled={
                soloLectura
              }
              required
            >

              <option value="Conforme">
                Conforme
              </option>

              <option value="Observado">
                Observado
              </option>

              <option value="No conforme">
                No conforme
              </option>

            </select>

          </label>


          {/* OBSERVACIONES */}

          <label className="form-full">

            Observaciones *


            <textarea
              value={
                formulario.observaciones
              }
              onChange={(event) =>
                actualizar(
                  "observaciones",
                  event.target.value
                )
              }
              maxLength="500"
              rows="4"
              placeholder="Describe los hallazgos encontrados durante la inspección..."
              readOnly={
                soloLectura
              }
              required
            />


            <div className="inspection-textarea-footer">

              <small>
                Describe hallazgos,
                observaciones o recomendaciones.
              </small>


              <span>

                {
                  formulario.observaciones
                    .length
                }

                /500

              </span>

            </div>

          </label>

        </div>


        {/* ==================================
            BOTONES
        ================================== */}

        <div className="inspection-form-actions">


          {soloLectura ? (

            <button
              type="button"
              className="button button-primary"
              onClick={() =>
                navigate(
                  "/inspecciones"
                )
              }
            >
              <ArrowLeft size={18} />

              Volver al listado
            </button>

          ) : (

            <>

              <button
                type="button"
                className="button button-secondary"
                onClick={() =>
                  navigate(
                    "/inspecciones"
                  )
                }
                disabled={
                  guardando
                }
              >
                Cancelar
              </button>


              <button
                type="button"
                className="button inspection-incident-button"
                onClick={() =>
                  navigate(
                    "/incidencias/nueva",
                    {
                      state: {
                        operacion:
                          operacionSeleccionada
                            ?.codigo ||
                          "",

                        contenedor:
                          contenedorSeleccionado
                            ?.codigo ||
                          "",
                      },
                    }
                  )
                }
                disabled={
                  guardando
                }
              >

                <AlertTriangle size={19} />

                Registrar incidencia

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
                      : "Guardar inspección"
                }

              </button>

            </>

          )}

        </div>

      </form>

    </section>
  );
}


export default InspeccionFormPage;