import {
  Anchor,
  BookOpen,
  Building2,
  Check,
  ClipboardCheck,
  FileClock,
  LayoutDashboard,
  LoaderCircle,
  Package,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  Ship,
  TriangleAlert,
  Users,
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
  actualizarPermisosRol,
  listarPermisos,
  listarRoles,
  obtenerPermisosRol,
} from "../../services/roles.service.js";

import {
  cerrarSesion,
} from "../../services/auth.service.js";

import "../../styles/rolesPermisos.css";


/* ======================================
   ORDEN VISUAL DE MÓDULOS
====================================== */

const ordenModulos = [
  "Dashboard",
  "Usuarios",
  "Roles",
  "Roles y permisos",
  "Empresas",
  "Catálogos",
  "Catalogos",
  "Buques",
  "Operaciones",
  "Muelles",
  "Contenedores",
  "Inspecciones",
  "Incidencias",
  "Auditoría",
  "Auditoria",
];


/* ======================================
   ICONOS SEGÚN MÓDULO
====================================== */

function obtenerIconoModulo(
  modulo
) {
  const nombre =
    modulo
      ?.toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );


  switch (nombre) {
    case "dashboard":
      return LayoutDashboard;

    case "usuarios":
      return Users;

    case "roles":
    case "roles y permisos":
      return ShieldCheck;

    case "empresas":
      return Building2;

    case "catalogos":
      return BookOpen;

    case "buques":
      return Ship;

    case "operaciones":
      return Settings;

    case "muelles":
      return Anchor;

    case "contenedores":
      return Package;

    case "inspecciones":
      return ClipboardCheck;

    case "incidencias":
      return TriangleAlert;

    case "auditoria":
      return FileClock;

    default:
      return ShieldCheck;
  }
}


