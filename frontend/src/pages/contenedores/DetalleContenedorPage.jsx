import {
  ArrowLeft,
  Boxes,
  CalendarDays,
  FileText,
  Package,
  Pencil,
  RefreshCw,
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
  obtenerContenedorPorId,
} from "../../services/contenedoresService.js";

import "../../styles/detalleContenedor.css";


function DetalleContenedorPage() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();


  const [
    contenedor,
    setContenedor,
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
    async function cargarContenedor() {
      try {
        setCargando(true);

        setError("");

        const datos =
          await obtenerContenedorPorId(
            id
          );

        setContenedor(datos);
      } catch (error) {
        setError(
          error.message
        );
      } finally {
        setCargando(false);
      }
    }


    cargarContenedor();
  }, [id]);


  function formatearPeso(
    peso
  ) {
    if (
      peso === null ||
      peso === undefined
    ) {
      return "—";
    }

    return new Intl.NumberFormat(
      "es-SV",
      {
        maximumFractionDigits: 2,
      }
    ).format(
      Number(peso)
    );
  }


  function formatearFechaHora(
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
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(
      new Date(fecha)
    );
  }


  if (cargando) {
    return (
      <section className="pagina-detalle-contenedor">

        <div className="cargando-detalle-contenedor">

          <RefreshCw
            size={27}
            className="icono-cargando-detalle-contenedor"
          />

          <span>
            Cargando contenedor...
          </span>

        </div>

      </section>
    );
  }


  if (
    error ||
    !contenedor
  ) {
    return (
      <section className="pagina-detalle-contenedor">

        <button
          type="button"
          className="boton-volver-detalle-contenedor"
          onClick={() =>
            navigate(
              "/contenedores"
            )
          }
        >
          <ArrowLeft size={18} />

          Volver a Contenedores
        </button>


        <div className="error-detalle-contenedor">

          <Boxes size={38} />

          <h2>
            No fue posible mostrar
            el contenedor
          </h2>

          <p>
            {error ||
              "El contenedor solicitado no está disponible."}
          </p>

        </div>

      </section>
    );
  }


  return (
    <section className="pagina-detalle-contenedor">

      {/* VOLVER */}

      <button
        type="button"
        className="boton-volver-detalle-contenedor"
        onClick={() =>
          navigate(
            "/contenedores"
          )
        }
      >
        <ArrowLeft size={18} />

        Volver a Contenedores
      </button>


      {/* ENCABEZADO */}

      <div className="encabezado-detalle-contenedor">

        <div className="identidad-detalle-contenedor">

          <div className="icono-principal-contenedor">
            <Boxes size={31} />
          </div>


          <div>

            <div className="titulo-detalle-contenedor">

              <h1>
                {contenedor.codigo}
              </h1>


              <span className="estado-detalle-contenedor">
                <i />

                {contenedor.estado}
              </span>

            </div>


            <p>
              {contenedor.tipo_contenedor}
              {" · "}
              {contenedor.tipo_carga}
            </p>

          </div>

        </div>


        <div className="acciones-detalle-contenedor">

          <button
            type="button"
            className="boton-ver-operacion-contenedor"
            onClick={() =>
              navigate(
                `/operaciones/${contenedor.id_operacion}`
              )
            }
          >
            <Ship size={18} />

            Ver operación
          </button>


          <button
            type="button"
            className="boton-editar-contenedor"
            onClick={() =>
              navigate(
                `/contenedores/${contenedor.id_contenedor}/editar`
              )
            }
          >
            <Pencil size={17} />

            Editar contenedor
          </button>

        </div>

      </div>


      {/* TARJETA PRINCIPAL */}

      <article className="glass-card tarjeta-principal-detalle-contenedor">

        <div className="representacion-contenedor">

          <div className="caja-icono-contenedor">

            <Package size={58} />

          </div>


          <div>

            <span>
              Contenedor
            </span>

            <strong>
              {contenedor.codigo}
            </strong>

            <small>
              Registro asociado a una
              operación portuaria de TALASSA
            </small>

          </div>

        </div>


        <div className="datos-principales-contenedor">

          <div>

            <span>
              Tipo
            </span>

            <strong>
              {
                contenedor.tipo_contenedor
              }
            </strong>

          </div>


          <div>

            <span>
              Tipo de carga
            </span>

            <strong>
              {
                contenedor.tipo_carga
              }
            </strong>

          </div>


          <div>

            <span>
              Peso registrado
            </span>

            <strong>
              {formatearPeso(
                contenedor.peso_kg
              )}
              {" kg"}
            </strong>

          </div>

        </div>

      </article>


      {/* ESPECIFICACIONES */}

      <article className="glass-card tarjeta-especificaciones-contenedor">

        <div className="titulo-seccion-contenedor">

          <Package size={20} />

          <div>

            <h2>
              Especificaciones
            </h2>

            <p>
              Información técnica registrada
              para este contenedor.
            </p>

          </div>

        </div>


        <div className="rejilla-especificaciones-contenedor">

          <div className="especificacion-contenedor">

            <div>
              <Boxes size={22} />
            </div>

            <span>
              Tipo de contenedor
            </span>

            <strong>
              {
                contenedor.tipo_contenedor
              }
            </strong>

          </div>


          <div className="especificacion-contenedor">

            <div>
              <Package size={22} />
            </div>

            <span>
              Tipo de carga
            </span>

            <strong>
              {
                contenedor.tipo_carga
              }
            </strong>

          </div>


          <div className="especificacion-contenedor">

            <div>
              <Weight size={22} />
            </div>

            <span>
              Peso
            </span>

            <strong>
              {formatearPeso(
                contenedor.peso_kg
              )}
              {" kg"}
            </strong>

          </div>


          <div className="especificacion-contenedor">

            <div>
              <Package size={22} />
            </div>

            <span>
              Estado
            </span>

            <strong className="texto-estado-contenedor">
              {
                contenedor.estado
              }
            </strong>

          </div>

        </div>


        {contenedor.descripcion_tipo_contenedor && (

          <div className="descripcion-tipo-contenedor">

            <span>
              Descripción del tipo
            </span>

            <p>
              {
                contenedor.descripcion_tipo_contenedor
              }
            </p>

          </div>

        )}

      </article>


      {/* OPERACION ASOCIADA */}

      <article className="glass-card tarjeta-operacion-contenedor">

        <div className="titulo-seccion-contenedor">

          <Ship size={20} />

          <div>

            <h2>
              Operación asociada
            </h2>

            <p>
              Visita portuaria a la que
              pertenece el contenedor.
            </p>

          </div>

        </div>


        <div className="contenido-operacion-contenedor">

          <div className="codigo-operacion-detalle-contenedor">

            <span>
              Operación
            </span>

            <strong>
              {
                contenedor.codigo_operacion
              }
            </strong>

          </div>


          <div className="dato-operacion-contenedor">

            <span>
              Buque
            </span>

            <strong>
              {
                contenedor.buque
              }
            </strong>

            <small>
              {
                contenedor.identificacion_buque
              }
            </small>

          </div>


          <div className="dato-operacion-contenedor">

            <span>
              Bandera
            </span>

            <strong>
              {
                contenedor.bandera_buque ||
                "No registrada"
              }
            </strong>

          </div>


          <div className="dato-operacion-contenedor">

            <span>
              Estado de operación
            </span>

            <strong>
              {
                contenedor.estado_operacion
              }
            </strong>

          </div>

        </div>

      </article>


      {/* OBSERVACIONES */}

      <article className="glass-card tarjeta-observaciones-contenedor">

        <div className="titulo-seccion-contenedor">

          <FileText size={20} />

          <div>

            <h2>
              Observaciones
            </h2>

            <p>
              Información adicional
              registrada para el contenedor.
            </p>

          </div>

        </div>


        <div className="texto-observaciones-contenedor">

          {contenedor.observaciones ||
            "No se registraron observaciones para este contenedor."}

        </div>

      </article>


      {/* FECHAS */}

      <article className="glass-card tarjeta-registro-detalle-contenedor">

        <div>

          <CalendarDays size={18} />

          <span>
            Registrado
          </span>

          <strong>
            {formatearFechaHora(
              contenedor.fecha_registro
            )}
          </strong>

        </div>


        <div>

          <RefreshCw size={18} />

          <span>
            Última actualización
          </span>

          <strong>
            {formatearFechaHora(
              contenedor.fecha_actualizacion
            )}
          </strong>

        </div>


        <div>

          <Boxes size={18} />

          <span>
            Identificador interno
          </span>

          <strong>
            #
            {
              contenedor.id_contenedor
            }
          </strong>

        </div>

      </article>

    </section>
  );
}


export default DetalleContenedorPage;