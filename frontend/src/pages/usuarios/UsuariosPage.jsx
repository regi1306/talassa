import {
  AtSign,
  CalendarDays,
  Eye,
  Filter,
  LockKeyhole,
  Mail,
  Pencil,
  Plus,
  Power,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserRound,
  Users,
  UserX,
  X,
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
  cambiarEstadoUsuario,
  listarUsuarios,
} from "../../services/usuarios.service.js";

import {
  cerrarSesion,
} from "../../services/auth.service.js";

import "../../styles/usuarios.css";


function UsuariosPage() {
  const navigate =
    useNavigate();


  /* ======================================
     ESTADOS
  ====================================== */

  const [
    usuarios,
    setUsuarios,
  ] = useState([]);


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
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    usuarioDetalle,
    setUsuarioDetalle,
  ] = useState(null);


  const [
    usuarioEstado,
    setUsuarioEstado,
  ] = useState(null);


  const [
    procesandoEstado,
    setProcesandoEstado,
  ] = useState(false);


  /* ======================================
     CARGAR AL ABRIR LA PÁGINA
  ====================================== */

  useEffect(() => {
    let componenteActivo =
      true;


    async function cargarInicial() {
      try {
        const respuesta =
          await listarUsuarios();


        if (!componenteActivo) {
          return;
        }


        setUsuarios(
          respuesta.data || []
        );


      } catch (error) {
        console.error(
          "Error al cargar usuarios:",
          error
        );


        if (!componenteActivo) {
          return;
        }


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
          "No fue posible cargar los usuarios."
        );


      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    }


    cargarInicial();


    return () => {
      componenteActivo =
        false;
    };

  }, [navigate]);


  /* ======================================
     ACTUALIZAR LISTADO
  ====================================== */

  async function cargarUsuarios() {
    try {
      setCargando(true);

      setError("");


      const respuesta =
        await listarUsuarios();


      setUsuarios(
        respuesta.data || []
      );


    } catch (error) {
      console.error(
        "Error al actualizar usuarios:",
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
        "No fue posible actualizar los usuarios."
      );


    } finally {
      setCargando(false);
    }
  }


  /* ======================================
     FILTROS
  ====================================== */

  const usuariosFiltrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();


      return usuarios.filter(
        (usuario) => {
          const nombreCompleto =
            `${usuario.nombres} ${usuario.apellidos}`
              .toLowerCase();


          const coincideBusqueda =
            !texto
            ||
            nombreCompleto.includes(
              texto
            )
            ||
            usuario.correo
              .toLowerCase()
              .includes(texto)
            ||
            usuario.usuario
              .toLowerCase()
              .includes(texto);


          const coincideRol =
            !filtroRol
            ||
            usuario.rol ===
              filtroRol;


          const coincideEstado =
            !filtroEstado
            ||
            String(
              usuario.activo
            ) === filtroEstado;


          return (
            coincideBusqueda
            &&
            coincideRol
            &&
            coincideEstado
          );
        }
      );
    }, [
      usuarios,
      busqueda,
      filtroRol,
      filtroEstado,
    ]);


  /* ======================================
     RESUMEN
  ====================================== */

  const totalActivos =
    usuarios.filter(
      (usuario) =>
        usuario.activo
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


  /* ======================================
     UTILIDADES
  ====================================== */

  function limpiarFiltros() {
    setBusqueda("");

    setFiltroRol("");

    setFiltroEstado("");
  }


  function obtenerIniciales(
    usuario
  ) {
    return (
      `${usuario.nombres?.charAt(0) || ""}${usuario.apellidos?.charAt(0) || ""}`
        .toUpperCase()
    );
  }


  function formatearFecha(
    fecha
  ) {
    if (!fecha) {
      return "Sin registro";
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


  function formatearFechaHora(
    fecha
  ) {
    if (!fecha) {
      return "Sin acceso";
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


  /* ======================================
     CAMBIAR ESTADO
  ====================================== */

  async function confirmarCambioEstado() {
    if (!usuarioEstado) {
      return;
    }


    const nuevoEstado =
      !usuarioEstado.activo;


    try {
      setProcesandoEstado(true);

      setError("");


      await cambiarEstadoUsuario(
        usuarioEstado.id_usuario,
        nuevoEstado
      );


      setUsuarioEstado(null);


      await cargarUsuarios();


    } catch (error) {
      console.error(
        "Error al cambiar estado:",
        error
      );


      setError(
        error.response?.data?.message
        ||
        "No fue posible cambiar el estado del usuario."
      );


      setUsuarioEstado(null);


    } finally {
      setProcesandoEstado(false);
    }
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
            navigate(
              "/usuarios/nuevo"
            )
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
                navigate(
                  "/roles"
                )
              }
            >

              <ShieldCheck size={17} />

              Roles y permisos

            </button>


            <button
              type="button"
              className="boton-actualizar-usuarios"
              onClick={
                cargarUsuarios
              }
              disabled={
                cargando
              }
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
              value={
                busqueda
              }
              onChange={
                (evento) =>
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
              value={
                filtroRol
              }
              onChange={
                (evento) =>
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
              value={
                filtroEstado
              }
              onChange={
                (evento) =>
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
            onClick={
              limpiarFiltros
            }
          >
            Limpiar
          </button>

        </div>


        {/* ======================================
            ERROR
        ====================================== */}

        {error && (

          <div className="mensaje-error-listado-usuarios">
            {error}
          </div>

        )}


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
              Cargando usuarios...
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

                  <th>
                    Usuario
                  </th>

                  <th>
                    Correo
                  </th>

                  <th>
                    Rol
                  </th>

                  <th>
                    Estado
                  </th>

                  <th>
                    Último acceso
                  </th>

                  <th>
                    Acciones
                  </th>

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

                        {/* USUARIO */}

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


                        {/* CORREO */}

                        <td>
                          {usuario.correo}
                        </td>


                        {/* ROL */}

                        <td>

                          <span className="rol-usuario">
                            {usuario.rol}
                          </span>

                        </td>


                        {/* ESTADO */}

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


                        {/* ÚLTIMO ACCESO */}

                        <td>

                          {formatearFechaHora(
                            usuario.ultimo_acceso
                          )}

                        </td>


                        {/* ACCIONES */}

                        <td>

                          <div className="acciones-usuario">

                            {/* VER */}

                            <button
                              type="button"
                              title="Ver usuario"
                              onClick={() =>
                                setUsuarioDetalle(
                                  usuario
                                )
                              }
                            >

                              <Eye size={17} />

                            </button>


                            {/* EDITAR */}

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


                            {/* ACTIVAR / DESACTIVAR */}

                            <button
                              type="button"
                              className={
                                usuario.activo
                                  ? "accion-desactivar-usuario"
                                  : "accion-activar-usuario"
                              }
                              title={
                                usuario.activo
                                  ? "Desactivar usuario"
                                  : "Reactivar usuario"
                              }
                              onClick={() =>
                                setUsuarioEstado(
                                  usuario
                                )
                              }
                            >

                              {usuario.activo ? (

                                <Power size={17} />

                              ) : (

                                <UserCheck size={17} />

                              )}

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


      {/* ======================================
          MODAL DETALLE
      ====================================== */}

      {usuarioDetalle && (

        <div
          className="modal-fondo-usuarios"
          onMouseDown={(evento) => {

            if (
              evento.target ===
              evento.currentTarget
            ) {
              setUsuarioDetalle(
                null
              );
            }

          }}
        >

          <article className="modal-usuario">

            <div className="encabezado-modal-usuario">

              <div>

                <span>
                  Información de la cuenta
                </span>


                <h2>
                  Detalle del usuario
                </h2>

              </div>


              <button
                type="button"
                onClick={() =>
                  setUsuarioDetalle(
                    null
                  )
                }
                aria-label="Cerrar"
              >

                <X size={19} />

              </button>

            </div>


            <div className="identidad-modal-usuario">

              <div className="avatar-modal-usuario">

                {obtenerIniciales(
                  usuarioDetalle
                )}

              </div>


              <div>

                <h3>

                  {usuarioDetalle.nombres}

                  {" "}

                  {usuarioDetalle.apellidos}

                </h3>


                <span>
                  @{usuarioDetalle.usuario}
                </span>

              </div>

            </div>


            <div className="datos-modal-usuario">

              {/* CORREO */}

              <div>

                <Mail size={18} />

                <section>

                  <span>
                    Correo electrónico
                  </span>

                  <strong>
                    {usuarioDetalle.correo}
                  </strong>

                </section>

              </div>


              {/* USUARIO */}

              <div>

                <AtSign size={18} />

                <section>

                  <span>
                    Nombre de usuario
                  </span>

                  <strong>
                    {usuarioDetalle.usuario}
                  </strong>

                </section>

              </div>


              {/* ROL */}

              <div>

                <ShieldCheck size={18} />

                <section>

                  <span>
                    Rol
                  </span>

                  <strong>
                    {usuarioDetalle.rol}
                  </strong>

                </section>

              </div>


              {/* ESTADO */}

              <div>

                <LockKeyhole size={18} />

                <section>

                  <span>
                    Estado
                  </span>

                  <strong>

                    {usuarioDetalle.activo
                      ? "Activo"
                      : "Inactivo"}

                  </strong>

                </section>

              </div>


              {/* CUENTA CREADA */}

              <div>

                <CalendarDays size={18} />

                <section>

                  <span>
                    Cuenta creada
                  </span>

                  <strong>

                    {formatearFecha(
                      usuarioDetalle.fecha_creacion
                    )}

                  </strong>

                </section>

              </div>


              {/* ÚLTIMO ACCESO */}

              <div>

                <RefreshCw size={18} />

                <section>

                  <span>
                    Último acceso
                  </span>

                  <strong>

                    {formatearFechaHora(
                      usuarioDetalle.ultimo_acceso
                    )}

                  </strong>

                </section>

              </div>

            </div>


            <div className="acciones-modal-usuario">

              <button
                type="button"
                className="boton-cerrar-modal-usuario"
                onClick={() =>
                  setUsuarioDetalle(
                    null
                  )
                }
              >
                Cerrar
              </button>

            </div>

          </article>

        </div>

      )}


      {/* ======================================
          MODAL CAMBIAR ESTADO
      ====================================== */}

      {usuarioEstado && (

        <div className="modal-fondo-usuarios">

          <article className="modal-confirmacion-usuario">

            <div
              className={
                usuarioEstado.activo
                  ? "icono-confirmacion-usuario desactivar"
                  : "icono-confirmacion-usuario activar"
              }
            >

              {usuarioEstado.activo ? (

                <Power size={27} />

              ) : (

                <UserCheck size={27} />

              )}

            </div>


            <h2>

              {usuarioEstado.activo
                ? "Desactivar usuario"
                : "Reactivar usuario"}

            </h2>


            <p>

              {usuarioEstado.activo ? (

                <>

                  ¿Está seguro de que desea
                  desactivar a{" "}

                  <strong>

                    {usuarioEstado.nombres}

                    {" "}

                    {usuarioEstado.apellidos}

                  </strong>

                  ? El usuario ya no podrá
                  iniciar sesión.

                </>

              ) : (

                <>

                  ¿Desea reactivar la cuenta de{" "}

                  <strong>

                    {usuarioEstado.nombres}

                    {" "}

                    {usuarioEstado.apellidos}

                  </strong>

                  ? El usuario recuperará el
                  acceso al sistema.

                </>

              )}

            </p>


            <div className="acciones-confirmacion-usuario">

              <button
                type="button"
                className="boton-cancelar-modal-usuario"
                disabled={
                  procesandoEstado
                }
                onClick={() =>
                  setUsuarioEstado(
                    null
                  )
                }
              >
                Cancelar
              </button>


              <button
                type="button"
                className={
                  usuarioEstado.activo
                    ? "boton-confirmar-desactivar"
                    : "boton-confirmar-activar"
                }
                disabled={
                  procesandoEstado
                }
                onClick={
                  confirmarCambioEstado
                }
              >

                {procesandoEstado
                  ? "Procesando..."
                  : usuarioEstado.activo
                    ? "Desactivar"
                    : "Reactivar"}

              </button>

            </div>

          </article>

        </div>

      )}

    </section>
  );
}


export default UsuariosPage;