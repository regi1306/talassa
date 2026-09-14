import {
  Building2,
  Eye,
  Filter,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Ship,
  Tag,
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
  obtenerBuques,
} from "../../services/buquesService.js";

import "../../styles/buques.css";


function BuquesPage() {
  const navigate = useNavigate();

  const [buques, setBuques] = useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const [busqueda, setBusqueda] =
    useState("");

  const [filtroTipo, setFiltroTipo] =
    useState("");

  const [filtroEmpresa, setFiltroEmpresa] =
    useState("");

  const [filtroEstado, setFiltroEstado] =
    useState("");


  async function cargarBuques() {
    try {
      setCargando(true);
      setError("");

      const datos =
        await obtenerBuques();

      setBuques(datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }


  useEffect(() => {
    cargarBuques();
  }, []);


  const tiposBuque = useMemo(() => {
    return [
      ...new Set(
        buques.map(
          (buque) => buque.tipo_buque
        )
      ),
    ]
      .filter(Boolean)
      .sort();
  }, [buques]);


  const empresas = useMemo(() => {
    return [
      ...new Set(
        buques.map(
          (buque) => buque.empresa
        )
      ),
    ]
      .filter(Boolean)
      .sort();
  }, [buques]);


  const buquesFiltrados = useMemo(() => {
    const texto =
      busqueda
        .trim()
        .toLowerCase();

    return buques.filter((buque) => {
      const coincideBusqueda =
        !texto ||
        buque.nombre
          ?.toLowerCase()
          .includes(texto) ||
        buque.identificacion
          ?.toLowerCase()
          .includes(texto);

      const coincideTipo =
        !filtroTipo ||
        buque.tipo_buque === filtroTipo;

      const coincideEmpresa =
        !filtroEmpresa ||
        buque.empresa === filtroEmpresa;

      const coincideEstado =
        !filtroEstado ||
        String(buque.activo) ===
          filtroEstado;

      return (
        coincideBusqueda &&
        coincideTipo &&
        coincideEmpresa &&
        coincideEstado
      );
    });
  }, [
    buques,
    busqueda,
    filtroTipo,
    filtroEmpresa,
    filtroEstado,
  ]);


  const totalActivos =
    buques.filter(
      (buque) => buque.activo
    ).length;


  const totalInactivos =
    buques.length - totalActivos;


  function limpiarFiltros() {
    setBusqueda("");
    setFiltroTipo("");
    setFiltroEmpresa("");
    setFiltroEstado("");
  }


  function formatearMedida(valor) {
    if (
      valor === null ||
      valor === undefined ||
      valor === ""
    ) {
      return "—";
    }

    return `${Number(valor).toFixed(2)} m`;
  }


  return (
    <section className="pagina-buques">

      <div className="fondo-buques" />


      {/* ENCABEZADO */}

      <div className="encabezado-buques">

        <div>
          <h1>Buques</h1>

          <p>
            Gestión de embarcaciones registradas
            en TALASSA.
          </p>
        </div>


        <button
          type="button"
          className="boton-nuevo-buque"
          onClick={() =>
            navigate("/buques/nuevo")
          }
        >
          <Plus size={19} />
          Nuevo buque
        </button>

      </div>


      {/* INDICADORES */}

      <div className="resumen-buques">

        <article className="tarjeta-resumen-buque azul">
          <div className="icono-resumen-buque">
            <Ship size={24} />
          </div>

          <div>
            <span>
              Total registrados
            </span>

            <strong>
              {buques.length}
            </strong>

            <small>
              Embarcaciones en el sistema
            </small>
          </div>
        </article>


        <article className="tarjeta-resumen-buque menta">
          <div className="icono-resumen-buque">
            <Waves size={24} />
          </div>

          <div>
            <span>
              Buques activos
            </span>

            <strong>
              {totalActivos}
            </strong>

            <small>
              Habilitados actualmente
            </small>
          </div>
        </article>


        <article className="tarjeta-resumen-buque rojo">
          <div className="icono-resumen-buque">
            <Tag size={24} />
          </div>

          <div>
            <span>
              Buques inactivos
            </span>

            <strong>
              {totalInactivos}
            </strong>

            <small>
              Fuera de uso
            </small>
          </div>
        </article>


        <article className="tarjeta-resumen-buque azul">
          <div className="icono-resumen-buque">
            <Building2 size={24} />
          </div>

          <div>
            <span>
              Tipos registrados
            </span>

            <strong>
              {tiposBuque.length}
            </strong>

            <small>
              Tipos presentes
            </small>
          </div>
        </article>

      </div>


      {/* CONTENIDO PRINCIPAL */}

      <article className="glass-card tarjeta-listado-buques">

        <div className="encabezado-listado-buques">

          <div>
            <h2>
              <Ship size={21} />
              Listado de buques
            </h2>

            <span>
              {buquesFiltrados.length}
              {" "}
              resultado
              {buquesFiltrados.length !== 1
                ? "s"
                : ""}
            </span>
          </div>


          <button
            type="button"
            className="boton-actualizar-buques"
            onClick={cargarBuques}
          >
            <RefreshCw size={17} />
            Actualizar
          </button>

        </div>


        {/* FILTROS */}

        <div className="filtros-buques">

          <div className="buscador-buques">

            <Search size={18} />

            <input
              type="text"
              value={busqueda}
              onChange={(evento) =>
                setBusqueda(
                  evento.target.value
                )
              }
              placeholder="Buscar por nombre o identificación..."
            />

          </div>


          <div className="campo-filtro-buques">
            <Filter size={16} />

            <select
              value={filtroTipo}
              onChange={(evento) =>
                setFiltroTipo(
                  evento.target.value
                )
              }
            >
              <option value="">
                Todos los tipos
              </option>

              {tiposBuque.map((tipo) => (
                <option
                  key={tipo}
                  value={tipo}
                >
                  {tipo}
                </option>
              ))}
            </select>
          </div>


          <div className="campo-filtro-buques">

            <select
              value={filtroEmpresa}
              onChange={(evento) =>
                setFiltroEmpresa(
                  evento.target.value
                )
              }
            >
              <option value="">
                Todas las empresas
              </option>

              {empresas.map((empresa) => (
                <option
                  key={empresa}
                  value={empresa}
                >
                  {empresa}
                </option>
              ))}
            </select>
          </div>


          <div className="campo-filtro-buques">

            <select
              value={filtroEstado}
              onChange={(evento) =>
                setFiltroEstado(
                  evento.target.value
                )
              }
            >
              <option value="">
                Todos
              </option>

              <option value="true">
                Activos
              </option>

              <option value="false">
                Inactivos
              </option>
            </select>
          </div>


          <button
            type="button"
            className="boton-limpiar-filtros"
            onClick={limpiarFiltros}
          >
            Limpiar
          </button>

        </div>


        {/* ERROR */}

        {error && (
          <div className="mensaje-error-buques">
            {error}
          </div>
        )}


        {/* CARGANDO */}

        {cargando && (
          <div className="estado-listado-buques">
            <RefreshCw
              size={24}
              className="icono-cargando-buques"
            />

            <span>
              Cargando buques...
            </span>
          </div>
        )}


        {/* TABLA */}

        {!cargando && !error && (
          <div className="contenedor-tabla-buques">

            <table className="tabla-buques">

              <thead>
                <tr>
                  <th>Identificación</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Empresa</th>
                  <th>Bandera</th>
                  <th>Eslora</th>
                  <th>Manga</th>
                  <th>Calado</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>


              <tbody>

                {buquesFiltrados.length === 0 ? (

                  <tr>
                    <td
                      colSpan="10"
                      className="tabla-sin-buques"
                    >
                      No se encontraron buques.
                    </td>
                  </tr>

                ) : (

                  buquesFiltrados.map(
                    (buque) => (
                      <tr key={buque.id_buque}>

                        <td>
                          <span className="identificacion-buque">
                            {buque.identificacion}
                          </span>
                        </td>

                        <td>
                          <div className="nombre-buque-tabla">
                            <div className="icono-buque-tabla">
                              <Ship size={17} />
                            </div>

                            <strong>
                              {buque.nombre}
                            </strong>
                          </div>
                        </td>

                        <td>
                          {buque.tipo_buque}
                        </td>

                        <td>
                          {buque.empresa}
                        </td>

                        <td>
                          {buque.bandera || "—"}
                        </td>

                        <td>
                          {formatearMedida(
                            buque.eslora_m
                          )}
                        </td>

                        <td>
                          {formatearMedida(
                            buque.manga_m
                          )}
                        </td>

                        <td>
                          {formatearMedida(
                            buque.calado_m
                          )}
                        </td>

                        <td>
                          <span
                            className={
                              buque.activo
                                ? "estado-buque activo"
                                : "estado-buque inactivo"
                            }
                          >
                            <i />

                            {buque.activo
                              ? "Activo"
                              : "Inactivo"}
                          </span>
                        </td>

                        <td>
                          <div className="acciones-buque">

                            <button
                              type="button"
                              title="Ver detalle"
                              onClick={() =>
                                navigate(
                                  `/buques/${buque.id_buque}`
                                )
                              }
                            >
                              <Eye size={17} />
                            </button>

                            <button
                              type="button"
                              title="Editar buque"
                              onClick={() =>
                                navigate(
                                  `/buques/${buque.id_buque}/editar`
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


export default BuquesPage;