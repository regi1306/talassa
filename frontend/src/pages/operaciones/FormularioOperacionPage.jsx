import {
  ArrowLeft,
  CalendarClock,
  FileText,
  LoaderCircle,
  MapPin,
  Package,
  Save,
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
  actualizarOperacion,
  obtenerOperacionPorId,
  obtenerOpcionesFormularioOperacion,
  registrarOperacion,
} from "../../services/operacionesService.js";

import "../../styles/formularioOperacion.css";


const formularioInicial = {
  id_buque: "",
  id_tipo_carga: "",
  procedencia: "",
  destino: "",
  llegada_estimada: "",
  salida_estimada: "",
  observaciones: "",
};


function FormularioOperacionPage() {
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
    errores,
    setErrores,
  ] = useState({});


  const [
    buques,
    setBuques,
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
    cargandoPagina,
    setCargandoPagina,
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


  function convertirFechaParaInput(
    fecha
  ) {
    if (!fecha) {
      return "";
    }


    const fechaOriginal =
      new Date(fecha);


    const ajusteZonaHoraria =
      fechaOriginal.getTimezoneOffset() *
      60000;


    return new Date(
      fechaOriginal.getTime() -
      ajusteZonaHoraria
    )
      .toISOString()
      .slice(0, 16);
  }

  useEffect(() => {
  async function cargarPagina() {
    try {
      setCargandoPagina(true);
      setErrorGeneral("");

      const opciones =
        await obtenerOpcionesFormularioOperacion();

      setBuques(
        opciones?.buques || []
      );

      setTiposCarga(
        opciones?.tipos_carga || []
      );

      if (id) {
        const operacion =
          await obtenerOperacionPorId(id);

        console.log(
          "Operación cargada para editar:",
          operacion
        );

        if (!operacion) {
          throw new Error(
            "No fue posible cargar la información de la operación."
          );
        }

        if (
          operacion.estado ===
          "Finalizada"
        ) {
          throw new Error(
            "Una operación finalizada no puede ser editada."
          );
        }

        setCodigoOperacion(
          operacion.codigo || ""
        );

        setFormulario({
          id_buque:
            operacion.id_buque != null
              ? String(
                  operacion.id_buque
                )
              : "",

          id_tipo_carga:
            operacion.id_tipo_carga != null
              ? String(
                  operacion.id_tipo_carga
                )
              : "",

          procedencia:
            operacion.procedencia ||
            "",

          destino:
            operacion.destino ||
            "",

          llegada_estimada:
            convertirFechaParaInput(
              operacion.llegada_estimada
            ),

          salida_estimada:
            convertirFechaParaInput(
              operacion.salida_estimada
            ),

          observaciones:
            operacion.observaciones ||
            "",
        });
      }
    } catch (error) {
      console.error(
        "Error al cargar formulario:",
        error
      );

      setErrorGeneral(
        error.message
      );
    } finally {
      setCargandoPagina(false);
    }
  }

  cargarPagina();
}, [id]);


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
          value,
      })
    );


    if (errores[name]) {
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


    if (errorGeneral) {
      setErrorGeneral("");
    }
  }


  function validarFormulario() {
    const nuevosErrores = {};


    if (!formulario.id_buque) {
      nuevosErrores.id_buque =
        "Seleccione un buque.";
    }


    if (
      !formulario.id_tipo_carga
    ) {
      nuevosErrores.id_tipo_carga =
        "Seleccione un tipo de carga.";
    }


    if (
      !formulario.procedencia.trim()
    ) {
      nuevosErrores.procedencia =
        "Ingrese la procedencia.";
    }


    if (
      !formulario.destino.trim()
    ) {
      nuevosErrores.destino =
        "Ingrese el destino.";
    }


    if (
      !formulario.llegada_estimada
    ) {
      nuevosErrores.llegada_estimada =
        "Ingrese la llegada estimada.";
    }


    if (
      !formulario.salida_estimada
    ) {
      nuevosErrores.salida_estimada =
        "Ingrese la salida estimada.";
    }


    if (
      formulario.llegada_estimada &&
      formulario.salida_estimada
    ) {
      const llegada =
        new Date(
          formulario.llegada_estimada
        );


      const salida =
        new Date(
          formulario.salida_estimada
        );


      if (
        salida <= llegada
      ) {
        nuevosErrores.salida_estimada =
          "La salida debe ser posterior a la llegada.";
      }
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
        `/operaciones/${id}`
      );
    } else {
      navigate(
        "/operaciones"
      );
    }
  }


  async function manejarEnvio(
    evento
  ) {
    evento.preventDefault();


    if (!validarFormulario()) {
      return;
    }


    try {
      setEnviando(true);

      setErrorGeneral("");

      setMensajeExito("");


      const datosOperacion = {
        id_buque:
          Number(
            formulario.id_buque
          ),

        id_tipo_carga:
          Number(
            formulario.id_tipo_carga
          ),

        procedencia:
          formulario.procedencia.trim(),

        destino:
          formulario.destino.trim(),

        llegada_estimada:
          new Date(
            formulario.llegada_estimada
          ).toISOString(),

        salida_estimada:
          new Date(
            formulario.salida_estimada
          ).toISOString(),

        observaciones:
          formulario.observaciones
            .trim() ||
          null,
      };


      let resultado;


      if (esEdicion) {
        resultado =
          await actualizarOperacion(
            id,
            datosOperacion
          );
      } else {
        resultado =
          await registrarOperacion(
            datosOperacion
          );
      }


      setMensajeExito(
        resultado.mensaje
      );


      setTimeout(() => {
        if (esEdicion) {
          navigate(
            `/operaciones/${id}`
          );
        } else {
          navigate(
            "/operaciones"
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


  if (cargandoPagina) {
    return (
      <section className="pagina-formulario-operacion">

        <div className="mensaje-informativo-operacion">

          <LoaderCircle
            size={18}
            className="icono-girando-operacion"
          />

          Cargando información
          de la operación...

        </div>

      </section>
    );
  }


  return (
    <section className="pagina-formulario-operacion">

      <div className="encabezado-formulario-operacion">

        <button
          type="button"
          className="boton-volver-operaciones"
          onClick={
            regresar
          }
        >
          <ArrowLeft size={18} />

          {esEdicion
            ? "Volver al detalle"
            : "Volver a Operaciones"}
        </button>


        <div>

          <h1>
            {esEdicion
              ? "Editar operación"
              : "Nueva operación"}
          </h1>


          <p>
            {esEdicion
              ? "Actualice la información programada de la visita portuaria."
              : "Programe una visita portuaria indicando el buque, tipo de carga, ruta y fechas estimadas."}
          </p>

        </div>

      </div>


      <form
        className="glass-card formulario-operacion"
        onSubmit={
          manejarEnvio
        }
        noValidate
      >

        <div className="codigo-automatico-operacion">

          <div>
            <CalendarClock
              size={20}
            />
          </div>


          <div>

            <span>
              Código de operación
            </span>


            <strong>
              {esEdicion
                ? codigoOperacion
                : "Generado automáticamente"}
            </strong>


            <small>
              {esEdicion
                ? "El código de la operación no puede modificarse."
                : "TALASSA asignará un código único al guardar la operación."}
            </small>

          </div>

        </div>


        <section className="seccion-formulario-operacion">

          <div className="titulo-seccion-operacion">

            <div className="icono-seccion-operacion">
              <Ship size={21} />
            </div>


            <div>

              <h2>
                Información de la operación
              </h2>

              <p>
                Datos principales de la
                visita portuaria.
              </p>

            </div>

          </div>


          <div className="rejilla-formulario-operacion">


            <div className="campo-formulario-operacion">

              <label htmlFor="id_buque">
                Buque
                <span>*</span>
              </label>


              <div
                className={
                  errores.id_buque
                    ? "entrada-operacion con-error"
                    : "entrada-operacion"
                }
              >

                <Ship size={18} />


                <select
                  id="id_buque"
                  name="id_buque"
                  value={
                    formulario.id_buque
                  }
                  onChange={
                    manejarCambio
                  }
                >

                  <option value="">
                    Seleccionar buque
                  </option>


                  {buques.map(
                    (buque) => (
                      <option
                        key={
                          buque.id_buque
                        }
                        value={
                          buque.id_buque
                        }
                      >
                        {buque.nombre}
                        {" · "}
                        {buque.identificacion}
                      </option>
                    )
                  )}

                </select>

              </div>


              {errores.id_buque && (
                <small className="mensaje-error-campo">
                  {
                    errores.id_buque
                  }
                </small>
              )}

            </div>


            <div className="campo-formulario-operacion">

              <label htmlFor="id_tipo_carga">
                Tipo de carga
                <span>*</span>
              </label>


              <div
                className={
                  errores.id_tipo_carga
                    ? "entrada-operacion con-error"
                    : "entrada-operacion"
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
                <small className="mensaje-error-campo">
                  {
                    errores.id_tipo_carga
                  }
                </small>
              )}

            </div>

          </div>

        </section>


        <div className="separador-formulario-operacion" />


        <section className="seccion-formulario-operacion">

          <div className="titulo-seccion-operacion">

            <div className="icono-seccion-operacion">
              <MapPin size={21} />
            </div>


            <div>

              <h2>
                Ruta
              </h2>

              <p>
                Procedencia y destino
                declarados para la operación.
              </p>

            </div>

          </div>


          <div className="rejilla-formulario-operacion">


            <div className="campo-formulario-operacion">

              <label htmlFor="procedencia">
                Procedencia
                <span>*</span>
              </label>


              <div
                className={
                  errores.procedencia
                    ? "entrada-operacion con-error"
                    : "entrada-operacion"
                }
              >

                <MapPin size={18} />


                <input
                  id="procedencia"
                  name="procedencia"
                  type="text"
                  value={
                    formulario.procedencia
                  }
                  onChange={
                    manejarCambio
                  }
                  placeholder="Ej. Puerto de Balboa, Panamá"
                  maxLength={150}
                />

              </div>


              {errores.procedencia && (
                <small className="mensaje-error-campo">
                  {
                    errores.procedencia
                  }
                </small>
              )}

            </div>


            <div className="campo-formulario-operacion">

              <label htmlFor="destino">
                Destino
                <span>*</span>
              </label>


              <div
                className={
                  errores.destino
                    ? "entrada-operacion con-error"
                    : "entrada-operacion"
                }
              >

                <MapPin size={18} />


                <input
                  id="destino"
                  name="destino"
                  type="text"
                  value={
                    formulario.destino
                  }
                  onChange={
                    manejarCambio
                  }
                  placeholder="Ej. Puerto de Acajutla, El Salvador"
                  maxLength={150}
                />

              </div>


              {errores.destino && (
                <small className="mensaje-error-campo">
                  {
                    errores.destino
                  }
                </small>
              )}

            </div>

          </div>

        </section>


        <div className="separador-formulario-operacion" />


        <section className="seccion-formulario-operacion">

          <div className="titulo-seccion-operacion">

            <div className="icono-seccion-operacion">
              <CalendarClock
                size={21}
              />
            </div>


            <div>

              <h2>
                Programación
              </h2>

              <p>
                Fechas estimadas de llegada
                y salida de la embarcación.
              </p>

            </div>

          </div>


          <div className="rejilla-formulario-operacion">


            <div className="campo-formulario-operacion">

              <label htmlFor="llegada_estimada">
                Llegada estimada
                <span>*</span>
              </label>


              <div
                className={
                  errores.llegada_estimada
                    ? "entrada-operacion con-error"
                    : "entrada-operacion"
                }
              >

                <CalendarClock
                  size={18}
                />


                <input
                  id="llegada_estimada"
                  name="llegada_estimada"
                  type="datetime-local"
                  value={
                    formulario.llegada_estimada
                  }
                  onChange={
                    manejarCambio
                  }
                />

              </div>


              {errores.llegada_estimada && (
                <small className="mensaje-error-campo">
                  {
                    errores.llegada_estimada
                  }
                </small>
              )}

            </div>


            <div className="campo-formulario-operacion">

              <label htmlFor="salida_estimada">
                Salida estimada
                <span>*</span>
              </label>


              <div
                className={
                  errores.salida_estimada
                    ? "entrada-operacion con-error"
                    : "entrada-operacion"
                }
              >

                <CalendarClock
                  size={18}
                />


                <input
                  id="salida_estimada"
                  name="salida_estimada"
                  type="datetime-local"
                  value={
                    formulario.salida_estimada
                  }
                  onChange={
                    manejarCambio
                  }
                />

              </div>


              {errores.salida_estimada && (
                <small className="mensaje-error-campo">
                  {
                    errores.salida_estimada
                  }
                </small>
              )}

            </div>

          </div>

        </section>


        <div className="separador-formulario-operacion" />


        <section className="seccion-formulario-operacion">

          <div className="titulo-seccion-operacion">

            <div className="icono-seccion-operacion">
              <FileText size={21} />
            </div>


            <div>

              <h2>
                Observaciones
              </h2>

              <p>
                Información adicional
                relacionada con la operación.
              </p>

            </div>

          </div>


          <div className="campo-formulario-operacion">

            <label htmlFor="observaciones">
              Observaciones

              <small>
                Opcional
              </small>
            </label>


            <textarea
              id="observaciones"
              name="observaciones"
              className="textarea-operacion"
              value={
                formulario.observaciones
              }
              onChange={
                manejarCambio
              }
              placeholder="Ingrese información adicional si es necesario..."
              rows={4}
            />

          </div>

        </section>


        {errorGeneral && (
          <div className="mensaje-error-operacion-formulario">
            {errorGeneral}
          </div>
        )}


        {mensajeExito && (
          <div className="mensaje-exito-operacion">
            {mensajeExito}
          </div>
        )}


        <div className="acciones-formulario-operacion">

          <button
            type="button"
            className="boton-cancelar-operacion"
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
            className="boton-guardar-operacion"
            disabled={
              enviando
            }
          >

            {enviando ? (
              <>
                <LoaderCircle
                  size={18}
                  className="icono-girando-operacion"
                />

                {esEdicion
                  ? "Guardando..."
                  : "Programando..."}
              </>
            ) : (
              <>
                <Save size={18} />

                {esEdicion
                  ? "Guardar cambios"
                  : "Programar operación"}
              </>
            )}

          </button>

        </div>

      </form>

    </section>
  );
}


export default FormularioOperacionPage;