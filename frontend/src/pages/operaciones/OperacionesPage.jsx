import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Ship,
  Waves,
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
  obtenerOperaciones,
} from "../../services/operacionesService.js";

import "../../styles/operaciones.css";


function OperacionesPage() {
  const navigate =
    useNavigate();


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
    busqueda,
    setBusqueda,
  ] = useState("");


  const [
    filtroEstado,
    setFiltroEstado,
  ] = useState("");


  const [
    filtroCarga,
    setFiltroCarga,
  ] = useState("");


  async function cargarOperaciones() {
    try {
      setCargando(true);

      setError("");

      const datos =
        await obtenerOperaciones();

      setOperaciones(datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }


  useEffect(() => {
    cargarOperaciones();
  }, []);


  const tiposCarga =
    useMemo(() => {
      return [
        ...new Set(
          operaciones.map(
            (operacion) =>
              operacion.tipo_carga
          )
        ),
      ]
        .filter(Boolean)
        .sort();
    }, [operaciones]);


  const operacionesFiltradas =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();

      return operaciones.filter(
        (operacion) => {
          const coincideBusqueda =
            !texto ||
            operacion.codigo
              ?.toLowerCase()
              .includes(texto) ||
            operacion.buque
              ?.toLowerCase()
              .includes(texto) ||
            operacion.identificacion_buque
              ?.toLowerCase()
              .includes(texto) ||
            operacion.procedencia
              ?.toLowerCase()
              .includes(texto) ||
            operacion.destino
              ?.toLowerCase()
              .includes(texto);


          const coincideEstado =
            !filtroEstado ||
            operacion.estado ===
              filtroEstado;


          const coincideCarga =
            !filtroCarga ||
            operacion.tipo_carga ===
              filtroCarga;


          return (
            coincideBusqueda &&
            coincideEstado &&
            coincideCarga
          );
        }
      );
    }, [
      operaciones,
      busqueda,
      filtroEstado,
      filtroCarga,
    ]);


  const totalProgramadas =
    operaciones.filter(
      (operacion) =>
        operacion.estado ===
        "Programada"
    ).length;


  const totalEnCurso =
    operaciones.filter(
      (operacion) =>
        [
          "Muelle asignado",
          "En puerto",
          "En operación",
        ].includes(
          operacion.estado
        )
    ).length;


  const totalFinalizadas =
    operaciones.filter(
      (operacion) =>
        operacion.estado ===
        "Finalizada"
    ).length;


  function limpiarFiltros() {
    setBusqueda("");
    setFiltroEstado("");
    setFiltroCarga("");
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


  function obtenerClaseEstado(
    estado
  ) {
    switch (estado) {
      case "Programada":
        return "programada";

      case "Muelle asignado":
        return "muelle-asignado";

      case "En puerto":
        return "en-puerto";

      case "En operación":
        return "en-operacion";

      case "Finalizada":
        return "finalizada";

      default:
        return "";
    }
  }


  return (
    <section className="pagina-operaciones">

      <div className="fondo-operaciones" />


      {/* ENCABEZADO */}

      <div className="encabezado-operaciones">

        <div>
          <h1>
            Operaciones portuarias
          </h1>

          <p>
            Gestión y seguimiento de
            las visitas portuarias
            registradas en TALASSA.
          </p>
        </div>


        <button
          type="button"
          className="boton-nueva-operacion"
          onClick={() =>
            navigate(
              "/operaciones/nueva"
            )
          }
        >
          <Plus size={19} />

          Nueva operación
        </button>

      </div>


      {/* RESUMEN */}

      <div className="resumen-operaciones">

        <article className="tarjeta-resumen-operacion azul">

          <div className="icono-resumen-operacion">
            <Waves size={23} />
          </div>

          <div>
            <span>
              Total operaciones
            </span>

            <strong>
              {operaciones.length}
            </strong>

            <small>
              Registros portuarios
            </small>
          </div>

        </article>


        <article className="tarjeta-resumen-operacion celeste">

          <div className="icono-resumen-operacion">
            <CalendarClock size={23} />
          </div>

          <div>
            <span>
              Programadas
            </span>

            <strong>
              {totalProgramadas}
            </strong>

            <small>
              Próximas operaciones
            </small>
          </div>

        </article>


        <article className="tarjeta-resumen-operacion menta">

          <div className="icono-resumen-operacion">
            <Clock3 size={23} />
          </div>

          <div>
            <span>
              En curso
            </span>

            <strong>
              {totalEnCurso}
            </strong>

            <small>
              Actividad portuaria
            </small>
          </div>

        </article>


        <article className="tarjeta-resumen-operacion blanco">

          <div className="icono-resumen-operacion">
            <CheckCircle2 size={23} />
          </div>

          <div>
            <span>
              Finalizadas
            </span>

            <strong>
              {totalFinalizadas}
            </strong>

            <small>
              Operaciones completadas
            </small>
          </div>

        </article>

      </div>


      {/* LISTADO */}

      <article className="glass-card tarjeta-listado-operaciones">

        <div className="encabezado-listado-operaciones">

          <div>
            <h2>
              <Ship size={21} />

              Registro de operaciones
            </h2>

            <span>
              {
                operacionesFiltradas.length
              }
              {" "}
              resultado
              {
                operacionesFiltradas.length !==
                1
                  ? "s"
                  : ""
              }
            </span>
          </div>


          <button
            type="button"
            className="boton-actualizar-operaciones"
            onClick={
              cargarOperaciones
            }
          >
            <RefreshCw size={17} />

            Actualizar
          </button>

        </div>


        {/* FILTROS */}

        <div className="filtros-operaciones">

          <div className="buscador-operaciones">

            <Search size={18} />

            <input
              type="text"
              value={busqueda}
              onChange={(evento) =>
                setBusqueda(
                  evento.target.value
                )
              }
              placeholder="Buscar código, buque o ruta..."
            />

          </div>


          <div className="campo-filtro-operaciones">

            <Filter size={16} />

            <select
              value={filtroEstado}
              onChange={(evento) =>
                setFiltroEstado(
                  evento.target.value
                )
              }
            >

              <option value="">
                Todos los estados
              </option>

              <option value="Programada">
                Programada
              </option>

              <option value="Muelle asignado">
                Muelle asignado
              </option>

              <option value="En puerto">
                En puerto
              </option>

              <option value="En operación">
                En operación
              </option>

              <option value="Finalizada">
                Finalizada
              </option>

            </select>

          </div>


          <div className="campo-filtro-operaciones">

            <select
              value={filtroCarga}
              onChange={(evento) =>
                setFiltroCarga(
                  evento.target.value
                )
              }
            >

              <option value="">
                Todos los tipos de carga
              </option>

              {tiposCarga.map(
                (tipoCarga) => (
                  <option
                    key={tipoCarga}
                    value={tipoCarga}
                  >
                    {tipoCarga}
                  </option>
                )
              )}

            </select>

          </div>


          <button
            type="button"
            className="boton-limpiar-operaciones"
            onClick={
              limpiarFiltros
            }
          >
            Limpiar
          </button>

        </div>


        {error && (
          <div className="mensaje-error-operaciones">
            {error}
          </div>
        )}


        {cargando && (
          <div className="estado-carga-operaciones">

            <RefreshCw
              size={25}
              className="icono-cargando-operaciones"
            />

            <span>
              Cargando operaciones...
            </span>

          </div>
        )}


        {!cargando && !error && (

          <div className="contenedor-tabla-operaciones">

            <table className="tabla-operaciones">

              <thead>

                <tr>
                  <th>Código</th>
                  <th>Buque</th>
                  <th>Tipo de carga</th>
                  <th>Ruta</th>
                  <th>Llegada estimada</th>
                  <th>Salida estimada</th>
                  <th>Contenedores</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>

              </thead>


              <tbody>

                {
                  operacionesFiltradas.length ===
                  0
                    ? (
                      <tr>
                        <td
                          colSpan="9"
                          className="tabla-sin-operaciones"
                        >
                          No se encontraron
                          operaciones portuarias.
                        </td>
                      </tr>
                    )
                    : (
                      operacionesFiltradas.map(
                        (operacion) => (

                          <tr
                            key={
                              operacion.id_operacion
                            }
                          >

                            <td>
                              <span className="codigo-operacion">
                                {
                                  operacion.codigo
                                }
                              </span>
                            </td>


                            <td>

                              <div className="buque-operacion">

                                <div className="icono-buque-operacion">
                                  <Ship size={16} />
                                </div>

                                <div>
                                  <strong>
                                    {
                                      operacion.buque
                                    }
                                  </strong>

                                  <small>
                                    {
                                      operacion.identificacion_buque
                                    }
                                  </small>
                                </div>

                              </div>

                            </td>


                            <td>
                              {
                                operacion.tipo_carga
                              }
                            </td>


                            <td>

                              <div className="ruta-operacion">

                                <MapPin size={14} />

                                <span>
                                  {
                                    operacion.procedencia
                                  }
                                  {" → "}
                                  {
                                    operacion.destino
                                  }
                                </span>

                              </div>

                            </td>


                            <td>
                              {
                                formatearFechaHora(
                                  operacion.llegada_estimada
                                )
                              }
                            </td>


                            <td>
                              {
                                formatearFechaHora(
                                  operacion.salida_estimada
                                )
                              }
                            </td>


                            <td>
                              <span className="cantidad-contenedores">
                                {
                                  operacion.total_contenedores
                                }
                              </span>
                            </td>


                            <td>

                              <span
                                className={
                                  `estado-operacion ${obtenerClaseEstado(
                                    operacion.estado
                                  )}`
                                }
                              >
                                <i />

                                {
                                  operacion.estado
                                }
                              </span>

                            </td>


                            <td>

                              <div className="acciones-operacion">

                                <button
                                  type="button"
                                  title="Ver detalle"
                                  onClick={() =>
                                    navigate(
                                      `/operaciones/${operacion.id_operacion}`
                                    )
                                  }
                                >
                                  <Eye size={17} />
                                </button>


                                <button
                                  type="button"
                                  title={
                                    operacion.estado ===
                                    "Finalizada"
                                      ? "Las operaciones finalizadas no se editan"
                                      : "Editar operación"
                                  }
                                  disabled={
                                    operacion.estado ===
                                    "Finalizada"
                                  }
                                  onClick={() =>
                                    navigate(
                                      `/operaciones/${operacion.id_operacion}/editar`
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
                    )
                }

              </tbody>

            </table>

          </div>

        )}

      </article>

    </section>
  );
}


export default OperacionesPage;