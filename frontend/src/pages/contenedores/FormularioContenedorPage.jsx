import {
  ArrowLeft,
  Boxes,
  FileText,
  LoaderCircle,
  Package,
  Save,
  Ship,
  Weight,
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
  actualizarContenedor,
  obtenerContenedorPorId,
  obtenerOpcionesFormularioContenedor,
  registrarContenedor,
} from "../../services/contenedoresService.js";

import "../../styles/formularioContenedor.css";


const formularioInicial = {
  codigo: "",
  id_operacion: "",
  id_tipo_contenedor: "",
  id_tipo_carga: "",
  peso_kg: "",
  observaciones: "",
};


function FormularioContenedorPage() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();


  const esEdicion =
    Boolean(id);


  const [
    formulario,
    setFormulario,
  ] = useState(
    formularioInicial
  );


  const [
    operaciones,
    setOperaciones,
  ] = useState([]);


  const [
    tiposContenedor,
    setTiposContenedor,
  ] = useState([]);


  const [
    tiposCarga,
    setTiposCarga,
  ] = useState([]);


  const [
    codigoOperacion,
    setCodigoOperacion,
  ] = useState("");


  const [
    buqueOperacion,
    setBuqueOperacion,
  ] = useState("");


  const [
    errores,
    setErrores,
  ] = useState({});


  const [
    cargando,
    setCargando,
  ] = useState(true);


  const [
    enviando,
    setEnviando,
  ] = useState(false);


  const [
    errorGeneral,
    setErrorGeneral,
  ] = useState("");


  const [
    mensajeExito,
    setMensajeExito,
  ] = useState("");


  useEffect(() => {
    async function cargarPagina() {
      try {
        setCargando(true);

        setErrorGeneral("");


        const opciones =
          await obtenerOpcionesFormularioContenedor();


        setOperaciones(
          opciones.operaciones ||
          []
        );


        setTiposContenedor(
          opciones.tipos_contenedor ||
          []
        );


        setTiposCarga(
          opciones.tipos_carga ||
          []
        );


        if (esEdicion) {
          const contenedor =
            await obtenerContenedorPorId(
              id
            );


          if (
            contenedor.estado_operacion ===
            "Finalizada"
          ) {
            throw new Error(
              "No se puede editar un contenedor cuya operación está finalizada."
            );
          }


          setCodigoOperacion(
            contenedor.codigo_operacion ||
            ""
          );


          setBuqueOperacion(
            contenedor.buque ||
            ""
          );


          setFormulario({
            codigo:
              contenedor.codigo ||
              "",

            id_operacion:
              String(
                contenedor.id_operacion
              ),

            id_tipo_contenedor:
              String(
                contenedor.id_tipo_contenedor
              ),

            id_tipo_carga:
              String(
                contenedor.id_tipo_carga
              ),

            peso_kg:
              String(
                contenedor.peso_kg
              ),

            observaciones:
              contenedor.observaciones ||
              "",
          });
        }
      } catch (error) {
        setErrorGeneral(
          error.message
        );
      } finally {
        setCargando(false);
      }
    }


    cargarPagina();
  }, [
    esEdicion,
    id,
  ]);


  function manejarCambio(
    evento
  ) {
    const {
      name,
      value,
    } = evento.target;


    setFormulario(
      (
        formularioActual
      ) => ({
        ...formularioActual,

        [name]:
          name === "codigo"
            ? value.toUpperCase()
            : value,
      })
    );


    if (
      errores[name]
    ) {
      setErrores(
        (
          erroresActuales
        ) => ({
          ...erroresActuales,

          [name]:
            "",
        })
      );
    }


    setErrorGeneral("");
  }


  function validarFormulario() {
    const nuevosErrores = {};


    if (
      !formulario.codigo.trim()
    ) {
      nuevosErrores.codigo =
        "Ingrese el código del contenedor.";
    }


    if (
      !esEdicion &&
      !formulario.id_operacion
    ) {
      nuevosErrores.id_operacion =
        "Seleccione una operación.";
    }


    if (
      !formulario.id_tipo_contenedor
    ) {
      nuevosErrores.id_tipo_contenedor =
        "Seleccione el tipo de contenedor.";
    }


    if (
      !formulario.id_tipo_carga
    ) {
      nuevosErrores.id_tipo_carga =
        "Seleccione el tipo de carga.";
    }


    if (
      !formulario.peso_kg ||
      Number(
        formulario.peso_kg
      ) <= 0
    ) {
      nuevosErrores.peso_kg =
        "Ingrese un peso mayor que cero.";
    }


    setErrores(
      nuevosErrores
    );


    return (
      Object.keys(
        nuevosErrores
      ).length === 0
    );
  }


  function regresar() {
    if (esEdicion) {
      navigate(
        `/contenedores/${id}`
      );
    } else {
      navigate(
        "/contenedores"
      );
    }
  }


  async function manejarEnvio(
    evento
  ) {
    evento.preventDefault();


    if (
      !validarFormulario()
    ) {
      return;
    }


    try {
      setEnviando(true);

      setErrorGeneral("");

      setMensajeExito("");


      const datosContenedor = {
        codigo:
          formulario.codigo
            .trim()
            .toUpperCase(),

        id_tipo_contenedor:
          Number(
            formulario.id_tipo_contenedor
          ),

        id_tipo_carga:
          Number(
            formulario.id_tipo_carga
          ),

        peso_kg:
          Number(
            formulario.peso_kg
          ),

        observaciones:
          formulario.observaciones
            .trim() ||
          null,
      };


      let resultado;


      if (esEdicion) {
        resultado =
          await actualizarContenedor(
            id,
            datosContenedor
          );
      } else {
        resultado =
          await registrarContenedor({
            ...datosContenedor,

            id_operacion:
              Number(
                formulario.id_operacion
              ),
          });
      }


      setMensajeExito(
        resultado.mensaje
      );


      setTimeout(() => {
        if (esEdicion) {
          navigate(
            `/contenedores/${id}`
          );
        } else {
          navigate(
            "/contenedores"
          );
        }
      }, 700);
    } catch (error) {
      setErrorGeneral(
        error.message
      );
    } finally {
      setEnviando(false);
    }
  }


  if (cargando) {
    return (
      <section className="pagina-formulario-contenedor">

        <div className="mensaje-info-contenedor">

          <LoaderCircle
            size={18}
            className="icono-cargando-formulario-contenedor"
          />

          Cargando información...

        </div>

      </section>
    );
  }


  return (
    <section className="pagina-formulario-contenedor">

      <div className="encabezado-formulario-contenedor">

        <button
          type="button"
          className="boton-volver-contenedores"
          onClick={
            regresar
          }
        >
          <ArrowLeft size={18} />

          {esEdicion
            ? "Volver al detalle"
            : "Volver a Contenedores"}
        </button>


        <h1>
          {esEdicion
            ? "Editar contenedor"
            : "Registrar contenedor"}
        </h1>


        <p>
          {esEdicion
            ? "Actualice la información registrada para este contenedor."
            : "Agregue un contenedor a una operación portuaria activa."}
        </p>

      </div>


      <form
        className="glass-card formulario-contenedor"
        onSubmit={
          manejarEnvio
        }
        noValidate
      >

        <div className="encabezado-tarjeta-contenedor">

          <div className="icono-formulario-contenedor">
            <Boxes size={26} />
          </div>


          <div>

            <h2>
              Información del contenedor
            </h2>

            <p>
              Complete los datos asociados
              a la carga.
            </p>

          </div>

        </div>


        <div className="rejilla-formulario-contenedor">


          {/* CODIGO */}

          <div className="campo-formulario-contenedor">

            <label htmlFor="codigo">
              Código
              <span>*</span>
            </label>


            <div
              className={
                errores.codigo
                  ? "entrada-contenedor con-error"
                  : "entrada-contenedor"
              }
            >
              <Boxes size={18} />

              <input
                id="codigo"
                name="codigo"
                type="text"
                value={
                  formulario.codigo
                }
                onChange={
                  manejarCambio
                }
                placeholder="Ej. MSCU1234567"
              />

            </div>


            {errores.codigo && (
              <small className="error-campo-contenedor">
                {
                  errores.codigo
                }
              </small>
            )}

          </div>


          {/* OPERACION */}

          <div className="campo-formulario-contenedor">

            <label htmlFor="id_operacion">
              Operación
              {!esEdicion && (
                <span>*</span>
              )}
            </label>


            {esEdicion ? (

              <div className="entrada-contenedor entrada-bloqueada-contenedor">

                <Ship size={18} />

                <div className="operacion-bloqueada-contenedor">

                  <strong>
                    {codigoOperacion}
                  </strong>

                  <small>
                    {buqueOperacion}
                  </small>

                </div>

              </div>

            ) : (

              <div
                className={
                  errores.id_operacion
                    ? "entrada-contenedor con-error"
                    : "entrada-contenedor"
                }
              >
                <Ship size={18} />

                <select
                  id="id_operacion"
                  name="id_operacion"
                  value={
                    formulario.id_operacion
                  }
                  onChange={
                    manejarCambio
                  }
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
                        {operacion.codigo}
                        {" · "}
                        {operacion.buque}
                        {" · "}
                        {operacion.estado}
                      </option>
                    )
                  )}

                </select>

              </div>

            )}


            {errores.id_operacion && (
              <small className="error-campo-contenedor">
                {
                  errores.id_operacion
                }
              </small>
            )}


            {esEdicion && (
              <small className="ayuda-campo-contenedor">
                La operación asociada no puede modificarse.
              </small>
            )}

          </div>


          {/* TIPO CONTENEDOR */}

          <div className="campo-formulario-contenedor">

            <label htmlFor="id_tipo_contenedor">
              Tipo de contenedor
              <span>*</span>
            </label>


            <div
              className={
                errores.id_tipo_contenedor
                  ? "entrada-contenedor con-error"
                  : "entrada-contenedor"
              }
            >
              <Package size={18} />

              <select
                id="id_tipo_contenedor"
                name="id_tipo_contenedor"
                value={
                  formulario.id_tipo_contenedor
                }
                onChange={
                  manejarCambio
                }
              >
                <option value="">
                  Seleccionar tipo
                </option>

                {tiposContenedor.map(
                  (tipo) => (
                    <option
                      key={
                        tipo.id_tipo_contenedor
                      }
                      value={
                        tipo.id_tipo_contenedor
                      }
                    >
                      {tipo.nombre}
                    </option>
                  )
                )}

              </select>

            </div>


            {errores.id_tipo_contenedor && (
              <small className="error-campo-contenedor">
                {
                  errores.id_tipo_contenedor
                }
              </small>
            )}

          </div>


          {/* TIPO CARGA */}

          <div className="campo-formulario-contenedor">

            <label htmlFor="id_tipo_carga">
              Tipo de carga
              <span>*</span>
            </label>


            <div
              className={
                errores.id_tipo_carga
                  ? "entrada-contenedor con-error"
                  : "entrada-contenedor"
              }
            >
              <Package size={18} />

              <select
                id="id_tipo_carga"
                name="id_tipo_carga"
                value={
                  formulario.id_tipo_carga
                }
                onChange={
                  manejarCambio
                }
              >
                <option value="">
                  Seleccionar tipo de carga
                </option>

                {tiposCarga.map(
                  (tipo) => (
                    <option
                      key={
                        tipo.id_tipo_carga
                      }
                      value={
                        tipo.id_tipo_carga
                      }
                    >
                      {tipo.nombre}
                    </option>
                  )
                )}

              </select>

            </div>


            {errores.id_tipo_carga && (
              <small className="error-campo-contenedor">
                {
                  errores.id_tipo_carga
                }
              </small>
            )}

          </div>


          {/* PESO */}

          <div className="campo-formulario-contenedor">

            <label htmlFor="peso_kg">
              Peso
              <span>*</span>
            </label>


            <div
              className={
                errores.peso_kg
                  ? "entrada-contenedor con-error"
                  : "entrada-contenedor"
              }
            >
              <Weight size={18} />

              <input
                id="peso_kg"
                name="peso_kg"
                type="number"
                min="0.01"
                step="0.01"
                value={
                  formulario.peso_kg
                }
                onChange={
                  manejarCambio
                }
                placeholder="Peso en kg"
              />

              <span className="unidad-contenedor">
                kg
              </span>

            </div>


            {errores.peso_kg && (
              <small className="error-campo-contenedor">
                {
                  errores.peso_kg
                }
              </small>
            )}

          </div>

        </div>


        <div className="separador-formulario-contenedor" />


        {/* OBSERVACIONES */}

        <div className="campo-formulario-contenedor">

          <label htmlFor="observaciones">
            Observaciones

            <small>
              Opcional
            </small>
          </label>


          <div className="contenedor-textarea">

            <FileText size={18} />

            <textarea
              id="observaciones"
              name="observaciones"
              value={
                formulario.observaciones
              }
              onChange={
                manejarCambio
              }
              placeholder="Ingrese información adicional..."
              rows={4}
            />

          </div>

        </div>


        {errorGeneral && (
          <div className="mensaje-error-formulario-contenedor">
            {errorGeneral}
          </div>
        )}


        {mensajeExito && (
          <div className="mensaje-exito-formulario-contenedor">
            {mensajeExito}
          </div>
        )}


        <div className="acciones-formulario-contenedor">

          <button
            type="button"
            className="boton-cancelar-contenedor"
            onClick={
              regresar
            }
            disabled={
              enviando
            }
          >
            Cancelar
          </button>


          <button
            type="submit"
            className="boton-guardar-contenedor"
            disabled={
              enviando
            }
          >

            {enviando ? (
              <>
                <LoaderCircle
                  size={18}
                  className="icono-cargando-formulario-contenedor"
                />

                Guardando...
              </>
            ) : (
              <>
                <Save size={18} />

                {esEdicion
                  ? "Guardar cambios"
                  : "Registrar contenedor"}
              </>
            )}

          </button>

        </div>

      </form>

    </section>
  );
}


export default FormularioContenedorPage;