import {
  Activity,
  CalendarDays,
  Eye,
  FileClock,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  TriangleAlert,
  UserRound,
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
  listarAuditoria,
} from "../../services/auditoria.service.js";

import {
  cerrarSesion,
} from "../../services/auth.service.js";

import "../../styles/auditoria.css";


/* ======================================
   FECHA LOCAL YYYY-MM-DD
====================================== */

function obtenerFechaLocal(
  fecha
) {
  if (!fecha) {
    return "";
  }


  const valor =
    new Date(fecha);


  if (
    Number.isNaN(
      valor.getTime()
    )
  ) {
    return "";
  }


  const anio =
    valor.getFullYear();


  const mes =
    String(
      valor.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const dia =
    String(
      valor.getDate()
    ).padStart(
      2,
      "0"
    );


  return `${anio}-${mes}-${dia}`;
}


/* ======================================
   FORMATO DE FECHA
====================================== */

function formatearFecha(
  fecha
) {
  if (!fecha) {
    return "—";
  }


  const valor =
    new Date(fecha);


  if (
    Number.isNaN(
      valor.getTime()
    )
  ) {
    return "—";
  }


  return new Intl.DateTimeFormat(
    "es-SV",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(valor);
}


/* ======================================
   FORMATO DE HORA
====================================== */

function formatearHora(
  fecha
) {
  if (!fecha) {
    return "—";
  }


  const valor =
    new Date(fecha);


  if (
    Number.isNaN(
      valor.getTime()
    )
  ) {
    return "—";
  }


  return new Intl.DateTimeFormat(
    "es-SV",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(valor);
}


/* ======================================
   CLASE SEGÚN ACCIÓN
====================================== */

function claseAccion(
  accion
) {
  const texto =
    String(
      accion || ""
    ).toLowerCase();


  if (
    texto.includes("crea")
  ) {
    return "creacion";
  }


  if (
    texto.includes("login")
    ||
    texto.includes("inicio")
    ||
    texto.includes("registro")
  ) {
    return "registro";
  }


  if (
    texto.includes("estado")
    ||
    texto.includes("activ")
    ||
    texto.includes("desactiv")
  ) {
    return "estado";
  }


  return "actualizacion";
}


function AuditoriaPage() {
  const navigate =
    useNavigate();


  const [
    registros,
    setRegistros,
  ] = useState([]);


  const [
    busqueda,
    setBusqueda,
  ] = useState("");


  const [
    filtroUsuario,
    setFiltroUsuario,
  ] = useState("");


  const [
    filtroModulo,
    setFiltroModulo,
  ] = useState("");


  const [
    filtroAccion,
    setFiltroAccion,
  ] = useState("");


  const [
    filtroFecha,
    setFiltroFecha,
  ] = useState("");


  const [
    cargando,
    setCargando,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  /* ======================================
     CARGAR AUDITORÍA
  ====================================== */

  async function cargarAuditoria() {
    try {
      setCargando(true);

      setError("");


      const respuesta =
        await listarAuditoria();


      setRegistros(
        respuesta.data || []
      );


    } catch (error) {
      console.error(
        "Error al cargar auditoría:",
        error
      );


      if (
        error.response?.status ===
        401
      ) {
        cerrarSesion();


        navigate(
          "/login",
          {
            replace: true,
          }
        );


        return;
      }


      setError(
        error.response?.data?.message
        ||
        "No fue posible cargar la bitácora de auditoría."
      );


    } finally {
      setCargando(false);
    }
  }


  useEffect(() => {
    cargarAuditoria();
  }, []);


  /* ======================================
     OPCIONES DE FILTRO
  ====================================== */

  const usuarios =
    useMemo(() => {
      return [
        ...new Set(
          registros
            .map(
              (registro) =>
                registro.usuario
            )
            .filter(Boolean)
        ),
      ].sort();

    }, [registros]);


  const modulos =
    useMemo(() => {
      return [
        ...new Set(
          registros
            .map(
              (registro) =>
                registro.modulo
            )
            .filter(Boolean)
        ),
      ].sort();

    }, [registros]);


  const acciones =
    useMemo(() => {
      return [
        ...new Set(
          registros
            .map(
              (registro) =>
                registro.accion
            )
            .filter(Boolean)
        ),
      ].sort();

    }, [registros]);


  /* ======================================
     FILTRADO
  ====================================== */

  const registrosFiltrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();


      return registros.filter(
        (registro) => {
          const usuario =
            String(
              registro.usuario || ""
            ).toLowerCase();


          const idRegistro =
            String(
              registro.id_registro_afectado || ""
            ).toLowerCase();


          const descripcion =
            String(
              registro.descripcion || ""
            ).toLowerCase();


          const entidad =
            String(
              registro.entidad || ""
            ).toLowerCase();


          const accion =
            String(
              registro.accion || ""
            ).toLowerCase();


          const coincideBusqueda =
            !texto
            ||
            usuario.includes(
              texto
            )
            ||
            idRegistro.includes(
              texto
            )
            ||
            descripcion.includes(
              texto
            )
            ||
            entidad.includes(
              texto
            )
            ||
            accion.includes(
              texto
            );


          const coincideUsuario =
            !filtroUsuario
            ||
            registro.usuario ===
              filtroUsuario;


          const coincideModulo =
            !filtroModulo
            ||
            registro.modulo ===
              filtroModulo;


          const coincideAccion =
            !filtroAccion
            ||
            registro.accion ===
              filtroAccion;


          const coincideFecha =
            !filtroFecha
            ||
            obtenerFechaLocal(
              registro.fecha
            ) ===
              filtroFecha;


          return (
            coincideBusqueda
            &&
            coincideUsuario
            &&
            coincideModulo
            &&
            coincideAccion
            &&
            coincideFecha
          );
        }
      );

    }, [
      registros,
      busqueda,
      filtroUsuario,
      filtroModulo,
      filtroAccion,
      filtroFecha,
    ]);


  /* ======================================
     ESTADÍSTICAS
  ====================================== */

  const hoy =
    obtenerFechaLocal(
      new Date()
    );


  const registrosHoy =
    registros.filter(
      (registro) =>
        obtenerFechaLocal(
          registro.fecha
        ) === hoy
    ).length;


  const usuariosUnicos =
    new Set(
      registros
        .map(
          (registro) =>
            registro.usuario
        )
        .filter(Boolean)
    ).size;


  const modulosRegistrados =
    new Set(
      registros
        .map(
          (registro) =>
            registro.modulo
        )
        .filter(Boolean)
    ).size;


  function limpiarFiltros() {
    setBusqueda("");

    setFiltroUsuario("");

    setFiltroModulo("");

    setFiltroAccion("");

    setFiltroFecha("");
  }


  function obtenerIniciales(
    nombre
  ) {
    return String(
      nombre || "Sistema"
    )
      .split(" ")
      .filter(Boolean)
      .map(
        (parte) =>
          parte.charAt(0)
      )
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }


  return (
    <section className="pagina-auditoria">

      <div className="fondo-auditoria" />


      {/* ENCABEZADO */}

      <div className="encabezado-auditoria">

        <div>

          <h1>
            Auditoría
          </h1>


          <p>
            Consulta el historial de acciones
            realizadas por los usuarios dentro
            de TALASSA.
          </p>

        </div>


        <button
          type="button"
          className="boton-actualizar-auditoria-superior"
          onClick={
            cargarAuditoria
          }
          disabled={
            cargando
          }
        >

          <RefreshCw
            size={18}
            className={
              cargando
                ? "icono-girando-auditoria"
                : ""
            }
          />

          Actualizar

        </button>

      </div>


      {/* ERROR */}

      {error && (

        <div className="mensaje-error-auditoria">

          <TriangleAlert
            size={17}
          />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* RESUMEN */}

      <div className="resumen-auditoria">

        <article className="tarjeta-resumen-auditoria azul">

          <div className="icono-resumen-auditoria">
            <FileClock size={24} />
          </div>

          <div>

            <span>
              Total de eventos
            </span>

            <strong>
              {registros.length}
            </strong>

            <small>
              Registros almacenados
            </small>

          </div>

        </article>


        <article className="tarjeta-resumen-auditoria menta">

          <div className="icono-resumen-auditoria">
            <Activity size={24} />
          </div>

          <div>

            <span>
              Actividad de hoy
            </span>

            <strong>
              {registrosHoy}
            </strong>

            <small>
              Eventos del día
            </small>

          </div>

        </article>


        <article className="tarjeta-resumen-auditoria blanco">

          <div className="icono-resumen-auditoria">
            <UserRound size={24} />
          </div>

          <div>

            <span>
              Usuarios registrados
            </span>

            <strong>
              {usuariosUnicos}
            </strong>

            <small>
              Con actividad auditada
            </small>

          </div>

        </article>


        <article className="tarjeta-resumen-auditoria blanco">

          <div className="icono-resumen-auditoria">
            <ShieldCheck size={24} />
          </div>

          <div>

            <span>
              Módulos auditados
            </span>

            <strong>
              {modulosRegistrados}
            </strong>

            <small>
              Con eventos registrados
            </small>

          </div>

        </article>

      </div>


      {/* LISTADO */}

      <article className="glass-card tarjeta-listado-auditoria">

        <div className="encabezado-listado-auditoria">

          <div>

            <h2>

              <FileClock
                size={21}
              />

              Bitácora del sistema

            </h2>


            <span>

              {registrosFiltrados.length}

              {" "}

              resultado

              {registrosFiltrados.length !== 1
                ? "s"
                : ""}

            </span>

          </div>

        </div>


        {/* FILTROS */}

        <div className="filtros-auditoria">

          <div className="buscador-auditoria">

            <Search size={18} />


            <input
              type="text"
              value={
                busqueda
              }
              onChange={(evento) =>
                setBusqueda(
                  evento.target.value
                )
              }
              placeholder="Buscar usuario, registro o descripción..."
            />

          </div>


          <div className="campo-filtro-auditoria">

            <UserRound size={16} />


            <select
              value={
                filtroUsuario
              }
              onChange={(evento) =>
                setFiltroUsuario(
                  evento.target.value
                )
              }
            >

              <option value="">
                Todos los usuarios
              </option>


              {usuarios.map(
                (usuario) => (

                  <option
                    key={
                      usuario
                    }
                    value={
                      usuario
                    }
                  >
                    {usuario}
                  </option>

                )
              )}

            </select>

          </div>


          <div className="campo-filtro-auditoria">

            <Filter size={16} />


            <select
              value={
                filtroModulo
              }
              onChange={(evento) =>
                setFiltroModulo(
                  evento.target.value
                )
              }
            >

              <option value="">
                Todos los módulos
              </option>


              {modulos.map(
                (modulo) => (

                  <option
                    key={modulo}
                    value={modulo}
                  >
                    {modulo}
                  </option>

                )
              )}

            </select>

          </div>


          <div className="campo-filtro-auditoria">

            <select
              value={
                filtroAccion
              }
              onChange={(evento) =>
                setFiltroAccion(
                  evento.target.value
                )
              }
            >

              <option value="">
                Todas las acciones
              </option>


              {acciones.map(
                (accion) => (

                  <option
                    key={accion}
                    value={accion}
                  >
                    {accion}
                  </option>

                )
              )}

            </select>

          </div>


          <div className="campo-fecha-auditoria">

            <CalendarDays
              size={16}
            />


            <input
              type="date"
              value={
                filtroFecha
              }
              onChange={(evento) =>
                setFiltroFecha(
                  evento.target.value
                )
              }
            />

          </div>


          <button
            type="button"
            className="boton-limpiar-auditoria"
            onClick={
              limpiarFiltros
            }
          >
            Limpiar
          </button>

        </div>


        {/* CARGANDO */}

        {cargando && (

          <div className="estado-carga-auditoria">

            <RefreshCw
              size={24}
              className="icono-girando-auditoria"
            />

            <span>
              Actualizando bitácora...
            </span>

          </div>

        )}


        {/* TABLA */}

        {!cargando && (

          <div className="contenedor-tabla-auditoria">

            <table className="tabla-auditoria">

              <thead>

                <tr>

                  <th>
                    Fecha y hora
                  </th>

                  <th>
                    Usuario
                  </th>

                  <th>
                    Acción
                  </th>

                  <th>
                    Módulo
                  </th>

                  <th>
                    Registro
                  </th>

                  <th>
                    Detalle
                  </th>

                </tr>

              </thead>


              <tbody>

                {registrosFiltrados.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="tabla-sin-auditoria"
                    >
                      No se encontraron eventos
                      de auditoría.
                    </td>

                  </tr>

                ) : (

                  registrosFiltrados.map(
                    (registro) => (

                      <tr
                        key={
                          registro.id_auditoria
                        }
                      >

                        <td>

                          <div className="fecha-auditoria">

                            <strong>
                              {formatearFecha(
                                registro.fecha
                              )}
                            </strong>

                            <small>
                              {formatearHora(
                                registro.fecha
                              )}
                            </small>

                          </div>

                        </td>


                        <td>

                          <div className="usuario-auditoria">

                            <div className="avatar-auditoria">

                              {obtenerIniciales(
                                registro.usuario
                              )}

                            </div>


                            <div>

                              <strong>
                                {registro.usuario}
                              </strong>

                              <small>
                                {registro.rol}
                              </small>

                            </div>

                          </div>

                        </td>


                        <td>

                          <span
                            className={
                              `accion-auditoria ${claseAccion(
                                registro.accion
                              )}`
                            }
                          >
                            {registro.accion}
                          </span>

                        </td>


                        <td>

                          <span className="modulo-auditoria">
                            {registro.modulo}
                          </span>

                        </td>


                        <td>

                          <strong className="codigo-registro-auditoria">

                            {registro.id_registro_afectado
                              ||
                              "—"}

                          </strong>

                        </td>


                        <td>

                          <button
                            type="button"
                            className="boton-detalle-auditoria"
                            onClick={() =>
                              navigate(
                                `/auditoria/${registro.id_auditoria}`
                              )
                            }
                          >

                            <Eye size={16} />

                            Ver detalle

                          </button>

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


export default AuditoriaPage;