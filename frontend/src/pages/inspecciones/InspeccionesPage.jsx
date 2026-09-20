import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  CheckCircle2,
  ClipboardList,
  Edit3,
  Eye,
  Plus,
  RefreshCw,
  Search,
  Timer,
  Trash2,
} from "lucide-react";

import {
  eliminarInspeccion as eliminarInspeccionApi,
  obtenerInspecciones,
} from "../../services/inspeccionesService.js";

import ConfirmDeleteModal
  from "../../components/common/ConfirmDeleteModal.jsx";

import "../../styles/inspecciones.css";


/* ======================================
   CLASE DEL ESTADO
====================================== */

function obtenerClaseInspeccion(
  estado
) {
  switch (estado) {
    case "Pendiente":
      return "inspection-status-pending";

    case "En proceso":
      return "inspection-status-process";

    case "Finalizada":
      return "inspection-status-finished";

    default:
      return "";
  }
}


/* ======================================
   FORMATEAR FECHA
====================================== */

function obtenerFecha(
  fechaHora
) {
  if (!fechaHora) {
    return "-";
  }

  const fecha =
    new Date(fechaHora);

  if (
    Number.isNaN(
      fecha.getTime()
    )
  ) {
    return "-";
  }

  return fecha.toLocaleDateString(
    "es-SV",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
}


function obtenerHora(
  fechaHora
) {
  if (!fechaHora) {
    return "";
  }

  const fecha =
    new Date(fechaHora);

  if (
    Number.isNaN(
      fecha.getTime()
    )
  ) {
    return "";
  }

  return fecha.toLocaleTimeString(
    "es-SV",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  );
}


function InspeccionesPage() {
  const navigate =
    useNavigate();


  /* ======================================
     ESTADOS
  ====================================== */

  const [
    inspecciones,
    setInspecciones,
  ] = useState([]);


  const [
    estadoActivo,
    setEstadoActivo,
  ] = useState("Todos");


  const [
    busqueda,
    setBusqueda,
  ] = useState("");


  const [
    filtroOperacion,
    setFiltroOperacion,
  ] = useState("Todas");


  const [
    filtroInspector,
    setFiltroInspector,
  ] = useState("Todos");


  const [
    cargando,
    setCargando,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");

  const [
    inspeccionAEliminar,
    setInspeccionAEliminar,
  ] = useState(null);

  /* ======================================
     CARGAR DESDE POSTGRESQL
  ====================================== */

  async function cargarInspecciones() {
    try {
      setCargando(true);

      setError("");


      const respuesta =
        await obtenerInspecciones();


      if (!respuesta.ok) {
        throw new Error(
          respuesta.mensaje ||
          "No fue posible cargar las inspecciones."
        );
      }


      setInspecciones(
        respuesta.datos || []
      );

    } catch (error) {
      console.error(
        "Error al cargar inspecciones:",
        error
      );


      setError(
        error.response?.data?.mensaje ||
        error.message ||
        "No fue posible cargar las inspecciones."
      );

    } finally {
      setCargando(false);
    }
  }


  useEffect(() => {
    cargarInspecciones();
  }, []);


  /* ======================================
     OPERACIONES PARA FILTRO
  ====================================== */

  const operacionesDisponibles =
    useMemo(() => {

      return [
        ...new Set(
          inspecciones
            .map(
              (item) =>
                item.operacion
            )
            .filter(Boolean)
        ),
      ];

    }, [
      inspecciones,
    ]);


  /* ======================================
     INSPECTORES PARA FILTRO
  ====================================== */

  const inspectoresDisponibles =
    useMemo(() => {

      return [
        ...new Set(
          inspecciones
            .map(
              (item) =>
                item.inspector
            )
            .filter(Boolean)
        ),
      ];

    }, [
      inspecciones,
    ]);


  /* ======================================
     FILTROS
  ====================================== */

  const inspeccionesFiltradas =
    useMemo(() => {

      return inspecciones.filter(
        (inspeccion) => {

          const texto =
            busqueda
              .trim()
              .toLowerCase();


          const coincideBusqueda =
            (inspeccion.codigo || "")
              .toLowerCase()
              .includes(texto) ||

            (inspeccion.operacion || "")
              .toLowerCase()
              .includes(texto) ||

            (inspeccion.contenedor || "")
              .toLowerCase()
              .includes(texto) ||

            (inspeccion.inspector || "")
              .toLowerCase()
              .includes(texto);


          const coincideEstado =
            estadoActivo === "Todos" ||
            inspeccion.estado ===
            estadoActivo;


          const coincideOperacion =
            filtroOperacion === "Todas" ||
            inspeccion.operacion ===
            filtroOperacion;


          const coincideInspector =
            filtroInspector === "Todos" ||
            inspeccion.inspector ===
            filtroInspector;


          return (
            coincideBusqueda &&
            coincideEstado &&
            coincideOperacion &&
            coincideInspector
          );
        }
      );

    }, [
      inspecciones,
      busqueda,
      estadoActivo,
      filtroOperacion,
      filtroInspector,
    ]);


  /* ======================================
     CONTADORES
  ====================================== */

  const pendientes =
    inspecciones.filter(
      (item) =>
        item.estado ===
        "Pendiente"
    ).length;


  const enProceso =
    inspecciones.filter(
      (item) =>
        item.estado ===
        "En proceso"
    ).length;


  const finalizadas =
    inspecciones.filter(
      (item) =>
        item.estado ===
        "Finalizada"
    ).length;


  /* ======================================
     VER - SOLO LECTURA
  ====================================== */

  function verInspeccion(
    inspeccion
  ) {
    navigate(
      `/inspecciones/${inspeccion.id_inspeccion}/editar?modo=ver`
    );
  }


  /* ======================================
     EDITAR
  ====================================== */

  function editarInspeccion(
    inspeccion
  ) {
    navigate(
      `/inspecciones/${inspeccion.id_inspeccion}/editar`
    );
  }


  /* ======================================
     ELIMINAR
  ====================================== */

  async function confirmarEliminarInspeccion() {
    if (!inspeccionAEliminar) {
      return;
    }


    try {
      const respuesta =
        await eliminarInspeccionApi(
          inspeccionAEliminar.id_inspeccion
        );


      if (!respuesta.ok) {
        throw new Error(
          respuesta.mensaje ||
          "No fue posible eliminar la inspección."
        );
      }


      setInspecciones(
        (anteriores) =>
          anteriores.filter(
            (inspeccion) =>
              inspeccion.id_inspeccion !==
              inspeccionAEliminar.id_inspeccion
          )
      );


      setInspeccionAEliminar(
        null
      );


      setError("");

    } catch (error) {

      throw new Error(
        error.response?.data?.mensaje ||
        error.message ||
        "No fue posible eliminar la inspección."
      );

    }
  }


  return (
    <section className="inspections-page">


      {/* ==================================
          ENCABEZADO
      ================================== */}

      <div className="page-heading">

        <div>

          <h1>
            Inspecciones
          </h1>

          <p>
            Da seguimiento a las revisiones
            operativas y de cumplimiento.
          </p>

        </div>


        <button
          type="button"
          className="button button-primary"
          onClick={() =>
            navigate(
              "/inspecciones/nueva"
            )
          }
        >
          <Plus size={20} />

          Registrar inspección
        </button>

      </div>


      {/* ==================================
          INDICADORES
      ================================== */}

      <div className="inspection-stats-grid">


        <article className="stat-card">

          <div className="stat-icon inspection-stat-pending">

            <Timer size={27} />

          </div>


          <div>

            <span>
              Pendientes
            </span>

            <strong>
              {pendientes}
            </strong>

            <small>
              Requieren atención
            </small>

          </div>

        </article>


        <article className="stat-card">

          <div className="stat-icon inspection-stat-process">

            <RefreshCw size={27} />

          </div>


          <div>

            <span>
              En proceso
            </span>

            <strong>
              {enProceso}
            </strong>

            <small>
              Actualmente en revisión
            </small>

          </div>

        </article>


        <article className="stat-card">

          <div className="stat-icon inspection-stat-finished">

            <CheckCircle2 size={27} />

          </div>


          <div>

            <span>
              Finalizadas
            </span>

            <strong>
              {finalizadas}
            </strong>

            <small>
              Revisiones completadas
            </small>

          </div>

        </article>

      </div>


      {/* ==================================
          LISTADO
      ================================== */}

      <div className="glass-card table-card inspections-table-card">


        <div className="inspection-toolbar">


          {/* ==================================
              TABS
          ================================== */}

          <div className="inspection-tabs">


            <button
              type="button"
              className={
                estadoActivo === "Todos"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setEstadoActivo(
                  "Todos"
                )
              }
            >
              Todas
            </button>


            <button
              type="button"
              className={
                estadoActivo === "Pendiente"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setEstadoActivo(
                  "Pendiente"
                )
              }
            >
              <Timer size={17} />

              Pendientes
            </button>


            <button
              type="button"
              className={
                estadoActivo === "En proceso"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setEstadoActivo(
                  "En proceso"
                )
              }
            >
              <RefreshCw size={17} />

              En proceso
            </button>


            <button
              type="button"
              className={
                estadoActivo === "Finalizada"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setEstadoActivo(
                  "Finalizada"
                )
              }
            >
              <CheckCircle2 size={17} />

              Finalizadas
            </button>

          </div>


          {/* ==================================
              FILTROS
          ================================== */}

          <div className="inspection-filters">


            <div className="search-control">

              <Search size={18} />


              <input
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(
                    event.target.value
                  )
                }
                placeholder="Buscar inspección..."
              />

            </div>


            <select
              value={
                filtroOperacion
              }
              onChange={(event) =>
                setFiltroOperacion(
                  event.target.value
                )
              }
            >

              <option value="Todas">
                Todas las operaciones
              </option>


              {operacionesDisponibles.map(
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


            <select
              value={
                filtroInspector
              }
              onChange={(event) =>
                setFiltroInspector(
                  event.target.value
                )
              }
            >

              <option value="Todos">
                Todos los inspectores
              </option>


              {inspectoresDisponibles.map(
                (inspector) => (

                  <option
                    key={inspector}
                    value={inspector}
                  >
                    {inspector}
                  </option>

                )
              )}

            </select>

          </div>

        </div>


        {/* ==================================
            ERROR
        ================================== */}

        {error && (

          <div
            style={{
              margin: "0 0 16px",
              padding: "12px 15px",
              borderRadius: "10px",
              background:
                "rgba(255, 226, 229, 0.95)",
              color: "#b4232c",
            }}
          >
            {error}
          </div>

        )}


        {/* ==================================
            TÍTULO
        ================================== */}

        <div className="inspection-table-title">

          <ClipboardList size={23} />

          <h2>
            Listado de inspecciones
          </h2>

        </div>


        {/* ==================================
            TABLA
        ================================== */}

        <div className="table-responsive">

          <table className="talassa-table">

            <thead>

              <tr>

                <th>
                  Código
                </th>

                <th>
                  Operación
                </th>

                <th>
                  Contenedor
                </th>

                <th>
                  Fecha
                </th>

                <th>
                  Inspector
                </th>

                <th>
                  Estado
                </th>

                <th>
                  Acciones
                </th>

              </tr>

            </thead>


            <tbody>


              {cargando && (

                <tr>

                  <td
                    colSpan="7"
                    className="inspection-empty"
                  >
                    Cargando inspecciones...
                  </td>

                </tr>

              )}


              {!cargando &&
                inspeccionesFiltradas.map(
                  (inspeccion) => (

                    <tr
                      key={
                        inspeccion.id_inspeccion
                      }
                    >


                      <td>

                        <strong className="inspection-code">

                          {
                            inspeccion.codigo
                          }

                        </strong>

                      </td>


                      <td>

                        {
                          inspeccion.operacion ||
                          "-"
                        }

                      </td>


                      <td>

                        {
                          inspeccion.contenedor ||
                          "-"
                        }

                      </td>


                      <td>

                        <div className="inspection-date">

                          <span>

                            {
                              obtenerFecha(
                                inspeccion.fecha_inspeccion ||
                                inspeccion.fecha_hora
                              )
                            }

                          </span>


                          <small>

                            {
                              obtenerHora(
                                inspeccion.fecha_inspeccion ||
                                inspeccion.fecha_hora
                              )
                            }

                          </small>

                        </div>

                      </td>


                      <td>

                        {
                          inspeccion.inspector ||
                          "-"
                        }

                      </td>


                      <td>

                        <span
                          className={`
                            status-pill
                            ${obtenerClaseInspeccion(
                            inspeccion.estado
                          )}
                          `}
                        >

                          <span />

                          {
                            inspeccion.estado
                          }

                        </span>

                      </td>


                      <td>

                        <div className="action-buttons">


                          {/* VER */}

                          <button
                            type="button"
                            title="Ver inspección"
                            onClick={() =>
                              verInspeccion(
                                inspeccion
                              )
                            }
                          >
                            <Eye size={17} />
                          </button>


                          {/* EDITAR */}

                          <button
                            type="button"
                            title="Editar inspección"
                            onClick={() =>
                              editarInspeccion(
                                inspeccion
                              )
                            }
                          >
                            <Edit3 size={17} />
                          </button>


                          {/* ELIMINAR */}

                          <button
                            type="button"
                            title="Eliminar inspección"
                            className="action-delete"
                            onClick={() =>
                              setInspeccionAEliminar(
                                inspeccion
                              )
                            }
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}


              {!cargando &&
                inspeccionesFiltradas.length ===
                0 && (

                  <tr>

                    <td
                      colSpan="7"
                      className="inspection-empty"
                    >
                      No se encontraron inspecciones
                      con los filtros seleccionados.
                    </td>

                  </tr>

                )}

            </tbody>

          </table>

        </div>


        {/* ==================================
            FOOTER
        ================================== */}

        <div className="table-footer">

          <span>

            Mostrando{" "}

            {
              inspeccionesFiltradas.length
            }

            {" "}de{" "}

            {
              inspecciones.length
            }

            {" "}inspecciones

          </span>


          <div className="pagination">

            <button className="active">
              1
            </button>

          </div>

        </div>

      </div>

      <ConfirmDeleteModal
        abierto={
          Boolean(
            inspeccionAEliminar
          )
        }
        titulo="Eliminar inspección"
        mensaje="¿Confirmas que deseas eliminar esta inspección?"
        nombre={
          inspeccionAEliminar
            ? inspeccionAEliminar.codigo
            : ""
        }
        onCancelar={() =>
          setInspeccionAEliminar(
            null
          )
        }
        onConfirmar={
          confirmarEliminarInspeccion
        }
      />
    </section>
  );
}


export default InspeccionesPage;