import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Anchor,
  Edit3,
  Eye,
  Plus,
  Search,
  Ship,
  Trash2,
  Wrench,
} from "lucide-react";

import {
  eliminarMuelle as eliminarMuelleApi,
  obtenerMuelles,
} from "../../services/muellesService.js";

import "../../styles/muelles.css";


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


function MuellesPage() {
  const navigate =
    useNavigate();


  /* ======================================
     ESTADOS
  ====================================== */

  const [
    muelles,
    setMuelles,
  ] = useState([]);


  const [
    busqueda,
    setBusqueda,
  ] = useState("");


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


  /* ======================================
     CARGAR MUELLES
  ====================================== */

  async function cargarMuelles() {
    try {
      setCargando(true);

      setError("");


      const respuesta =
        await obtenerMuelles();


      if (!respuesta.ok) {
        throw new Error(
          respuesta.mensaje ||
          "No fue posible cargar los muelles."
        );
      }


      setMuelles(
        respuesta.datos || []
      );

    } catch (error) {
      console.error(
        "Error al cargar muelles:",
        error
      );


      setError(
        error.response?.data?.mensaje ||
        error.message ||
        "No fue posible cargar los muelles."
      );

    } finally {
      setCargando(false);
    }
  }


  /* ======================================
     CARGA INICIAL
  ====================================== */

  useEffect(() => {
    cargarMuelles();
  }, []);


  /* ======================================
     FILTRAR
  ====================================== */

  const muellesFiltrados =
    useMemo(() => {

      return muelles.filter(
        (muelle) => {

          const texto =
            busqueda
              .trim()
              .toLowerCase();


          const coincideBusqueda =
            muelle.codigo
              ?.toLowerCase()
              .includes(texto) ||

            muelle.nombre
              ?.toLowerCase()
              .includes(texto) ||

            (muelle.operacion || "")
              .toLowerCase()
              .includes(texto) ||

            (muelle.buque || "")
              .toLowerCase()
              .includes(texto);


          const coincideEstado =
            filtroEstado === "Todos" ||
            muelle.estado_operativo ===
              filtroEstado;


          return (
            coincideBusqueda &&
            coincideEstado
          );
        }
      );

    }, [
      muelles,
      busqueda,
      filtroEstado,
    ]);


  /* ======================================
     CONTADORES
  ====================================== */

  const totalMuelles =
    muelles.length;


  const disponibles =
    muelles.filter(
      (muelle) =>
        muelle.estado_operativo ===
        "Disponible"
    ).length;




  const mantenimiento =
    muelles.filter(
      (muelle) =>
        muelle.estado_operativo ===
        "Mantenimiento"
    ).length;


  /* ======================================
     VER
  ====================================== */

  function verMuelle(
    muelle
  ) {
    navigate(
      `/muelles/${muelle.id_muelle}/ver`
    );
  }


  /* ======================================
     EDITAR
  ====================================== */

  function editarMuelle(
    muelle
  ) {
    navigate(
      `/muelles/${muelle.id_muelle}/editar`
    );
  }


  /* ======================================
     ELIMINAR
  ====================================== */

  async function eliminarMuelle(
    muelle
  ) {
    const confirmado =
      window.confirm(
        `¿Deseas eliminar ${muelle.codigo} - ${muelle.nombre}?`
      );


    if (!confirmado) {
      return;
    }


    try {
      setError("");


      const respuesta =
        await eliminarMuelleApi(
          muelle.id_muelle
        );


      if (!respuesta.ok) {
        throw new Error(
          respuesta.mensaje ||
          "No fue posible eliminar el muelle."
        );
      }


      await cargarMuelles();


      window.alert(
        respuesta.mensaje ||
        "Muelle eliminado correctamente."
      );

    } catch (error) {
      console.error(
        "Error al eliminar muelle:",
        error
      );


      const mensaje =
        error.response?.data?.mensaje ||
        error.message ||
        "No fue posible eliminar el muelle.";


      setError(
        mensaje
      );


      window.alert(
        mensaje
      );
    }
  }


  return (
    <section className="muelles-page">


      {/* ==================================
          ENCABEZADO
      ================================== */}

      <div className="page-heading">

        <div>

          <h1>
            Muelles
          </h1>

          <p>
            Consulta el estado operativo y la
            disponibilidad de los muelles del
            puerto.
          </p>

        </div>


        <button
          type="button"
          className="button button-primary"
          onClick={() =>
            navigate(
              "/muelles/nuevo"
            )
          }
        >
          <Plus size={20} />

          Registrar muelle
        </button>

      </div>


      {/* ==================================
          ESTADÍSTICAS
      ================================== */}

      <div className="muelle-stats-grid">


        <article className="stat-card">

          <div className="stat-icon stat-blue">
            <Anchor size={27} />
          </div>

          <div>

            <span>
              Total de muelles
            </span>

            <strong>
              {totalMuelles}
            </strong>

            <small>
              Recursos registrados
            </small>

          </div>

        </article>


        <article className="stat-card">

          <div className="stat-icon stat-green">
            <Anchor size={27} />
          </div>

          <div>

            <span>
              Disponibles
            </span>

            <strong>
              {disponibles}
            </strong>

            <small>
              Listos para asignación
            </small>

          </div>

        </article>


        


        <article className="stat-card">

          <div className="stat-icon stat-amber">
            <Wrench size={27} />
          </div>

          <div>

            <span>
              En mantenimiento
            </span>

            <strong>
              {mantenimiento}
            </strong>

            <small>
              Temporalmente no disponibles
            </small>

          </div>

        </article>

      </div>


      {/* ==================================
          TABLA
      ================================== */}

      <div
        className="
          glass-card
          table-card
          muelles-table-card
        "
      >


        {/* TOOLBAR */}

        <div className="table-toolbar">

          <h2>
            <Anchor size={22} />

            Listado de muelles
          </h2>


          <div className="table-filters">


            {/* BUSCAR */}

            <div className="search-control">

              <Search size={18} />

              <input
                type="text"
                placeholder="Buscar muelle..."
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(
                    event.target.value
                  )
                }
              />

            </div>


            {/* FILTRO */}

            <select
              value={filtroEstado}
              onChange={(event) =>
                setFiltroEstado(
                  event.target.value
                )
              }
            >

              <option value="Todos">
                Todos los estados
              </option>

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

        </div>


        {/* ==================================
            ERROR
        ================================== */}

        {error && (

          <div
            style={{
              marginBottom: "14px",
              padding: "12px 14px",
              borderRadius: "10px",
              background:
                "rgba(255, 226, 229, 0.92)",
              color: "#b4232c",
              fontSize: "13px",
            }}
          >
            {error}
          </div>

        )}


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
                  Nombre
                </th>

                <th>
                  Estado
                </th>

                <th>
                  Longitud máxima
                </th>

                <th>
                  Calado máximo
                </th>

                <th>
                  Operación / Buque asociado
                </th>

                <th>
                  Acciones
                </th>

              </tr>

            </thead>


            <tbody>


              {/* CARGANDO */}

              {cargando && (

                <tr>

                  <td
                    colSpan="7"
                    className="muelle-empty-table"
                  >
                    Cargando muelles...
                  </td>

                </tr>

              )}


              {/* REGISTROS */}

              {!cargando &&
                muellesFiltrados.map(
                  (muelle) => (

                    <tr
                      key={
                        muelle.id_muelle
                      }
                    >


                      {/* CÓDIGO */}

                      <td>

                        <div className="muelle-code-cell">

                          <div className="muelle-icon">

                            <Anchor
                              size={18}
                            />

                          </div>


                          <strong>
                            {muelle.codigo}
                          </strong>

                        </div>

                      </td>


                      {/* NOMBRE */}

                      <td>

                        <strong className="muelle-name">

                          {muelle.nombre}

                        </strong>

                      </td>


                      {/* ESTADO */}

                      <td>

                        <span
                          className={`
                            status-pill
                            ${obtenerClaseEstado(
                              muelle.estado_operativo
                            )}
                          `}
                        >

                          <span />

                          {
                            muelle.estado_operativo
                          }

                        </span>

                      </td>


                      {/* LONGITUD */}

                      <td>

                        {
                          Number(
                            muelle.longitud_maxima
                          )
                        } m

                      </td>


                      {/* CALADO */}

                      <td>

                        {
                          Number(
                            muelle.calado_maximo
                          )
                        } m

                      </td>


                      {/* OPERACIÓN */}

                      <td>

                        {muelle.operacion ? (

                          <div className="muelle-operation">

                            <strong>
                              {
                                muelle.operacion
                              }
                            </strong>

                            <span>
                              {
                                muelle.buque ||
                                "Buque no disponible"
                              }
                            </span>

                          </div>

                        ) : (

                          <span className="muelle-no-operation">

                            No asignado

                          </span>

                        )}

                      </td>


                      {/* ACCIONES */}

                      <td>

                        <div className="action-buttons">


                          {/* VER */}

                          <button
                            type="button"
                            title="Ver muelle"
                            onClick={() =>
                              verMuelle(
                                muelle
                              )
                            }
                          >
                            <Eye size={17} />
                          </button>


                          {/* EDITAR */}

                          <button
                            type="button"
                            title="Editar muelle"
                            onClick={() =>
                              editarMuelle(
                                muelle
                              )
                            }
                          >
                            <Edit3 size={17} />
                          </button>


                          {/* ELIMINAR */}

                          <button
                            type="button"
                            title="Eliminar muelle"
                            className="action-delete"
                            onClick={() =>
                              eliminarMuelle(
                                muelle
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


              {/* SIN RESULTADOS */}

              {!cargando &&
                muellesFiltrados.length ===
                  0 && (

                  <tr>

                    <td
                      colSpan="7"
                      className="muelle-empty-table"
                    >
                      No se encontraron muelles
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
              muellesFiltrados.length
            }

            {" "}de{" "}

            {
              totalMuelles
            }

            {" "}muelles

          </span>


          <div className="pagination">

            <button className="active">
              1
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}


export default MuellesPage;