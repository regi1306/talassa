import {
  ArrowLeft,
  Building2,
  Flag,
  LoaderCircle,
  Ruler,
  Save,
  Ship,
  Tag,
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
  actualizarBuque,
  obtenerBuquePorId,
  obtenerOpcionesFormularioBuque,
  registrarBuque,
} from "../../services/buquesService.js";

import "../../styles/formularioBuque.css";


const formularioInicial = {
  nombre: "",
  identificacion: "",
  id_empresa: "",
  id_tipo_buque: "",
  bandera: "",
  eslora_m: "",
  manga_m: "",
  calado_m: "",
};


function FormularioBuquePage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const esEdicion =
    Boolean(id);


  const [
    formulario,
    setFormulario,
  ] = useState(formularioInicial);


  const [
    errores,
    setErrores,
  ] = useState({});


  const [
    empresas,
    setEmpresas,
  ] = useState([]);


  const [
    tiposBuque,
    setTiposBuque,
  ] = useState([]);


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


  useEffect(() => {
    async function cargarPagina() {
      try {
        setCargandoPagina(true);

        setErrorGeneral("");


        const opciones =
          await obtenerOpcionesFormularioBuque();


        setEmpresas(
          opciones.empresas || []
        );

        setTiposBuque(
          opciones.tipos_buque || []
        );


        if (esEdicion) {
          const resultado =
            await obtenerBuquePorId(id);

          const buque =
            resultado.buque;


          setFormulario({
            nombre:
              buque.nombre || "",

            identificacion:
              buque.identificacion || "",

            id_empresa:
              String(
                buque.id_empresa
              ),

            id_tipo_buque:
              String(
                buque.id_tipo_buque
              ),

            bandera:
              buque.bandera || "",

            eslora_m:
              buque.eslora_m ?? "",

            manga_m:
              buque.manga_m ?? "",

            calado_m:
              buque.calado_m ?? "",
          });
        }
      } catch (error) {
        setErrorGeneral(
          error.message
        );
      } finally {
        setCargandoPagina(false);
      }
    }


    cargarPagina();
  }, [
    esEdicion,
    id,
  ]);


  function manejarCambio(evento) {
    const {
      name,
      value,
    } = evento.target;


    setFormulario(
      (formularioActual) => ({
        ...formularioActual,
        [name]: value,
      })
    );


    if (errores[name]) {
      setErrores(
        (erroresActuales) => ({
          ...erroresActuales,
          [name]: "",
        })
      );
    }


    if (errorGeneral) {
      setErrorGeneral("");
    }
  }


  function validarFormulario() {
    const nuevosErrores = {};


    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre =
        "Ingrese el nombre del buque.";
    }


    if (
      !formulario.identificacion.trim()
    ) {
      nuevosErrores.identificacion =
        "Ingrese la identificación.";
    }


    if (!formulario.id_empresa) {
      nuevosErrores.id_empresa =
        "Seleccione una empresa.";
    }


    if (!formulario.id_tipo_buque) {
      nuevosErrores.id_tipo_buque =
        "Seleccione un tipo de buque.";
    }


    const eslora =
      Number(formulario.eslora_m);

    if (
      !formulario.eslora_m ||
      !Number.isFinite(eslora) ||
      eslora <= 0
    ) {
      nuevosErrores.eslora_m =
        "Ingrese una eslora mayor que 0.";
    }


    if (formulario.manga_m) {
      const manga =
        Number(formulario.manga_m);

      if (
        !Number.isFinite(manga) ||
        manga <= 0
      ) {
        nuevosErrores.manga_m =
          "La manga debe ser mayor que 0.";
      }
    }


    const calado =
      Number(formulario.calado_m);

    if (
      !formulario.calado_m ||
      !Number.isFinite(calado) ||
      calado <= 0
    ) {
      nuevosErrores.calado_m =
        "Ingrese un calado mayor que 0.";
    }


    setErrores(nuevosErrores);


    return (
      Object.keys(
        nuevosErrores
      ).length === 0
    );
  }


  function regresar() {
    if (esEdicion) {
      navigate(
        `/buques/${id}`
      );
    } else {
      navigate("/buques");
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


      const datosBuque = {
        nombre:
          formulario.nombre.trim(),

        identificacion:
          formulario.identificacion.trim(),

        id_empresa:
          Number(
            formulario.id_empresa
          ),

        id_tipo_buque:
          Number(
            formulario.id_tipo_buque
          ),

        bandera:
          formulario.bandera.trim() ||
          null,

        eslora_m:
          Number(
            formulario.eslora_m
          ),

        manga_m:
          formulario.manga_m
            ? Number(
                formulario.manga_m
              )
            : null,

        calado_m:
          Number(
            formulario.calado_m
          ),
      };


      let resultado;


      if (esEdicion) {
        resultado =
          await actualizarBuque(
            id,
            datosBuque
          );
      } else {
        resultado =
          await registrarBuque(
            datosBuque
          );
      }


      setMensajeExito(
        resultado.mensaje
      );


      setTimeout(() => {
        if (esEdicion) {
          navigate(
            `/buques/${id}`
          );
        } else {
          navigate("/buques");
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


  if (
    cargandoPagina &&
    esEdicion
  ) {
    return (
      <section className="pagina-formulario-buque">

        <div className="mensaje-informativo-formulario">
          <LoaderCircle
            size={18}
            className="icono-girando"
          />

          Cargando información del buque...
        </div>

      </section>
    );
  }


  return (
    <section className="pagina-formulario-buque">

      <div className="encabezado-formulario-buque">

        <button
          type="button"
          className="boton-volver-buques"
          onClick={regresar}
        >
          <ArrowLeft size={18} />

          {esEdicion
            ? "Volver al detalle"
            : "Volver a Buques"}
        </button>


        <div>
          <h1>
            {esEdicion
              ? "Editar buque"
              : "Registrar nuevo buque"}
          </h1>

          <p>
            {esEdicion
              ? "Actualice la información general y las características físicas de la embarcación."
              : "Ingrese la información general y las características físicas de la embarcación."}
          </p>
        </div>

      </div>


      <form
        className="glass-card formulario-buque"
        onSubmit={manejarEnvio}
        noValidate
      >

        <section className="seccion-formulario-buque">

          <div className="titulo-seccion-buque">

            <div className="icono-seccion-buque">
              <Ship size={21} />
            </div>

            <div>
              <h2>
                Información general
              </h2>

              <p>
                Datos de identificación
                de la embarcación.
              </p>
            </div>

          </div>


          <div className="rejilla-formulario-buque">


            <div className="campo-formulario-buque">

              <label htmlFor="nombre">
                Nombre del buque
                <span>*</span>
              </label>

              <div
                className={
                  errores.nombre
                    ? "entrada-buque con-error"
                    : "entrada-buque"
                }
              >
                <Ship size={18} />

                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  placeholder="Ej. Ocean Star"
                  maxLength={150}
                />
              </div>

              {errores.nombre && (
                <small className="mensaje-error-campo">
                  {errores.nombre}
                </small>
              )}

            </div>


            <div className="campo-formulario-buque">

              <label htmlFor="identificacion">
                Identificación
                <span>*</span>
              </label>

              <div
                className={
                  errores.identificacion
                    ? "entrada-buque con-error"
                    : "entrada-buque"
                }
              >
                <Tag size={18} />

                <input
                  id="identificacion"
                  name="identificacion"
                  type="text"
                  value={
                    formulario.identificacion
                  }
                  onChange={manejarCambio}
                  placeholder="Ej. IMO9876543"
                  maxLength={50}
                />
              </div>

              {errores.identificacion && (
                <small className="mensaje-error-campo">
                  {errores.identificacion}
                </small>
              )}

            </div>


            <div className="campo-formulario-buque">

              <label htmlFor="id_empresa">
                Empresa
                <span>*</span>
              </label>

              <div
                className={
                  errores.id_empresa
                    ? "entrada-buque con-error"
                    : "entrada-buque"
                }
              >
                <Building2 size={18} />

                <select
                  id="id_empresa"
                  name="id_empresa"
                  value={
                    formulario.id_empresa
                  }
                  onChange={manejarCambio}
                  disabled={cargandoPagina}
                >
                  <option value="">
                    Seleccionar empresa
                  </option>

                  {empresas.map(
                    (empresa) => (
                      <option
                        key={
                          empresa.id_empresa
                        }
                        value={
                          empresa.id_empresa
                        }
                      >
                        {empresa.nombre}
                      </option>
                    )
                  )}

                </select>
              </div>

              {errores.id_empresa && (
                <small className="mensaje-error-campo">
                  {errores.id_empresa}
                </small>
              )}

            </div>


            <div className="campo-formulario-buque">

              <label htmlFor="id_tipo_buque">
                Tipo de buque
                <span>*</span>
              </label>

              <div
                className={
                  errores.id_tipo_buque
                    ? "entrada-buque con-error"
                    : "entrada-buque"
                }
              >
                <Ship size={18} />

                <select
                  id="id_tipo_buque"
                  name="id_tipo_buque"
                  value={
                    formulario.id_tipo_buque
                  }
                  onChange={manejarCambio}
                  disabled={cargandoPagina}
                >
                  <option value="">
                    Seleccionar tipo
                  </option>

                  {tiposBuque.map(
                    (tipo) => (
                      <option
                        key={
                          tipo.id_tipo_buque
                        }
                        value={
                          tipo.id_tipo_buque
                        }
                      >
                        {tipo.nombre}
                      </option>
                    )
                  )}

                </select>
              </div>

              {errores.id_tipo_buque && (
                <small className="mensaje-error-campo">
                  {errores.id_tipo_buque}
                </small>
              )}

            </div>


            <div className="campo-formulario-buque campo-ancho-completo">

              <label htmlFor="bandera">
                Bandera
              </label>

              <div className="entrada-buque">
                <Flag size={18} />

                <input
                  id="bandera"
                  name="bandera"
                  type="text"
                  value={
                    formulario.bandera
                  }
                  onChange={manejarCambio}
                  placeholder="Ej. Panamá"
                  maxLength={80}
                />
              </div>

            </div>

          </div>

        </section>


        <div className="separador-formulario-buque" />


        <section className="seccion-formulario-buque">

          <div className="titulo-seccion-buque">

            <div className="icono-seccion-buque">
              <Ruler size={21} />
            </div>

            <div>
              <h2>
                Características físicas
              </h2>

              <p>
                Dimensiones utilizadas para
                validar compatibilidad con
                muelles.
              </p>
            </div>

          </div>


          <div className="rejilla-medidas-buque">


            <div className="campo-formulario-buque">

              <label htmlFor="eslora_m">
                Eslora
                <span>*</span>
              </label>

              <div
                className={
                  errores.eslora_m
                    ? "entrada-buque con-error"
                    : "entrada-buque"
                }
              >
                <input
                  id="eslora_m"
                  name="eslora_m"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={
                    formulario.eslora_m
                  }
                  onChange={manejarCambio}
                  placeholder="294.50"
                />

                <strong>m</strong>
              </div>

              {errores.eslora_m && (
                <small className="mensaje-error-campo">
                  {errores.eslora_m}
                </small>
              )}

            </div>


            <div className="campo-formulario-buque">

              <label htmlFor="manga_m">
                Manga

                <small>
                  Opcional
                </small>
              </label>

              <div
                className={
                  errores.manga_m
                    ? "entrada-buque con-error"
                    : "entrada-buque"
                }
              >
                <input
                  id="manga_m"
                  name="manga_m"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={
                    formulario.manga_m
                  }
                  onChange={manejarCambio}
                  placeholder="32.20"
                />

                <strong>m</strong>
              </div>

              {errores.manga_m && (
                <small className="mensaje-error-campo">
                  {errores.manga_m}
                </small>
              )}

            </div>


            <div className="campo-formulario-buque">

              <label htmlFor="calado_m">
                Calado
                <span>*</span>
              </label>

              <div
                className={
                  errores.calado_m
                    ? "entrada-buque con-error"
                    : "entrada-buque"
                }
              >
                <input
                  id="calado_m"
                  name="calado_m"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={
                    formulario.calado_m
                  }
                  onChange={manejarCambio}
                  placeholder="12.50"
                />

                <strong>m</strong>
              </div>

              {errores.calado_m && (
                <small className="mensaje-error-campo">
                  {errores.calado_m}
                </small>
              )}

            </div>

          </div>

        </section>


        {errorGeneral && (
          <div className="mensaje-error-formulario">
            {errorGeneral}
          </div>
        )}


        {mensajeExito && (
          <div className="mensaje-exito-formulario">
            {mensajeExito}
          </div>
        )}


        <div className="acciones-formulario-buque">

          <button
            type="button"
            className="boton-cancelar-buque"
            onClick={regresar}
            disabled={enviando}
          >
            Cancelar
          </button>


          <button
            type="submit"
            className="boton-guardar-buque"
            disabled={
              enviando ||
              cargandoPagina
            }
          >

            {enviando ? (
              <>
                <LoaderCircle
                  size={18}
                  className="icono-girando"
                />

                {esEdicion
                  ? "Guardando..."
                  : "Registrando..."}
              </>
            ) : (
              <>
                <Save size={18} />

                {esEdicion
                  ? "Guardar cambios"
                  : "Registrar buque"}
              </>
            )}

          </button>

        </div>

      </form>

    </section>
  );
}


export default FormularioBuquePage;