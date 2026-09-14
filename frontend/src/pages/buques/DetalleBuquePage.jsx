import {
  Anchor,
  ArrowLeft,
  Building2,
  CalendarDays,
  Edit3,
  Flag,
  LoaderCircle,
  MapPin,
  Package,
  Power,
  RefreshCw,
  Ruler,
  Ship,
  Tag,
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
  cambiarEstadoBuque,
  obtenerBuquePorId,
} from "../../services/buquesService.js";

import "../../styles/detalleBuque.css";


function DetalleBuquePage() {
  const navigate = useNavigate();

  const { id } = useParams();


  const [
    buque,
    setBuque,
  ] = useState(null);


  const [
    operaciones,
    setOperaciones,
  ] = useState([]);


  const [
    cargando,
    setCargando,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    mostrarModalEstado,
    setMostrarModalEstado,
  ] = useState(false);


  const [
    cambiandoEstado,
    setCambiandoEstado,
  ] = useState(false);


  const [
    errorEstado,
    setErrorEstado,
  ] = useState("");


  useEffect(() => {
    async function cargarDetalle() {
      try {
        setCargando(true);

        setError("");

        const resultado =
          await obtenerBuquePorId(id);

        setBuque(
          resultado.buque
        );

        setOperaciones(
          resultado.operaciones || []
        );
      } catch (error) {
        setError(
          error.message
        );
      } finally {
        setCargando(false);
      }
    }


    cargarDetalle();
  }, [id]);


  function formatearMedida(valor) {
    if (
      valor === null ||
      valor === undefined ||
      valor === ""
    ) {
      return "No registrada";
    }

    return `${Number(valor).toFixed(2)} m`;
  }


  function formatearFecha(fecha) {
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


  function formatearFechaHora(fecha) {
    if (!fecha) {
      return "—";
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


  async function confirmarCambioEstado() {
    try {
      setCambiandoEstado(true);

      setErrorEstado("");


      const buqueActualizado =
        await cambiarEstadoBuque(
          buque.id_buque,
          !buque.activo
        );


      setBuque(
        buqueActualizado
      );


      setMostrarModalEstado(false);
    } catch (error) {
      setErrorEstado(
        error.message
      );
    } finally {
      setCambiandoEstado(false);
    }
  }


  if (cargando) {
    return (
      <section className="pagina-detalle-buque">

        <div className="cargando-detalle-buque">

          <RefreshCw
            size={27}
            className="icono-cargando-detalle"
          />

          <span>
            Cargando información del buque...
          </span>

        </div>

      </section>
    );
  }


  if (error || !buque) {
    return (
      <section className="pagina-detalle-buque">

        <button
          type="button"
          className="boton-volver-detalle"
          onClick={() =>
            navigate("/buques")
          }
        >
          <ArrowLeft size={18} />

          Volver a Buques
        </button>


        <div className="error-detalle-buque">

          <Ship size={34} />

          <h2>
            No fue posible mostrar el buque
          </h2>

          <p>
            {error ||
              "La información solicitada no está disponible."}
          </p>

        </div>

      </section>
    );
  }


  return (
    <section className="pagina-detalle-buque">

      {/* VOLVER */}

      <button
        type="button"
        className="boton-volver-detalle"
        onClick={() =>
          navigate("/buques")
        }
      >
        <ArrowLeft size={18} />

        Volver a Buques
      </button>


      {/* ENCABEZADO */}

      <div className="encabezado-detalle-buque">

        <div className="identidad-detalle-buque">

          <div className="icono-principal-buque">
            <Ship size={31} />
          </div>


          <div>

            <div className="titulo-estado-buque">

              <h1>
                {buque.nombre}
              </h1>


              <span
                className={
                  buque.activo
                    ? "estado-detalle-buque activo"
                    : "estado-detalle-buque inactivo"
                }
              >
                <i />

                {buque.activo
                  ? "Activo"
                  : "Inactivo"}
              </span>

            </div>


            <p>
              {buque.identificacion}
              {" · "}
              {buque.tipo_buque}
            </p>

          </div>

        </div>


        <div className="acciones-encabezado-detalle">

          <button
            type="button"
            className="boton-editar-detalle"
            onClick={() =>
              navigate(
                `/buques/${buque.id_buque}/editar`
              )
            }
          >
            <Edit3 size={18} />

            Editar buque
          </button>


          <button
            type="button"
            className={
              buque.activo
                ? "boton-estado-detalle desactivar"
                : "boton-estado-detalle reactivar"
            }
            onClick={() => {
              setErrorEstado("");

              setMostrarModalEstado(true);
            }}
          >
            <Power size={18} />

            {buque.activo
              ? "Desactivar"
              : "Reactivar"}
          </button>

        </div>

      </div>


      {/* INFORMACION */}

      <div className="rejilla-detalle-buque">


        {/* INFORMACION GENERAL */}

        <article className="glass-card tarjeta-detalle-buque">

          <div className="titulo-tarjeta-detalle">

            <Ship size={20} />

            <h2>
              Información general
            </h2>

          </div>


          <div className="lista-datos-buque">

            <div className="dato-buque">

              <div className="icono-dato-buque">
                <Tag size={18} />
              </div>


              <div>

                <span>
                  Identificación
                </span>

                <strong>
                  {buque.identificacion}
                </strong>

              </div>

            </div>


            <div className="dato-buque">

              <div className="icono-dato-buque">
                <Building2 size={18} />
              </div>


              <div>

                <span>
                  Empresa
                </span>

                <strong>
                  {buque.empresa}
                </strong>


                {buque.pais_empresa && (
                  <small>
                    {buque.pais_empresa}
                  </small>
                )}

              </div>

            </div>


            <div className="dato-buque">

              <div className="icono-dato-buque">
                <Ship size={18} />
              </div>


              <div>

                <span>
                  Tipo de buque
                </span>

                <strong>
                  {buque.tipo_buque}
                </strong>

              </div>

            </div>


            <div className="dato-buque">

              <div className="icono-dato-buque">
                <Flag size={18} />
              </div>


              <div>

                <span>
                  Bandera
                </span>

                <strong>
                  {buque.bandera ||
                    "No registrada"}
                </strong>

              </div>

            </div>

          </div>

        </article>


        {/* CARACTERISTICAS FISICAS */}

        <article className="glass-card tarjeta-detalle-buque">

          <div className="titulo-tarjeta-detalle">

            <Ruler size={20} />

            <h2>
              Características físicas
            </h2>

          </div>


          <div className="medidas-detalle-buque">

            <div>

              <span>
                Eslora
              </span>

              <strong>
                {formatearMedida(
                  buque.eslora_m
                )}
              </strong>

              <small>
                Longitud total
              </small>

            </div>


            <div>

              <span>
                Manga
              </span>

              <strong>
                {formatearMedida(
                  buque.manga_m
                )}
              </strong>

              <small>
                Anchura máxima
              </small>

            </div>


            <div>

              <span>
                Calado
              </span>

              <strong>
                {formatearMedida(
                  buque.calado_m
                )}
              </strong>

              <small>
                Profundidad requerida
              </small>

            </div>

          </div>


          <div className="nota-compatibilidad-muelles">

            <Anchor size={18} />

            <p>
              Estas dimensiones serán utilizadas
              para validar la compatibilidad
              física al asignar un muelle.
            </p>

          </div>

        </article>

      </div>


      {/* INFORMACION DEL REGISTRO */}

      <article className="glass-card tarjeta-registro-buque">

        <div className="titulo-tarjeta-detalle">

          <CalendarDays size={20} />

          <h2>
            Información del registro
          </h2>

        </div>


        <div className="datos-registro-buque">

          <div>

            <span>
              Fecha de creación
            </span>

            <strong>
              {formatearFecha(
                buque.fecha_creacion
              )}
            </strong>

          </div>


          <div>

            <span>
              Última actualización
            </span>

            <strong>
              {formatearFecha(
                buque.fecha_actualizacion
              )}
            </strong>

          </div>


          <div>

            <span>
              Estado del registro
            </span>

            <strong>
              {buque.activo
                ? "Activo"
                : "Inactivo"}
            </strong>

          </div>

        </div>

      </article>


      {/* OPERACIONES */}

      <article className="glass-card tarjeta-operaciones-buque">

        <div className="encabezado-operaciones-buque">

          <div className="titulo-tarjeta-detalle">

            <Package size={20} />

            <h2>
              Operaciones portuarias
            </h2>

          </div>


          <span>
            {operaciones.length}
            {" "}
            operación
            {operaciones.length !== 1
              ? "es"
              : ""}
          </span>

        </div>


        {operaciones.length === 0 ? (

          <div className="sin-operaciones-buque">

            <Ship size={30} />

            <strong>
              Sin operaciones registradas
            </strong>

            <p>
              Este buque todavía no posee
              operaciones portuarias asociadas.
            </p>

          </div>

        ) : (

          <div className="contenedor-tabla-operaciones-buque">

            <table className="tabla-operaciones-buque">

              <thead>

                <tr>
                  <th>Código</th>
                  <th>Carga</th>
                  <th>Ruta</th>
                  <th>Llegada estimada</th>
                  <th>Muelle</th>
                  <th>Estado</th>
                </tr>

              </thead>


              <tbody>

                {operaciones.map(
                  (operacion) => (

                    <tr
                      key={
                        operacion.id_operacion
                      }
                    >

                      <td>
                        <strong>
                          {operacion.codigo}
                        </strong>
                      </td>


                      <td>
                        {operacion.tipo_carga}
                      </td>


                      <td>

                        <div className="ruta-operacion-buque">

                          <MapPin size={14} />

                          <span>
                            {operacion.procedencia}
                            {" → "}
                            {operacion.destino}
                          </span>

                        </div>

                      </td>


                      <td>
                        {formatearFechaHora(
                          operacion.llegada_estimada
                        )}
                      </td>


                      <td>
                        {operacion.codigo_muelle ||
                          "Sin asignar"}
                      </td>


                      <td>

                        <span className="estado-operacion-buque">
                          {operacion.estado}
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </article>


      {/* MODAL DESACTIVAR / REACTIVAR */}

      {mostrarModalEstado && (

        <div className="fondo-modal-buque">

          <div className="modal-estado-buque">


            <button
              type="button"
              className="cerrar-modal-buque"
              onClick={() =>
                setMostrarModalEstado(false)
              }
              disabled={cambiandoEstado}
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>


            <div
              className={
                buque.activo
                  ? "icono-modal-estado desactivar"
                  : "icono-modal-estado reactivar"
              }
            >
              <Power size={27} />
            </div>


            <h2>
              {buque.activo
                ? "¿Desactivar buque?"
                : "¿Reactivar buque?"}
            </h2>


            <p>
              {buque.activo
                ? `El buque ${buque.nombre} quedará marcado como inactivo en TALASSA.`
                : `El buque ${buque.nombre} volverá a estar disponible como registro activo.`}
            </p>


            <div className="resumen-modal-buque">

              <span>
                {buque.identificacion}
              </span>

              <strong>
                {buque.nombre}
              </strong>

            </div>


            {errorEstado && (

              <div className="mensaje-error-modal-buque">
                {errorEstado}
              </div>

            )}


            <div className="acciones-modal-buque">

              <button
                type="button"
                className="boton-cancelar-modal"
                onClick={() =>
                  setMostrarModalEstado(false)
                }
                disabled={cambiandoEstado}
              >
                Cancelar
              </button>


              <button
                type="button"
                className={
                  buque.activo
                    ? "boton-confirmar-estado desactivar"
                    : "boton-confirmar-estado reactivar"
                }
                onClick={
                  confirmarCambioEstado
                }
                disabled={cambiandoEstado}
              >

                {cambiandoEstado ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="icono-cargando-detalle"
                    />

                    Procesando...
                  </>
                ) : (
                  <>
                    <Power size={17} />

                    {buque.activo
                      ? "Sí, desactivar"
                      : "Sí, reactivar"}
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


export default DetalleBuquePage;