import {
  Eye,
  Filter,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  UserX,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import "../../styles/usuarios.css";


/* ======================================
   DATOS TEMPORALES

   Más adelante serán sustituidos
   por datos provenientes de la API.
====================================== */

const usuariosIniciales = [
  {
    id_usuario: 1,
    nombres: "Regina",
    apellidos: "Cadenas",
    correo: "regina.cadenas@talassa.com",
    usuario: "regina.cadenas",
    rol: "Administrador",
    activo: true,
    ultimo_acceso: "Hoy, 09:24",
  },
  {
    id_usuario: 2,
    nombres: "Carlos",
    apellidos: "Romero",
    correo: "carlos.romero@talassa.com",
    usuario: "carlos.romero",
    rol: "Operador portuario",
    activo: true,
    ultimo_acceso: "Hoy, 08:17",
  },
  {
    id_usuario: 3,
    nombres: "María",
    apellidos: "López",
    correo: "maria.lopez@talassa.com",
    usuario: "maria.lopez",
    rol: "Inspector",
    activo: true,
    ultimo_acceso: "Ayer, 17:36",
  },
  {
    id_usuario: 4,
    nombres: "José",
    apellidos: "Martínez",
    correo: "jose.martinez@talassa.com",
    usuario: "jose.martinez",
    rol: "Operador portuario",
    activo: false,
    ultimo_acceso: "Hace 5 días",
  },
  {
    id_usuario: 5,
    nombres: "Sofía",
    apellidos: "Torres",
    correo: "sofia.torres@talassa.com",
    usuario: "sofia.torres",
    rol: "Inspector",
    activo: true,
    ultimo_acceso: "Hoy, 11:03",
  },
  {
    id_usuario: 6,
    nombres: "Andrés",
    apellidos: "Ruiz",
    correo: "andres.ruiz@talassa.com",
    usuario: "andres.ruiz",
    rol: "Operador portuario",
    activo: false,
    ultimo_acceso: "Hace 12 días",
  },
];


function UsuariosPage() {
  const navigate = useNavigate();


  const [
    usuarios,
    setUsuarios,
  ] = useState(usuariosIniciales);


  const [
    busqueda,
    setBusqueda,
  ] = useState("");


  const [
    filtroRol,
    setFiltroRol,
  ] = useState("");


  const [
    filtroEstado,
    setFiltroEstado,
  ] = useState("");


  const [
    cargando,
    setCargando,
  ] = useState(false);


  const usuariosFiltrados = useMemo(() => {
    const texto =
      busqueda
        .trim()
        .toLowerCase();


    return usuarios.filter((usuario) => {
      const nombreCompleto =
        `${usuario.nombres} ${usuario.apellidos}`
          .toLowerCase();


      const coincideBusqueda =
        !texto ||
        nombreCompleto.includes(texto) ||
        usuario.correo
          .toLowerCase()
          .includes(texto) ||
        usuario.usuario
          .toLowerCase()
          .includes(texto);


      const coincideRol =
        !filtroRol ||
        usuario.rol === filtroRol;


      const coincideEstado =
        !filtroEstado ||
        String(usuario.activo) ===
          filtroEstado;


      return (
        coincideBusqueda &&
        coincideRol &&
        coincideEstado
      );
    });
  }, [
    usuarios,
    busqueda,
    filtroRol,
    filtroEstado,
  ]);


  const totalActivos =
    usuarios.filter(
      (usuario) => usuario.activo
    ).length;


  const totalInactivos =
    usuarios.length -
    totalActivos;


  const totalAdministradores =
    usuarios.filter(
      (usuario) =>
        usuario.rol ===
        "Administrador"
    ).length;


  function limpiarFiltros() {
    setBusqueda("");
    setFiltroRol("");
    setFiltroEstado("");
  }


  function actualizarUsuarios() {
    setCargando(true);

    setTimeout(() => {
      setUsuarios(
        [...usuariosIniciales]
      );

      setCargando(false);
    }, 500);
  }


  function obtenerIniciales(usuario) {
    return (
      `${usuario.nombres.charAt(0)}${usuario.apellidos.charAt(0)}`
        .toUpperCase()
    );
  }


  return (
    <section className="pagina-usuarios">

      {/* ======================================
          FONDO
      ====================================== */}

      <div className="fondo-usuarios" />


      {/* ======================================
          ENCABEZADO
      ====================================== */}

      <div className="encabezado-usuarios">

        <div>
          <h1>
            Usuarios
          </h1>

          <p>
            Administra las cuentas y accesos
            de los usuarios de TALASSA.
          </p>
        </div>


        <button
          type="button"
          className="boton-nuevo-usuario"
          onClick={() =>
            navigate("/usuarios/nuevo")
          }
        >
          <Plus size={19} />

          Nuevo usuario
        </button>

      </div>


      {/* ======================================
          RESUMEN
      ====================================== */}

      <div className="resumen-usuarios">

        <article className="tarjeta-resumen-usuario azul">

          <div className="icono-resumen-usuario">
            <Users size={24} />
          </div>


          <div>
            <span>
              Total de usuarios
            </span>

            <strong>
              {usuarios.length}
            </strong>

            <small>
              Cuentas registradas
            </small>
          </div>

        </article>


        <article className="tarjeta-resumen-usuario menta">

          <div className="icono-resumen-usuario">
            <UserRound size={24} />
          </div>


          <div>
            <span>
              Usuarios activos
            </span>

            <strong>
              {totalActivos}
            </strong>

            <small>
              Con acceso habilitado
            </small>
          </div>

        </article>


        <article className="tarjeta-resumen-usuario rojo">

          <div className="icono-resumen-usuario">
            <UserX size={24} />
          </div>


          <div>
            <span>
              Usuarios inactivos
            </span>

            <strong>
              {totalInactivos}
            </strong>

            <small>
              Sin acceso al sistema
            </small>
          </div>

        </article>


        <article className="tarjeta-resumen-usuario blanco">

          <div className="icono-resumen-usuario">
            <ShieldCheck size={24} />
          </div>


          <div>
            <span>
              Administradores
            </span>

            <strong>
              {totalAdministradores}
            </strong>

            <small>
              Cuentas administrativas
            </small>
          </div>

        </article>

      </div>


      {/* ======================================
          LISTADO
      ====================================== */}

      <article className="glass-card tarjeta-listado-usuarios">


        <div className="encabezado-listado-usuarios">

          <div>

            <h2>
              <Users size={21} />

              Listado de usuarios
            </h2>


            <span>
              {usuariosFiltrados.length}
              {" "}
              resultado
              {usuariosFiltrados.length !== 1
                ? "s"
                : ""}
            </span>

          </div>


          <div className="acciones-listado-usuarios">

            <button
              type="button"
              className="boton-roles-usuarios"
              onClick={() =>
                navigate("/roles")
              }
            >
              <ShieldCheck size={17} />

              Roles y permisos
            </button>


            <button
              type="button"
              className="boton-actualizar-usuarios"
              onClick={actualizarUsuarios}
            >
              <RefreshCw
                size={17}
                className={
                  cargando
                    ? "icono-girando-usuarios"
                    : ""
                }
              />

              Actualizar
            </button>

          </div>

        </div>


        {/* ======================================
            FILTROS
        ====================================== */}

        <div className="filtros-usuarios">

          <div className="buscador-usuarios">

            <Search size={18} />


            <input
              type="text"
              value={busqueda}
              onChange={(evento) =>
                setBusqueda(
                  evento.target.value
                )
              }
              placeholder="Buscar por nombre, usuario o correo..."
            />

          </div>


          <div className="campo-filtro-usuarios">

            <Filter size={16} />


            <select
              value={filtroRol}
              onChange={(evento) =>
                setFiltroRol(
                  evento.target.value
                )
              }
            >
              <option value="">
                Todos los roles
              </option>

              <option value="Administrador">
                Administrador
              </option>

              <option value="Operador portuario">
                Operador portuario
              </option>

              <option value="Inspector">
                Inspector
              </option>
            </select>

          </div>


          <div className="campo-filtro-usuarios">

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
            className="boton-limpiar-usuarios"
            onClick={limpiarFiltros}
          >
            Limpiar
          </button>

        </div>


        {/* ======================================
            CARGANDO
        ====================================== */}

        {cargando && (
          <div className="estado-carga-usuarios">

            <RefreshCw
              size={24}
              className="icono-girando-usuarios"
            />

            <span>
              Actualizando usuarios...
            </span>

          </div>
        )}


        {/* ======================================
            TABLA
        ====================================== */}

        {!cargando && (
          <div className="contenedor-tabla-usuarios">

            <table className="tabla-usuarios">

              <thead>

                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Último acceso</th>
                  <th>Acciones</th>
                </tr>

              </thead>


              <tbody>

                {usuariosFiltrados.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="tabla-sin-usuarios"
                    >
                      No se encontraron usuarios.
                    </td>

                  </tr>

                ) : (

                  usuariosFiltrados.map(
                    (usuario) => (

                      <tr
                        key={
                          usuario.id_usuario
                        }
                      >

                        <td>

                          <div className="usuario-tabla">

                            <div className="avatar-usuario-tabla">
                              {obtenerIniciales(
                                usuario
                              )}
                            </div>


                            <div>

                              <strong>
                                {usuario.nombres}
                                {" "}
                                {usuario.apellidos}
                              </strong>

                              <small>
                                @{usuario.usuario}
                              </small>

                            </div>

                          </div>

                        </td>


                        <td>
                          {usuario.correo}
                        </td>


                        <td>

                          <span className="rol-usuario">
                            {usuario.rol}
                          </span>

                        </td>


                        <td>

                          <span
                            className={
                              usuario.activo
                                ? "estado-usuario activo"
                                : "estado-usuario inactivo"
                            }
                          >

                            <i />

                            {usuario.activo
                              ? "Activo"
                              : "Inactivo"}

                          </span>

                        </td>


                        <td>
                          {usuario.ultimo_acceso}
                        </td>


                        <td>

                          <div className="acciones-usuario">

                            <button
                              type="button"
                              title="Ver usuario"
                            >
                              <Eye size={17} />
                            </button>


                            <button
                              type="button"
                              title="Editar usuario"
                              onClick={() =>
                                navigate(
                                  `/usuarios/${usuario.id_usuario}/editar`
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


export default UsuariosPage;