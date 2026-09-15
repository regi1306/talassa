import {
  Activity,
  CalendarDays,
  Eye,
  FileClock,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import "../../styles/auditoria.css";


/* ======================================
   DATOS TEMPORALES

   Más adelante serán reemplazados
   por datos provenientes de la API.
====================================== */

const registrosIniciales = [
  {
    id_auditoria: 1,
    usuario: "Carlos Romero",
    rol: "Operador portuario",
    accion: "Actualización",
    modulo: "Operaciones",
    registro: "OP-052",
    descripcion:
      "Se asignó el muelle M-03 a la operación OP-052.",
    fecha: "2026-09-15",
    hora: "08:17",
    ip: "192.168.10.25",
  },
  {
    id_auditoria: 2,
    usuario: "Regina Cadenas",
    rol: "Administrador",
    accion: "Creación",
    modulo: "Usuarios",
    registro: "USR-024",
    descripcion:
      "Se registró una nueva cuenta de usuario.",
    fecha: "2026-09-15",
    hora: "07:42",
    ip: "192.168.10.10",
  },
  {
    id_auditoria: 3,
    usuario: "María López",
    rol: "Inspector",
    accion: "Registro",
    modulo: "Inspecciones",
    registro: "INS-001",
    descripcion:
      "Se registró una inspección asociada a la operación OP-052.",
    fecha: "2026-09-14",
    hora: "16:30",
    ip: "192.168.10.42",
  },
  {
    id_auditoria: 4,
    usuario: "Regina Cadenas",
    rol: "Administrador",
    accion: "Actualización",
    modulo: "Empresas",
    registro: "EMP-003",
    descripcion:
      "Se actualizó la información general de la empresa.",
    fecha: "2026-09-14",
    hora: "14:06",
    ip: "192.168.10.10",
  },
  {
    id_auditoria: 5,
    usuario: "Sofía Torres",
    rol: "Inspector",
    accion: "Registro",
    modulo: "Incidencias",
    registro: "INC-014",
    descripcion:
      "Se registró una incidencia durante una operación portuaria.",
    fecha: "2026-09-13",
    hora: "11:18",
    ip: "192.168.10.51",
  },
  {
    id_auditoria: 6,
    usuario: "Carlos Romero",
    rol: "Operador portuario",
    accion: "Creación",
    modulo: "Operaciones",
    registro: "OP-053",
    descripcion:
      "Se creó una nueva operación portuaria.",
    fecha: "2026-09-13",
    hora: "09:25",
    ip: "192.168.10.25",
  },
  {
    id_auditoria: 7,
    usuario: "Regina Cadenas",
    rol: "Administrador",
    accion: "Cambio de estado",
    modulo: "Catálogos",
    registro: "CAT-018",
    descripcion:
      "Se desactivó un registro del catálogo de tipos de carga.",
    fecha: "2026-09-12",
    hora: "15:47",
    ip: "192.168.10.10",
  },
  {
    id_auditoria: 8,
    usuario: "Carlos Romero",
    rol: "Operador portuario",
    accion: "Actualización",
    modulo: "Buques",
    registro: "BUQ-008",
    descripcion:
      "Se actualizaron las características físicas del buque.",
    fecha: "2026-09-12",
    hora: "10:03",
    ip: "192.168.10.25",
  },
];


function AuditoriaPage() {
  const navigate = useNavigate();


  const [
    registros,
    setRegistros,
  ] = useState(registrosIniciales);


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
  ] = useState(false);


  /* ======================================
     OPCIONES DE FILTROS
  ====================================== */

  const usuarios = useMemo(() => {
    return [
      ...new Set(
        registros.map(
          (registro) =>
            registro.usuario
        )
      ),
    ].sort();
  }, [registros]);


  const modulos = useMemo(() => {
    return [
      ...new Set(
        registros.map(
          (registro) =>
            registro.modulo
        )
      ),
    ].sort();
  }, [registros]);


  const acciones = useMemo(() => {
    return [
      ...new Set(
        registros.map(
          (registro) =>
            registro.accion
        )
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
          const coincideBusqueda =
            !texto ||
            registro.usuario
              .toLowerCase()
              .includes(texto) ||
            registro.registro
              .toLowerCase()
              .includes(texto) ||
            registro.descripcion
              .toLowerCase()
              .includes(texto) ||
            registro.ip
              .toLowerCase()
              .includes(texto);


          const coincideUsuario =
            !filtroUsuario ||
            registro.usuario ===
              filtroUsuario;


          const coincideModulo =
            !filtroModulo ||
            registro.modulo ===
              filtroModulo;


          const coincideAccion =
            !filtroAccion ||
            registro.accion ===
              filtroAccion;


          const coincideFecha =
            !filtroFecha ||
            registro.fecha ===
              filtroFecha;


          return (
            coincideBusqueda &&
            coincideUsuario &&
            coincideModulo &&
            coincideAccion &&
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

  const registrosHoy =
    registros.filter(
      (registro) =>
        registro.fecha ===
        "2026-09-15"
    ).length;


  const usuariosUnicos =
    new Set(
      registros.map(
        (registro) =>
          registro.usuario
      )
    ).size;


  const modulosRegistrados =
    new Set(
      registros.map(
        (registro) =>
          registro.modulo
      )
    ).size;


  function limpiarFiltros() {
    setBusqueda("");
    setFiltroUsuario("");
    setFiltroModulo("");
    setFiltroAccion("");
    setFiltroFecha("");
  }


  function actualizarAuditoria() {
    setCargando(true);


    setTimeout(() => {
      setRegistros([
        ...registrosIniciales,
      ]);

      setCargando(false);
    }, 500);
  }


  function formatearFecha(fecha) {
    return new Intl.DateTimeFormat(
      "es-SV",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(
      new Date(
        `${fecha}T12:00:00`
      )
    );
  }


  function claseAccion(
    accion
  ) {
    switch (accion) {
      case "Creación":
        return "creacion";

      case "Registro":
        return "registro";

      case "Cambio de estado":
        return "estado";

      default:
        return "actualizacion";
    }
  }


  return (
    <section className="pagina-auditoria">

      {/* ======================================
          FONDO
      ====================================== */}

      <div className="fondo-auditoria" />


      {/* ======================================
          ENCABEZADO
      ====================================== */}

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
            actualizarAuditoria
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


      {/* ======================================
          RESUMEN
      ====================================== */}

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


      {/* ======================================
          LISTADO
      ====================================== */}

      <article className="glass-card tarjeta-listado-auditoria">

        <div className="encabezado-listado-auditoria">

          <div>

            <h2>
              <FileClock size={21} />

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


        {/* ======================================
            FILTROS
        ====================================== */}

        <div className="filtros-auditoria">

          <div className="buscador-auditoria">

            <Search size={18} />


            <input
              type="text"
              value={busqueda}
              onChange={(evento) =>
                setBusqueda(
                  evento.target.value
                )
              }
              placeholder="Buscar usuario, registro, descripción o IP..."
            />

          </div>


          <div className="campo-filtro-auditoria">

            <UserRound size={16} />


            <select
              value={filtroUsuario}
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
                    key={usuario}
                    value={usuario}
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
              value={filtroModulo}
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
              value={filtroAccion}
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
              value={filtroFecha}
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
            onClick={limpiarFiltros}
          >
            Limpiar
          </button>

        </div>


        {/* ======================================
            CARGANDO
        ====================================== */}

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


        {/* ======================================
            TABLA
        ====================================== */}

        {!cargando && (

          <div className="contenedor-tabla-auditoria">

            <table className="tabla-auditoria">

              <thead>

                <tr>
                  <th>Fecha y hora</th>
                  <th>Usuario</th>
                  <th>Acción</th>
                  <th>Módulo</th>
                  <th>Registro</th>
                  <th>Dirección IP</th>
                  <th>Detalle</th>
                </tr>

              </thead>


              <tbody>

                {registrosFiltrados.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
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
                              {registro.hora}
                            </small>

                          </div>

                        </td>


                        <td>

                          <div className="usuario-auditoria">

                            <div className="avatar-auditoria">

                              {registro.usuario
                                .split(" ")
                                .map(
                                  (parte) =>
                                    parte[0]
                                )
                                .slice(0, 2)
                                .join("")}

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
                            {registro.registro}
                          </strong>

                        </td>


                        <td>
                          {registro.ip}
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