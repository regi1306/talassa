import {
  Boxes,
  Eye,
  Filter,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Ship,
  Weight,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  obtenerContenedores,
} from "../../services/contenedoresService.js";

import "../../styles/contenedores.css";


function ContenedoresPage() {
  const navigate =
    useNavigate();


  const [
    contenedores,
    setContenedores,
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
    busqueda,
    setBusqueda,
  ] = useState("");


  const [
    filtroOperacion,
    setFiltroOperacion,
  ] = useState("");


  const [
    filtroTipo,
    setFiltroTipo,
  ] = useState("");


  async function cargarContenedores() {
    try {
      setCargando(true);
      setError("");

      const datos =
        await obtenerContenedores();

      setContenedores(
        datos || []
      );
    } catch (error) {
      setError(
        error.message
      );
    } finally {
      setCargando(false);
    }
  }


  useEffect(() => {
    cargarContenedores();
  }, []);


  const operaciones =
    useMemo(() => {
      return [
        ...new Set(
          contenedores.map(
            (contenedor) =>
              contenedor.codigo_operacion
          )
        ),
      ]
        .filter(Boolean)
        .sort();
    }, [contenedores]);


  const tiposContenedor =
    useMemo(() => {
      return [
        ...new Set(
          contenedores.map(
            (contenedor) =>
              contenedor.tipo_contenedor
          )
        ),
      ]
        .filter(Boolean)
        .sort();
    }, [contenedores]);


  const contenedoresFiltrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();

      return contenedores.filter(
        (contenedor) => {

          const coincideBusqueda =
            !texto ||
            contenedor.codigo
              ?.toLowerCase()
              .includes(texto) ||
            contenedor.codigo_operacion
              ?.toLowerCase()
              .includes(texto) ||
            contenedor.buque
              ?.toLowerCase()
              .includes(texto) ||
            contenedor.tipo_carga
              ?.toLowerCase()
              .includes(texto);


          const coincideOperacion =
            !filtroOperacion ||
            contenedor.codigo_operacion ===
              filtroOperacion;


          const coincideTipo =
            !filtroTipo ||
            contenedor.tipo_contenedor ===
              filtroTipo;


          return (
            coincideBusqueda &&
            coincideOperacion &&
            coincideTipo
          );
        }
      );
    }, [
      contenedores,
      busqueda,
      filtroOperacion,
      filtroTipo,
    ]);


  const pesoTotal =
    contenedores.reduce(
      (
        acumulado,
        contenedor
      ) =>
        acumulado +
        Number(
          contenedor.peso_kg || 0
        ),
      0
    );


  function limpiarFiltros() {
    setBusqueda("");
    setFiltroOperacion("");
    setFiltroTipo("");
  }


  function formatearPeso(
    peso
  ) {
    return new Intl.NumberFormat(
      "es-SV",
      {
        maximumFractionDigits: 2,
      }
    ).format(
      Number(peso)
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


  return (
    <section className="pagina-contenedores">

      <div className="fondo-contenedores" />


      {/* ENCABEZADO */}

      <div className="encabezado-contenedores">

        <div>

          <h1>
            Contenedores
          </h1>

          <p>
            Control de la carga
            asociada a las operaciones
            portuarias de TALASSA.
          </p>

        </div>


        <button
          type="button"
          className="boton-nuevo-contenedor"
          onClick={() =>
            navigate(
              "/contenedores/nuevo"
            )
          }
        >
          <Plus size={19} />

          Registrar contenedor
        </button>

      </div>


      {/* INDICADORES */}

      <div className="resumen-contenedores">

        <article className="tarjeta-resumen-contenedor">

          <div>
            <Boxes size={22} />
          </div>

          <span>
            Total contenedores
          </span>

          <strong>
            {contenedores.length}
          </strong>

        </article>


        <article className="tarjeta-resumen-contenedor">

          <div>
            <Weight size={22} />
          </div>

          <span>
            Peso registrado
          </span>

          <strong>
            {formatearPeso(
              pesoTotal
            )}
            <small> kg</small>
          </strong>

        </article>


        <article className="tarjeta-resumen-contenedor">

          <div>
            <Package size={22} />
          </div>

          <span>
            Tipos utilizados
          </span>

          <strong>
            {
              tiposContenedor.length
            }
          </strong>

        </article>


        <article className="tarjeta-resumen-contenedor">

          <div>
            <Ship size={22} />
          </div>

          <span>
            Operaciones asociadas
          </span>

          <strong>
            {
              operaciones.length
            }
          </strong>

        </article>

      </div>


      {/* LISTADO */}

      <article className="glass-card tarjeta-listado-contenedores">

        <div className="encabezado-listado-contenedores">

          <div>

            <h2>
              <Boxes size={21} />

              Registro de contenedores
            </h2>

            <span>
              {
                contenedoresFiltrados.length
              }
              {" "}
              resultado
              {
                contenedoresFiltrados.length !==
                1
                  ? "s"
                  : ""
              }
            </span>

          </div>


          <button
            type="button"
            className="boton-actualizar-contenedores"
            onClick={
              cargarContenedores
            }
          >
            <RefreshCw size={17} />

            Actualizar
          </button>

        </div>


        {/* FILTROS */}

        <div className="filtros-contenedores">

          <div className="buscador-contenedores">

            <Search size={18} />

            <input
              type="text"
              value={busqueda}
              onChange={(evento) =>
                setBusqueda(
                  evento.target.value
                )
              }
              placeholder="Buscar código, operación, buque o carga..."
            />

          </div>


          <div className="campo-filtro-contenedores">

            <Filter size={16} />

            <select
              value={
                filtroOperacion
              }
              onChange={(evento) =>
                setFiltroOperacion(
                  evento.target.value
                )
              }
            >
              <option value="">
                Todas las operaciones
              </option>

              {operaciones.map(
                (operacion) => (
                  <option
                    key={operacion}
                    value={operacion}
                  >
                    {operacion}
                  </option>
                )
              )}

            </select>

          </div>


          <div className="campo-filtro-contenedores">

            <select
              value={
                filtroTipo
              }
              onChange={(evento) =>
                setFiltroTipo(
                  evento.target.value
                )
              }
            >
              <option value="">
                Todos los tipos
              </option>

              {tiposContenedor.map(
                (tipo) => (
                  <option
                    key={tipo}
                    value={tipo}
                  >
                    {tipo}
                  </option>
                )
              )}

            </select>

          </div>


          <button
            type="button"
            className="boton-limpiar-contenedores"
            onClick={
              limpiarFiltros
            }
          >
            Limpiar
          </button>

        </div>


        {error && (
          <div className="mensaje-error-contenedores">
            {error}
          </div>
        )}


        {cargando && (
          <div className="estado-carga-contenedores">

            <RefreshCw
              size={24}
              className="icono-cargando-contenedores"
            />

            Cargando contenedores...

          </div>
        )}


        {!cargando &&
          !error && (

          <div className="contenedor-tabla-contenedores">

            <table className="tabla-contenedores">

              <thead>

                <tr>
                  <th>Código</th>
                  <th>Operación</th>
                  <th>Buque</th>
                  <th>Tipo</th>
                  <th>Tipo de carga</th>
                  <th>Peso</th>
                  <th>Estado</th>
                  <th>Registro</th>
                  <th>Acciones</th>
                </tr>

              </thead>


              <tbody>

                {contenedoresFiltrados.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan="9"
                      className="tabla-sin-contenedores"
                    >
                      No se encontraron
                      contenedores registrados.
                    </td>

                  </tr>

                ) : (

                  contenedoresFiltrados.map(
                    (contenedor) => (

                      <tr
                        key={
                          contenedor.id_contenedor
                        }
                      >

                        <td>
                          <span className="codigo-contenedor">
                            {
                              contenedor.codigo
                            }
                          </span>
                        </td>


                        <td>
                          <span className="operacion-contenedor">
                            {
                              contenedor.codigo_operacion
                            }
                          </span>
                        </td>


                        <td>

                          <div className="buque-contenedor">

                            <Ship size={16} />

                            <div>

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

                          </div>

                        </td>


                        <td>
                          {
                            contenedor.tipo_contenedor
                          }
                        </td>


                        <td>
                          {
                            contenedor.tipo_carga
                          }
                        </td>


                        <td>
                          <strong className="peso-contenedor">
                            {
                              formatearPeso(
                                contenedor.peso_kg
                              )
                            }
                            {" kg"}
                          </strong>
                        </td>


                        <td>

                          <span className="estado-contenedor">
                            <i />

                            {
                              contenedor.estado
                            }
                          </span>

                        </td>


                        <td>
                          {
                            formatearFecha(
                              contenedor.fecha_registro
                            )
                          }
                        </td>


                        <td>

                          <div className="acciones-contenedor">

                            <button
                              type="button"
                              title="Ver detalle"
                              onClick={() =>
                                navigate(
                                  `/contenedores/${contenedor.id_contenedor}`
                                )
                              }
                            >
                              <Eye size={17} />
                            </button>


                            <button
                              type="button"
                              title="Editar contenedor"
                              onClick={() =>
                                navigate(
                                  `/contenedores/${contenedor.id_contenedor}/editar`
                                )
                              }
                            >
                              <Pencil size={16} />
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        )}

      </article>

    </section>
  );
}


export default ContenedoresPage;