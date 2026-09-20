import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  eliminarIncidencia as eliminarIncidenciaApi,
  obtenerIncidencias,
} from "../../services/incidenciasService.js";

import "../../styles/incidencias.css";


function clasePrioridad(
  prioridad
) {
  switch (prioridad) {
    case "Alta":
      return "incident-priority-high";

    case "Media":
      return "incident-priority-medium";

    case "Baja":
      return "incident-priority-low";

    default:
      return "";
  }
}


function claseEstado(
  estado
) {
  switch (estado) {
    case "Abierta":
      return "incident-status-open";

    case "En revisión":
      return "incident-status-review";

    case "Resuelta":
      return "incident-status-resolved";

    case "Cerrada":
      return "incident-status-closed";

    default:
      return "";
  }
}


function formatearFecha(
  valor
) {
  if (!valor) {
    return {
      fecha: "-",
      hora: "",
    };
  }

  const fecha =
    new Date(valor);

  return {
    fecha:
      fecha.toLocaleDateString(
        "es-SV"
      ),

    hora:
      fecha.toLocaleTimeString(
        "es-SV",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }
      ),
  };
}


function IncidenciasPage() {
  const navigate =
    useNavigate();


  const [
    incidencias,
    setIncidencias,
  ] = useState([]);


  const [
    busqueda,
    setBusqueda,
  ] = useState("");


  const [
    filtroOperacion,
    setFiltroOperacion,
  ] = useState("Todas");


  const [
    filtroPrioridad,
    setFiltroPrioridad,
  ] = useState("Todas");


  const [
    filtroEstado,
    setFiltroEstado,
  ] = useState("Todos");


  const [
    cargando,
    setCargando,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  async function cargarIncidencias() {
    try {
      setCargando(true);

      setError("");


      const respuesta =
        await obtenerIncidencias();


      if (!respuesta.ok) {
        throw new Error(
          respuesta.mensaje
        );
      }


      setIncidencias(
        respuesta.datos ||
        []
      );

    } catch (error) {
      setError(
        error.response?.data?.mensaje ||
        error.message ||
        "No fue posible cargar las incidencias."
      );

    } finally {
      setCargando(false);
    }
  }


  useEffect(() => {
    cargarIncidencias();
  }, []);


  const operaciones =
    useMemo(
      () => [
        ...new Set(
          incidencias
            .map(
              (item) =>
                item.operacion
            )
            .filter(Boolean)
        ),
      ],
      [incidencias]
    );


  const filtradas =
    useMemo(() => {

      const texto =
        busqueda
          .trim()
          .toLowerCase();


      return incidencias.filter(
        (item) => {

          const coincideTexto =
            (item.codigo || "")
              .toLowerCase()
              .includes(texto) ||

            (item.operacion || "")
              .toLowerCase()
              .includes(texto) ||

            (item.descripcion || "")
              .toLowerCase()
              .includes(texto) ||

            (item.responsable || "")
              .toLowerCase()
              .includes(texto);


          return (
            coincideTexto &&

            (
              filtroOperacion ===
                "Todas" ||
              item.operacion ===
                filtroOperacion
            ) &&

            (
              filtroPrioridad ===
                "Todas" ||
              item.prioridad ===
                filtroPrioridad
            ) &&

            (
              filtroEstado ===
                "Todos" ||
              item.estado ===
                filtroEstado
            )
          );
        }
      );

    }, [
      incidencias,
      busqueda,
      filtroOperacion,
      filtroPrioridad,
      filtroEstado,
    ]);


  const abiertas =
    incidencias.filter(
      (item) =>
        item.estado ===
        "Abierta"
    ).length;


  const revision =
    incidencias.filter(
      (item) =>
        item.estado ===
        "En revisión"
    ).length;


  const resueltas =
    incidencias.filter(
      (item) =>
        item.estado ===
        "Resuelta"
    ).length;


  async function eliminar(
    incidencia
  ) {
    const confirmado =
      window.confirm(
        `¿Deseas eliminar ${incidencia.codigo}?`
      );


    if (!confirmado) {
      return;
    }


    try {
      await eliminarIncidenciaApi(
        incidencia.id_incidencia
      );

      await cargarIncidencias();

    } catch (error) {
      window.alert(
        error.response?.data?.mensaje ||
        "No fue posible eliminar la incidencia."
      );
    }
  }


  return (
    <section className="incidencias-page">

      <div className="page-heading">

        <div>

          <h1>
            Incidencias
          </h1>

          <p>
            Consulta, filtra y da seguimiento
            a los eventos que requieren atención
            operativa.
          </p>

        </div>


        <button
          className="button button-primary"
          type="button"
          onClick={() =>
            navigate(
              "/incidencias/nueva"
            )
          }
        >
          <Plus size={19} />
          Nueva incidencia
        </button>

      </div>


      <div className="incident-stats-grid">

        <article className="stat-card">
          <AlertTriangle size={28} />

          <div>
            <span>
              Total de incidencias
            </span>

            <strong>
              {incidencias.length}
            </strong>

            <small>
              Registros encontrados
            </small>
          </div>
        </article>


        <article className="stat-card">
          <AlertTriangle size={28} />

          <div>
            <span>Abiertas</span>

            <strong>
              {abiertas}
            </strong>

            <small>
              Requieren atención
            </small>
          </div>
        </article>


        <article className="stat-card">
          <Clock3 size={28} />

          <div>
            <span>
              En revisión
            </span>

            <strong>
              {revision}
            </strong>

            <small>
              En seguimiento
            </small>
          </div>
        </article>


        <article className="stat-card">
          <CheckCircle2 size={28} />

          <div>
            <span>
              Resueltas
            </span>

            <strong>
              {resueltas}
            </strong>

            <small>
              Con solución registrada
            </small>
          </div>
        </article>

      </div>


      <div className="glass-card table-card">

        <div className="incident-filters">

          <div className="search-control">
            <Search size={18} />

            <input
              placeholder="Buscar incidencia..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(
                  e.target.value
                )
              }
            />
          </div>


          <select
            value={filtroOperacion}
            onChange={(e) =>
              setFiltroOperacion(
                e.target.value
              )
            }
          >
            <option value="Todas">
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


          <select
            value={filtroPrioridad}
            onChange={(e) =>
              setFiltroPrioridad(
                e.target.value
              )
            }
          >
            <option value="Todas">
              Todas las prioridades
            </option>

            <option value="Alta">
              Alta
            </option>

            <option value="Media">
              Media
            </option>

            <option value="Baja">
              Baja
            </option>
          </select>


          <select
            value={filtroEstado}
            onChange={(e) =>
              setFiltroEstado(
                e.target.value
              )
            }
          >
            <option value="Todos">
              Todos los estados
            </option>

            <option value="Abierta">
              Abierta
            </option>

            <option value="En revisión">
              En revisión
            </option>

            <option value="Resuelta">
              Resuelta
            </option>

            <option value="Cerrada">
              Cerrada
            </option>
          </select>

        </div>


        {error && (
          <div className="form-error">
            {error}
          </div>
        )}


        <div className="table-responsive">

          <table className="talassa-table">

            <thead>
              <tr>
                <th>Código</th>
                <th>Operación</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Responsable</th>
                <th>Acciones</th>
              </tr>
            </thead>


            <tbody>

              {cargando && (
                <tr>
                  <td colSpan="7">
                    Cargando incidencias...
                  </td>
                </tr>
              )}


              {!cargando &&
                filtradas.map(
                  (item) => {

                    const fecha =
                      formatearFecha(
                        item.fecha_reporte
                      );

                    return (
                      <tr
                        key={
                          item.id_incidencia
                        }
                      >

                        <td>
                          <strong>
                            {item.codigo}
                          </strong>
                        </td>


                        <td>
                          {item.operacion}
                        </td>


                        <td>
                          <span
                            className={`status-pill ${clasePrioridad(
                              item.prioridad
                            )}`}
                          >
                            <span />
                            {item.prioridad}
                          </span>
                        </td>


                        <td>
                          <span
                            className={`status-pill ${claseEstado(
                              item.estado
                            )}`}
                          >
                            <span />
                            {item.estado}
                          </span>
                        </td>


                        <td>
                          <div>
                            {fecha.fecha}

                            <small
                              style={{
                                display:
                                  "block",
                              }}
                            >
                              {fecha.hora}
                            </small>
                          </div>
                        </td>


                        <td>
                          {item.responsable ||
                            "Sin responsable"}
                        </td>


                        <td>

                          <div className="action-buttons">

                            {/* OJO = SOLO VER */}

                            <button
                              type="button"
                              title="Ver incidencia"
                              onClick={() =>
                                navigate(
                                  `/incidencias/${item.id_incidencia}`
                                )
                              }
                            >
                              <Eye size={17} />
                            </button>


                            {/* LÁPIZ = EDITAR */}

                            <button
                              type="button"
                              title="Editar incidencia"
                              onClick={() =>
                                navigate(
                                  `/incidencias/${item.id_incidencia}/editar`
                                )
                              }
                            >
                              <Edit3 size={17} />
                            </button>


                            <button
                              type="button"
                              title="Eliminar incidencia"
                              className="action-delete"
                              onClick={() =>
                                eliminar(
                                  item
                                )
                              }
                            >
                              <Trash2 size={17} />
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

            </tbody>

          </table>

        </div>


        <div className="table-footer">
          Mostrando {filtradas.length} de{" "}
          {incidencias.length} registros
        </div>

      </div>

    </section>
  );
}


export default IncidenciasPage;