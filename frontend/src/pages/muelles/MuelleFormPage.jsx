import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Anchor,
  ArrowLeft,
  CheckCircle2,
  Info,
  Package,
  Ruler,
  Save,
  Ship,
  ShipWheel,
  Waves,
} from "lucide-react";

import {
  actualizarMuelle,
  crearMuelle,
  obtenerMuellePorId,
  obtenerOpcionesFormularioMuelle,
} from "../../services/muellesService.js";

import "../../styles/muelles.css";


/* ======================================
   ESTADO INICIAL
====================================== */

const estadoInicial = {
  codigo: "",
  nombre: "",
  longitud_maxima: "",
  calado_maximo: "",
  estado_operativo:
    "Disponible",

  tipos_carga_permitidos:
    [],

  restricciones_adicionales:
    "",

  observaciones:
    "",
};


/* ======================================
   CLASE DEL ESTADO
====================================== */

function obtenerClaseEstado(
  estado
) {
  switch (estado) {

    case "Disponible":
      return "muelle-status-disponible";

    case "Mantenimiento":
      return "muelle-status-mantenimiento";

    case "Fuera de servicio":
      return "muelle-status-fuera";

    default:
      return "";
  }
}


function MuelleFormPage() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const { id } =
    useParams();


  /* ======================================
     MODOS
  ====================================== */

  const soloLectura =
    location.pathname.endsWith(
      "/ver"
    );

  const modoEdicion =
    Boolean(id) &&
    !soloLectura;

  const tieneId =
    Boolean(id);


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
    tiposCarga,
    setTiposCarga,
  ] = useState([]);


  const [
    muelleCompleto,
    setMuelleCompleto,
  ] = useState(null);


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
     CARGAR OPCIONES + MUELLE
  ====================================== */

  useEffect(() => {
    async function cargarPantalla() {
      try {
        setCargando(true);

        setError("");


        const respuestaOpciones =
          await obtenerOpcionesFormularioMuelle();


        if (
          !respuestaOpciones.ok
        ) {
          throw new Error(
            respuestaOpciones.mensaje ||
            "No fue posible cargar los tipos de carga."
          );
        }


        setTiposCarga(
          respuestaOpciones.datos
            ?.tipos_carga ||
          []
        );


        if (!tieneId) {
          return;
        }


        const respuesta =
          await obtenerMuellePorId(
            id
          );


        if (!respuesta.ok) {
          throw new Error(
            respuesta.mensaje ||
            "No fue posible cargar el muelle."
          );
        }


        const muelle =
          respuesta.datos;


        setMuelleCompleto(
          muelle
        );


        setFormulario({
          codigo:
            muelle.codigo ||
            "",

          nombre:
            muelle.nombre ||
            "",

          longitud_maxima:
            muelle.longitud_maxima ||
            "",

          calado_maximo:
            muelle.calado_maximo ||
            "",

          estado_operativo:
            muelle.estado_operativo ||
            "Disponible",

          tipos_carga_permitidos:
            (
              muelle.tipos_carga ||
              []
            ).map(
              (tipo) =>
                String(
                  tipo.id_tipo_carga
                )
            ),

          restricciones_adicionales:
            muelle.restricciones_adicionales ||
            "",

          observaciones:
            muelle.observaciones ||
            "",
        });

      } catch (error) {

        console.error(
          "Error al cargar formulario de muelle:",
          error
        );


        setError(
          error.response?.data?.mensaje ||
          error.message ||
          "No fue posible cargar la información del muelle."
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
     CAMBIAR CAMPOS
  ====================================== */

  function manejarCambio(
    event
  ) {
    if (soloLectura) {
      return;
    }


    const {
      name,
      value,
    } = event.target;


    setFormulario(
      (anterior) => ({
        ...anterior,

        [name]:
          value,
      })
    );


    setError("");

    setMensaje("");
  }


  /* ======================================
     CAMBIAR TIPO DE CARGA
  ====================================== */

  function manejarTipoCarga(
    event
  ) {
    if (soloLectura) {
      return;
    }


    const {
      value,
      checked,
    } = event.target;


    setFormulario(
      (anterior) => {

        const actuales =
          anterior
            .tipos_carga_permitidos;


        const nuevos =
          checked
            ? [
                ...actuales,
                value,
              ]
            : actuales.filter(
                (idTipo) =>
                  idTipo !== value
              );


        return {
          ...anterior,

          tipos_carga_permitidos:
            nuevos,
        };
      }
    );


    setError("");

    setMensaje("");
  }


  /* ======================================
     VALIDAR FORMULARIO
  ====================================== */

  function validarFormulario() {
    if (
      !formulario.codigo.trim()
    ) {
      return "El código del muelle es obligatorio.";
    }


    if (
      !formulario.nombre.trim()
    ) {
      return "El nombre del muelle es obligatorio.";
    }


    const longitud =
      Number(
        formulario.longitud_maxima
      );


    if (
      !Number.isFinite(
        longitud
      ) ||
      longitud <= 0
    ) {
      return "La longitud máxima debe ser mayor que cero.";
    }


    const calado =
      Number(
        formulario.calado_maximo
      );


    if (
      !Number.isFinite(
        calado
      ) ||
      calado <= 0
    ) {
      return "El calado máximo debe ser mayor que cero.";
    }


    if (
      formulario
        .tipos_carga_permitidos
        .length === 0
    ) {
      return "Seleccione al menos un tipo de carga permitido.";
    }


    return "";
  }


  /* ======================================
     GUARDAR
  ====================================== */

  async function manejarSubmit(
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


    const datosMuelle = {
      codigo:
        formulario.codigo
          .trim()
          .toUpperCase(),

      nombre:
        formulario.nombre
          .trim(),

      longitud_maxima:
        Number(
          formulario.longitud_maxima
        ),

      calado_maximo:
        Number(
          formulario.calado_maximo
        ),

      estado_operativo:
        formulario.estado_operativo,

      tipos_carga_permitidos:
        formulario
          .tipos_carga_permitidos
          .map(
            (idTipo) =>
              Number(idTipo)
          ),

      restricciones_adicionales:
        formulario
          .restricciones_adicionales
          .trim() ||
        null,

      observaciones:
        formulario
          .observaciones
          .trim() ||
        null,
    };


    try {
      setGuardando(true);

      setError("");

      setMensaje("");


      let respuesta;


      if (modoEdicion) {

        respuesta =
          await actualizarMuelle(
            id,
            datosMuelle
          );

      } else {

        respuesta =
          await crearMuelle(
            datosMuelle
          );

      }


      if (!respuesta.ok) {
        throw new Error(
          respuesta.mensaje ||
          "No fue posible guardar el muelle."
        );
      }


      setMensaje(
        respuesta.mensaje ||
        (
          modoEdicion
            ? "Muelle actualizado correctamente."
            : "Muelle registrado correctamente."
        )
      );


      setTimeout(() => {
        navigate(
          "/muelles"
        );
      }, 700);

    } catch (error) {

      console.error(
        "Error al guardar muelle:",
        error
      );


      setError(
        error.response?.data?.mensaje ||
        error.message ||
        "No fue posible guardar el muelle."
      );

    } finally {

      setGuardando(false);

    }
  }


  /* ======================================
     NOMBRES DE TIPOS SELECCIONADOS
  ====================================== */

  const nombresTiposSeleccionados =
    tiposCarga
      .filter(
        (tipo) =>
          formulario
            .tipos_carga_permitidos
            .includes(
              String(
                tipo.id_tipo_carga
              )
            )
      )
      .map(
        (tipo) =>
          tipo.nombre
      );


  /* ======================================
     CARGANDO
  ====================================== */

  if (cargando) {
    return (
      <section className="muelle-form-page">

        <div className="glass-card muelle-form-card">

          <p>
            Cargando información del muelle...
          </p>

        </div>

      </section>
    );
  }


  return (
    <section className="muelle-form-page">


      {/* ==================================
          ENCABEZADO
      ================================== */}

      <div className="page-heading muelle-form-heading">

        <div>

          <button
            type="button"
            className="button button-secondary"
            onClick={() =>
              navigate(
                "/muelles"
              )
            }
          >
            <ArrowLeft size={18} />

            Volver
          </button>


          <h1>
            {
              soloLectura
                ? "Detalle del muelle"
                : modoEdicion
                  ? "Editar muelle"
                  : "Registrar muelle"
            }
          </h1>


          <p>
            {
              soloLectura
                ? "Consulta la información registrada del muelle."
                : modoEdicion
                  ? "Actualiza la información operativa del muelle seleccionado."
                  : "Registra un nuevo recurso portuario en TALASSA."
            }
          </p>

        </div>

      </div>


      {/* ERROR */}

      {error && (

        <div
          style={{
            marginBottom:
              "16px",

            padding:
              "13px 16px",

            borderRadius:
              "12px",

            background:
              "rgba(255, 226, 229, 0.94)",

            color:
              "#b4232c",
          }}
        >
          {error}
        </div>

      )}


      {/* MENSAJE */}

      {mensaje && (

        <div
          style={{
            marginBottom:
              "16px",

            padding:
              "13px 16px",

            borderRadius:
              "12px",

            background:
              "rgba(207, 248, 232, 0.94)",

            color:
              "#08745d",
          }}
        >
          {mensaje}
        </div>

      )}


      <div className="muelle-form-layout">


        {/* ==================================
            FORMULARIO
        ================================== */}

        <form
          className="
            glass-card
            user-form-card
            muelle-form-card
          "
          onSubmit={
            manejarSubmit
          }
        >

          <div className="form-section-heading">

            <div className="form-section-icon">

              <Anchor size={21} />

            </div>


            <div>

              <h2>
                Información del muelle
              </h2>

              <p>
                {
                  soloLectura
                    ? "Información registrada en TALASSA."
                    : "Complete los datos técnicos y operativos."
                }
              </p>

            </div>

          </div>


          <div className="form-grid">


            {/* CÓDIGO */}

            <div className="form-field">

              <label htmlFor="codigo">
                Código del muelle
              </label>

              <input
                id="codigo"
                name="codigo"
                type="text"
                placeholder="Ej. M-05"
                maxLength={20}
                value={
                  formulario.codigo
                }
                onChange={
                  manejarCambio
                }
                readOnly={
                  soloLectura
                }
              />

            </div>


            {/* NOMBRE */}

            <div className="form-field">

              <label htmlFor="nombre">
                Nombre
              </label>

              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej. Muelle Internacional"
                maxLength={100}
                value={
                  formulario.nombre
                }
                onChange={
                  manejarCambio
                }
                readOnly={
                  soloLectura
                }
              />

            </div>


            {/* LONGITUD */}

            <div className="form-field">

              <label htmlFor="longitud_maxima">
                Longitud máxima
              </label>

              <div className="muelle-measure-input">

                <input
                  id="longitud_maxima"
                  name="longitud_maxima"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="260"
                  value={
                    formulario.longitud_maxima
                  }
                  onChange={
                    manejarCambio
                  }
                  readOnly={
                    soloLectura
                  }
                />

                <span>
                  m
                </span>

              </div>

            </div>


            {/* CALADO */}

            <div className="form-field">

              <label htmlFor="calado_maximo">
                Calado máximo
              </label>

              <div className="muelle-measure-input">

                <input
                  id="calado_maximo"
                  name="calado_maximo"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="14"
                  value={
                    formulario.calado_maximo
                  }
                  onChange={
                    manejarCambio
                  }
                  readOnly={
                    soloLectura
                  }
                />

                <span>
                  m
                </span>

              </div>

            </div>


            {/* ESTADO */}

            <div className="form-field form-field-full">

              <label htmlFor="estado_operativo">
                Estado operativo
              </label>

              <select
                id="estado_operativo"
                name="estado_operativo"
                value={
                  formulario.estado_operativo
                }
                onChange={
                  manejarCambio
                }
                disabled={
                  soloLectura
                }
              >

                <option value="Disponible">
                  Disponible
                </option>

                <option value="Mantenimiento">
                  Mantenimiento
                </option>

                <option value="Fuera de servicio">
                  Fuera de servicio
                </option>

              </select>

            </div>


            {/* ==================================
                TIPOS DE CARGA
            ================================== */}

            <div className="form-field form-field-full">

              <label>
                Tipos de carga permitidos
                <span className="muelle-required">
                  *
                </span>
              </label>


              <div className="muelle-cargo-options">

                {tiposCarga.length > 0 ? (

                  tiposCarga.map(
                    (tipo) => {

                      const seleccionado =
                        formulario
                          .tipos_carga_permitidos
                          .includes(
                            String(
                              tipo.id_tipo_carga
                            )
                          );


                      return (
                        <label
                          key={
                            tipo.id_tipo_carga
                          }
                          className={
                            seleccionado
                              ? "muelle-cargo-option selected"
                              : "muelle-cargo-option"
                          }
                        >

                          <input
                            type="checkbox"
                            value={
                              tipo.id_tipo_carga
                            }
                            checked={
                              seleccionado
                            }
                            onChange={
                              manejarTipoCarga
                            }
                            disabled={
                              soloLectura
                            }
                          />


                          <Package
                            size={18}
                          />


                          <div>

                            <strong>
                              {
                                tipo.nombre
                              }
                            </strong>

                            {tipo.descripcion && (
                              <small>
                                {
                                  tipo.descripcion
                                }
                              </small>
                            )}

                          </div>

                        </label>
                      );
                    }
                  )

                ) : (

                  <p className="muelle-no-cargo-options">
                    No hay tipos de carga activos disponibles.
                  </p>

                )}

              </div>

            </div>


            {/* RESTRICCIONES */}

            <div className="form-field form-field-full">

              <label htmlFor="restricciones_adicionales">
                Restricciones adicionales
                <small>
                  Opcional
                </small>
              </label>

              <textarea
                id="restricciones_adicionales"
                name="restricciones_adicionales"
                rows={3}
                maxLength={1000}
                placeholder="Ej. Restricciones especiales de acceso, maniobra o condiciones operativas..."
                value={
                  formulario.restricciones_adicionales
                }
                onChange={
                  manejarCambio
                }
                readOnly={
                  soloLectura
                }
              />

            </div>


            {/* OBSERVACIONES */}

            <div className="form-field form-field-full">

              <label htmlFor="observaciones">
                Observaciones
                <small>
                  Opcional
                </small>
              </label>

              <textarea
                id="observaciones"
                name="observaciones"
                rows={3}
                maxLength={1000}
                placeholder="Ingrese información adicional sobre el muelle..."
                value={
                  formulario.observaciones
                }
                onChange={
                  manejarCambio
                }
                readOnly={
                  soloLectura
                }
              />

            </div>


            {/* DATOS ASOCIADOS - SOLO VISTA */}

            {soloLectura && (

              <>

                <div className="form-field">

                  <label>
                    Operación asociada
                  </label>

                  <input
                    type="text"
                    value={
                      muelleCompleto?.operacion ||
                      "No asignada"
                    }
                    readOnly
                  />

                </div>


                <div className="form-field">

                  <label>
                    Buque asociado
                  </label>

                  <input
                    type="text"
                    value={
                      muelleCompleto?.buque ||
                      "No asignado"
                    }
                    readOnly
                  />

                </div>

              </>

            )}

          </div>


          {/* BOTONES */}

          <div className="form-actions">

            {soloLectura ? (

              <button
                type="button"
                className="button button-primary"
                onClick={() =>
                  navigate(
                    "/muelles"
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
                      "/muelles"
                    )
                  }
                  disabled={
                    guardando
                  }
                >
                  Cancelar
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
                      : modoEdicion
                        ? "Guardar cambios"
                        : "Registrar muelle"
                  }

                </button>

              </>

            )}

          </div>

        </form>


        {/* ==================================
            PREVISUALIZACIÓN
        ================================== */}

        <aside className="muelle-preview-column">

          <div className="glass-card muelle-preview-card">

            <div className="muelle-preview-heading">

              <div className="muelle-note-icon">

                <ShipWheel
                  size={21}
                />

              </div>


              <div>

                <h2>
                  {
                    soloLectura
                      ? "Resumen del muelle"
                      : "Vista previa"
                  }
                </h2>

                <p>
                  Información actual del recurso.
                </p>

              </div>

            </div>


            <div className="muelle-preview-main">

              <div className="muelle-preview-image">

                <Anchor
                  size={38}
                />

              </div>


              <div>

                <strong className="muelle-preview-code">
                  {
                    formulario.codigo ||
                    "M-00"
                  }
                </strong>


                <span className="muelle-preview-name">
                  {
                    formulario.nombre ||
                    "Nombre del muelle"
                  }
                </span>


                <span
                  className={`
                    status-pill
                    ${obtenerClaseEstado(
                      formulario.estado_operativo
                    )}
                  `}
                >

                  <span />

                  {
                    formulario.estado_operativo
                  }

                </span>

              </div>

            </div>


            <div className="muelle-preview-divider" />


            <div className="muelle-preview-details">


              <div>

                <Ruler size={18} />

                <span>
                  Longitud máxima
                </span>

                <strong>
                  {
                    formulario.longitud_maxima ||
                    "0"
                  } m
                </strong>

              </div>


              <div>

                <Waves size={18} />

                <span>
                  Calado máximo
                </span>

                <strong>
                  {
                    formulario.calado_maximo ||
                    "0"
                  } m
                </strong>

              </div>


              <div>

                <CheckCircle2
                  size={18}
                />

                <span>
                  Estado operativo
                </span>

                <strong>
                  {
                    formulario.estado_operativo
                  }
                </strong>

              </div>


              <div>

                <Package size={18} />

                <span>
                  Tipos permitidos
                </span>

                <strong>
                  {
                    nombresTiposSeleccionados
                      .length > 0
                      ? nombresTiposSeleccionados
                          .join(", ")
                      : "Sin seleccionar"
                  }
                </strong>

              </div>


              {soloLectura && (

                <div>

                  <Ship size={18} />

                  <span>
                    Operación
                  </span>

                  <strong>
                    {
                      muelleCompleto?.operacion ||
                      "Sin asignar"
                    }
                  </strong>

                </div>

              )}

            </div>

          </div>


          {/* NOTA */}

          <div className="glass-card muelle-form-note">

            <div className="muelle-note-icon">

              <Info size={19} />

            </div>


            <div>

              <h3>
                {
                  soloLectura
                    ? "Modo consulta"
                    : "Información"
                }
              </h3>


              <p>
                {
                  soloLectura
                    ? "Esta vista es únicamente de consulta. Los campos no pueden modificarse."
                    : "La compatibilidad física se evaluará automáticamente con la longitud y el calado. Los tipos de carga seleccionados se utilizarán para validar la compatibilidad de cada operación."
                }
              </p>

            </div>

          </div>

        </aside>

      </div>

    </section>
  );
}


export default MuelleFormPage;