function RolesPermisosPage() {
  const navigate =
    useNavigate();


  /* ======================================
     ESTADOS
  ====================================== */

  const [
    roles,
    setRoles,
  ] = useState([]);


  const [
    permisosDisponibles,
    setPermisosDisponibles,
  ] = useState([]);


  const [
    rolSeleccionadoId,
    setRolSeleccionadoId,
  ] = useState(null);


  const [
    permisosPorRol,
    setPermisosPorRol,
  ] = useState({});


  const [
    permisosGuardadosPorRol,
    setPermisosGuardadosPorRol,
  ] = useState({});


  const [
    cargando,
    setCargando,
  ] = useState(true);


  const [
    guardando,
    setGuardando,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    mensajeExito,
    setMensajeExito,
  ] = useState("");


  /* ======================================
     CARGAR DATOS REALES
  ====================================== */

  useEffect(() => {
    let componenteActivo =
      true;


    async function cargarDatos() {
      try {
        const [
          respuestaRoles,
          respuestaPermisos,
        ] =
          await Promise.all([
            listarRoles(),
            listarPermisos(),
          ]);


        if (!componenteActivo) {
          return;
        }


        const listaRoles =
          respuestaRoles.data || [];


        const listaPermisos =
          respuestaPermisos.data || [];


        const respuestasPermisosRol =
          await Promise.all(
            listaRoles.map(
              (rol) =>
                obtenerPermisosRol(
                  rol.id_rol
                )
            )
          );


        if (!componenteActivo) {
          return;
        }


        const asignaciones = {};


        listaRoles.forEach(
          (rol, indice) => {
            const permisosRol =
              respuestasPermisosRol[
                indice
              ]?.data || [];


            asignaciones[
              rol.id_rol
            ] =
              permisosRol.map(
                (permiso) =>
                  permiso.id_permiso
              );
          }
        );


        setRoles(
          listaRoles
        );


        setPermisosDisponibles(
          listaPermisos
        );


        setPermisosPorRol(
          asignaciones
        );


        setPermisosGuardadosPorRol(
          asignaciones
        );


        if (
          listaRoles.length > 0
        ) {
          setRolSeleccionadoId(
            listaRoles[0].id_rol
          );
        }


      } catch (error) {
        console.error(
          "Error al cargar roles y permisos:",
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
          "No fue posible cargar los roles y permisos."
        );


      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    }


    cargarDatos();


    return () => {
      componenteActivo =
        false;
    };

  }, [navigate]);


  /* ======================================
     ROL ACTUAL
  ====================================== */

  const rolActual =
    useMemo(
      () =>
        roles.find(
          (rol) =>
            rol.id_rol ===
            rolSeleccionadoId
        ),
      [
        roles,
        rolSeleccionadoId,
      ]
    );


  const permisosActuales =
    permisosPorRol[
      rolSeleccionadoId
    ] || [];


  /* ======================================
     AGRUPAR PERMISOS POR MÓDULO
  ====================================== */

  const gruposPermisos =
    useMemo(() => {
      const grupos = {};


      permisosDisponibles.forEach(
        (permiso) => {
          const modulo =
            permiso.modulo ||
            "Otros";


          if (!grupos[modulo]) {
            grupos[modulo] = [];
          }


          grupos[modulo].push(
            permiso
          );
        }
      );


      return Object.entries(
        grupos
      )
        .map(
          ([
            modulo,
            permisos,
          ]) => ({
            modulo,

            permisos,

            icono:
              obtenerIconoModulo(
                modulo
              ),
          })
        )
        .sort(
          (grupoA, grupoB) => {
            const indiceA =
              ordenModulos.indexOf(
                grupoA.modulo
              );


            const indiceB =
              ordenModulos.indexOf(
                grupoB.modulo
              );


            if (
              indiceA === -1
              &&
              indiceB === -1
            ) {
              return grupoA.modulo
                .localeCompare(
                  grupoB.modulo
                );
            }


            if (indiceA === -1) {
              return 1;
            }


            if (indiceB === -1) {
              return -1;
            }


            return (
              indiceA -
              indiceB
            );
          }
        );

    }, [
      permisosDisponibles,
    ]);


  const totalPermisos =
    permisosDisponibles.length;


  /* ======================================
     UTILIDADES
  ====================================== */

  function tienePermiso(
    idPermiso
  ) {
    return permisosActuales.includes(
      idPermiso
    );
  }


  function seleccionarRol(
    idRol
  ) {
    setRolSeleccionadoId(
      idRol
    );

    setMensajeExito("");

    setError("");
  }


  /* ======================================
     ALTERNAR PERMISO
  ====================================== */

  function alternarPermiso(
    idPermiso
  ) {
    if (!rolSeleccionadoId) {
      return;
    }


    setMensajeExito("");

    setError("");


    setPermisosPorRol(
      (estadoActual) => {
        const permisosRol =
          estadoActual[
            rolSeleccionadoId
          ] || [];


        const nuevosPermisos =
          permisosRol.includes(
            idPermiso
          )
            ? permisosRol.filter(
                (permiso) =>
                  permiso !==
                  idPermiso
              )
            : [
                ...permisosRol,
                idPermiso,
              ];


        return {
          ...estadoActual,

          [rolSeleccionadoId]:
            nuevosPermisos,
        };
      }
    );
  }


  /* ======================================
     SELECCIONAR TODOS LOS DEL MÓDULO
  ====================================== */

  function seleccionarTodosModulo(
    permisosModulo
  ) {
    if (!rolSeleccionadoId) {
      return;
    }


    setMensajeExito("");

    setError("");


    const idsModulo =
      permisosModulo.map(
        (permiso) =>
          permiso.id_permiso
      );


    const todosSeleccionados =
      idsModulo.every(
        (idPermiso) =>
          permisosActuales.includes(
            idPermiso
          )
      );


    setPermisosPorRol(
      (estadoActual) => {
        const permisosRol =
          estadoActual[
            rolSeleccionadoId
          ] || [];


        let nuevosPermisos;


        if (
          todosSeleccionados
        ) {
          nuevosPermisos =
            permisosRol.filter(
              (idPermiso) =>
                !idsModulo.includes(
                  idPermiso
                )
            );

        } else {
          nuevosPermisos = [
            ...new Set([
              ...permisosRol,
              ...idsModulo,
            ]),
          ];
        }


        return {
          ...estadoActual,

          [rolSeleccionadoId]:
            nuevosPermisos,
        };
      }
    );
  }


  /* ======================================
     RESTABLECER CAMBIOS
  ====================================== */

  function restablecerPermisos() {
    if (!rolSeleccionadoId) {
      return;
    }


    const permisosOriginales =
      permisosGuardadosPorRol[
        rolSeleccionadoId
      ] || [];


    setPermisosPorRol(
      (estadoActual) => ({
        ...estadoActual,

        [rolSeleccionadoId]:
          [
            ...permisosOriginales,
          ],
      })
    );


    setMensajeExito("");

    setError("");
  }


  /* ======================================
     GUARDAR EN POSTGRESQL
  ====================================== */

  async function guardarCambios() {
    if (
      !rolSeleccionadoId
      ||
      !rolActual
    ) {
      return;
    }


    try {
      setGuardando(true);

      setMensajeExito("");

      setError("");


      const respuesta =
        await actualizarPermisosRol(
          rolSeleccionadoId,
          permisosActuales
        );


      const permisosGuardados =
        (
          respuesta.data || []
        ).map(
          (permiso) =>
            permiso.id_permiso
        );


      setPermisosPorRol(
        (estadoActual) => ({
          ...estadoActual,

          [rolSeleccionadoId]:
            permisosGuardados,
        })
      );


      setPermisosGuardadosPorRol(
        (estadoActual) => ({
          ...estadoActual,

          [rolSeleccionadoId]:
            permisosGuardados,
        })
      );


      setMensajeExito(
        `Los permisos de ${rolActual.nombre} se guardaron correctamente.`
      );


    } catch (error) {
      console.error(
        "Error al guardar permisos:",
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
        "No fue posible guardar los permisos."
      );


    } finally {
      setGuardando(false);
    }
  }


  /* ======================================
     CARGANDO
  ====================================== */

  if (cargando) {
    return (
      <section className="pagina-roles">

        <div className="fondo-roles" />


        <div className="estado-carga-roles">

          <LoaderCircle
            size={30}
            className="icono-girando-permisos"
          />


          <span>
            Cargando roles y permisos...
          </span>

        </div>

      </section>
    );
  }


  return (
    <section className="pagina-roles">

      {/* ======================================
          FONDO
      ====================================== */}

      <div className="fondo-roles" />


      {/* ======================================
          ENCABEZADO
      ====================================== */}

      <div className="encabezado-roles">

        <div>

          <h1>
            Roles y permisos
          </h1>


          <p>
            Configura los accesos de acuerdo
            con las responsabilidades de cada
            rol del sistema.
          </p>

        </div>

      </div>


      {/* ======================================
          ERROR GENERAL
      ====================================== */}

      {error && (

        <div className="mensaje-error-permisos">

          <TriangleAlert
            size={17}
          />

          {error}

        </div>

      )}


      {/* ======================================
          INDICADORES
      ====================================== */}

      <div className="resumen-roles">

        <article className="tarjeta-resumen-rol azul">

          <div className="icono-resumen-rol">
            <ShieldCheck
              size={24}
            />
          </div>


          <div>

            <span>
              Roles del sistema
            </span>


            <strong>
              {roles.length}
            </strong>


            <small>
              Roles definidos en TALASSA
            </small>

          </div>

        </article>


        <article className="tarjeta-resumen-rol menta">

          <div className="icono-resumen-rol">
            <Users
              size={24}
            />
          </div>


          <div>

            <span>
              Usuarios asociados
            </span>


            <strong>
              {rolActual?.usuarios || 0}
            </strong>


            <small>
              Para el rol seleccionado
            </small>

          </div>

        </article>


        <article className="tarjeta-resumen-rol blanco">

          <div className="icono-resumen-rol">
            <Check
              size={24}
            />
          </div>


          <div>

            <span>
              Permisos asignados
            </span>


            <strong>
              {permisosActuales.length}
            </strong>


            <small>
              De {totalPermisos} disponibles
            </small>

          </div>

        </article>

      </div>


      {/* ======================================
          CONTENIDO
      ====================================== */}

      <div className="rejilla-roles-permisos">

        {/* ======================================
            LISTADO DE ROLES
        ====================================== */}

        <article className="glass-card tarjeta-listado-roles">

          <div className="titulo-listado-roles">

            <ShieldCheck
              size={21}
            />


            <div>

              <h2>
                Roles
              </h2>


              <span>
                Seleccione un rol
              </span>

            </div>

          </div>


          <div className="lista-roles">

            {roles.map(
              (rol) => (

                <button
                  key={
                    rol.id_rol
                  }
                  type="button"
                  className={
                    rolSeleccionadoId ===
                    rol.id_rol
                      ? "item-rol seleccionado"
                      : "item-rol"
                  }
                  onClick={() =>
                    seleccionarRol(
                      rol.id_rol
                    )
                  }
                >

                  <div className="icono-item-rol">

                    <ShieldCheck
                      size={19}
                    />

                  </div>


                  <div className="contenido-item-rol">

                    <strong>
                      {rol.nombre}
                    </strong>


                    <span>

                      {rol.descripcion
                        ||
                        "Rol del sistema TALASSA."}

                    </span>


                    <small>

                      {rol.usuarios}

                      {" "}

                      usuario

                      {rol.usuarios !== 1
                        ? "s"
                        : ""}

                    </small>

                  </div>

                </button>

              )
            )}

          </div>

        </article>


        {/* ======================================
            PERMISOS
        ====================================== */}

        <article className="glass-card tarjeta-permisos">

          <div className="encabezado-permisos">

            <div>

              <h2>

                <ShieldCheck
                  size={21}
                />

                Permisos del rol

              </h2>


              <div className="rol-seleccionado-permisos">

                <strong>
                  {rolActual?.nombre
                    ||
                    "Sin rol"}
                </strong>


                <span>

                  {permisosActuales.length}

                  {" "}

                  de

                  {" "}

                  {totalPermisos}

                  {" "}

                  permisos asignados

                </span>

              </div>

            </div>


            <div className="leyenda-permisos">

              <span>

                <i className="permiso-activo" />

                Con permiso

              </span>


              <span>

                <i className="permiso-inactivo" />

                Sin permiso

              </span>

            </div>

          </div>


          {/* ======================================
              MÓDULOS
          ====================================== */}

          <div className="rejilla-modulos-permisos">

            {gruposPermisos.map(
              (grupo) => {
                const Icono =
                  grupo.icono;


                const todosSeleccionados =
                  grupo.permisos.every(
                    (permiso) =>
                      tienePermiso(
                        permiso.id_permiso
                      )
                  );


                return (
                  <section
                    className="modulo-permisos"
                    key={
                      grupo.modulo
                    }
                  >

                    <div className="encabezado-modulo-permisos">

                      <div>

                        <div className="icono-modulo-permisos">

                          <Icono
                            size={19}
                          />

                        </div>


                        <strong>
                          {grupo.modulo}
                        </strong>

                      </div>


                      <button
                        type="button"
                        disabled={
                          guardando
                        }
                        onClick={() =>
                          seleccionarTodosModulo(
                            grupo.permisos
                          )
                        }
                      >

                        {todosSeleccionados
                          ? "Quitar todos"
                          : "Seleccionar todos"}

                      </button>

                    </div>


                    <div className="lista-permisos">

                      {grupo.permisos.map(
                        (permiso) => (

                          <label
                            key={
                              permiso.id_permiso
                            }
                            className={
                              tienePermiso(
                                permiso.id_permiso
                              )
                                ? "opcion-permiso seleccionada"
                                : "opcion-permiso"
                            }
                          >

                            <input
                              type="checkbox"
                              checked={
                                tienePermiso(
                                  permiso.id_permiso
                                )
                              }
                              disabled={
                                guardando
                              }
                              onChange={() =>
                                alternarPermiso(
                                  permiso.id_permiso
                                )
                              }
                            />


                            <span className="checkbox-personalizado">

                              {tienePermiso(
                                permiso.id_permiso
                              ) && (

                                <Check
                                  size={13}
                                />

                              )}

                            </span>


                            <span>
                              {permiso.nombre}
                            </span>

                          </label>

                        )
                      )}

                    </div>

                  </section>
                );
              }
            )}

          </div>


          {/* ======================================
              MENSAJE DE ÉXITO
          ====================================== */}

          {mensajeExito && (

            <div className="mensaje-exito-permisos">

              <Check
                size={17}
              />

              {mensajeExito}

            </div>

          )}


          {/* ======================================
              ACCIONES
          ====================================== */}

          <div className="acciones-permisos">

            <button
              type="button"
              className="boton-restablecer-permisos"
              onClick={
                restablecerPermisos
              }
              disabled={
                guardando
                ||
                !rolSeleccionadoId
              }
            >

              <RotateCcw
                size={17}
              />

              Restablecer

            </button>


            <button
              type="button"
              className="boton-guardar-permisos"
              onClick={
                guardarCambios
              }
              disabled={
                guardando
                ||
                !rolSeleccionadoId
              }
            >

              {guardando ? (

                <>

                  <LoaderCircle
                    size={17}
                    className="icono-girando-permisos"
                  />

                  Guardando...

                </>

              ) : (

                <>

                  <Save
                    size={17}
                  />

                  Guardar cambios

                </>

              )}

            </button>

          </div>

        </article>

      </div>

    </section>
  );
}


export default RolesPermisosPage;