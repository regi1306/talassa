import {
  Anchor,
  Check,
  ClipboardCheck,
  FileClock,
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
  useMemo,
  useState,
} from "react";

import "../../styles/rolesPermisos.css";


/* ======================================
   ROLES DEL SISTEMA
====================================== */

const roles = [
  {
    id: 1,
    nombre: "Administrador",
    descripcion:
      "Administración y configuración general del sistema.",
    usuarios: 2,
  },
  {
    id: 2,
    nombre: "Operador portuario",
    descripcion:
      "Gestión de las operaciones portuarias.",
    usuarios: 8,
  },
  {
    id: 3,
    nombre: "Inspector",
    descripcion:
      "Registro y seguimiento de inspecciones e incidencias.",
    usuarios: 5,
  },
];


/* ======================================
   GRUPOS DE PERMISOS
====================================== */

const gruposPermisos = [
  {
    modulo: "Usuarios",
    icono: Users,
    permisos: [
      {
        id: "usuarios_ver",
        nombre: "Ver usuarios",
      },
      {
        id: "usuarios_crear",
        nombre: "Crear usuarios",
      },
      {
        id: "usuarios_editar",
        nombre: "Editar usuarios",
      },
      {
        id: "usuarios_estado",
        nombre: "Activar o desactivar usuarios",
      },
      {
        id: "roles_gestionar",
        nombre: "Gestionar roles y permisos",
      },
    ],
  },

  {
    modulo: "Buques",
    icono: Ship,
    permisos: [
      {
        id: "buques_ver",
        nombre: "Ver buques",
      },
      {
        id: "buques_crear",
        nombre: "Registrar buques",
      },
      {
        id: "buques_editar",
        nombre: "Editar buques",
      },
      {
        id: "buques_estado",
        nombre: "Cambiar estado de buques",
      },
    ],
  },

  {
    modulo: "Operaciones",
    icono: Settings,
    permisos: [
      {
        id: "operaciones_ver",
        nombre: "Ver operaciones",
      },
      {
        id: "operaciones_crear",
        nombre: "Crear operaciones",
      },
      {
        id: "operaciones_editar",
        nombre: "Editar operaciones",
      },
      {
        id: "operaciones_finalizar",
        nombre: "Finalizar operaciones",
      },
    ],
  },

  {
    modulo: "Muelles",
    icono: Anchor,
    permisos: [
      {
        id: "muelles_ver",
        nombre: "Ver muelles",
      },
      {
        id: "muelles_gestionar",
        nombre: "Gestionar muelles",
      },
      {
        id: "asignaciones_ver",
        nombre: "Ver asignaciones",
      },
      {
        id: "asignaciones_crear",
        nombre: "Asignar muelles",
      },
    ],
  },

  {
    modulo: "Contenedores",
    icono: Package,
    permisos: [
      {
        id: "contenedores_ver",
        nombre: "Ver contenedores",
      },
      {
        id: "contenedores_crear",
        nombre: "Registrar contenedores",
      },
      {
        id: "contenedores_editar",
        nombre: "Editar contenedores",
      },
    ],
  },

  {
    modulo: "Inspecciones",
    icono: ClipboardCheck,
    permisos: [
      {
        id: "inspecciones_ver",
        nombre: "Ver inspecciones",
      },
      {
        id: "inspecciones_crear",
        nombre: "Registrar inspecciones",
      },
      {
        id: "inspecciones_editar",
        nombre: "Actualizar inspecciones",
      },
    ],
  },

  {
    modulo: "Incidencias",
    icono: TriangleAlert,
    permisos: [
      {
        id: "incidencias_ver",
        nombre: "Ver incidencias",
      },
      {
        id: "incidencias_crear",
        nombre: "Registrar incidencias",
      },
      {
        id: "incidencias_editar",
        nombre: "Actualizar incidencias",
      },
    ],
  },

  {
    modulo: "Auditoría",
    icono: FileClock,
    permisos: [
      {
        id: "auditoria_ver",
        nombre: "Consultar auditoría",
      },
      {
        id: "auditoria_detalle",
        nombre: "Ver detalle de auditoría",
      },
    ],
  },
];


/* ======================================
   PERMISOS TEMPORALES POR ROL
====================================== */

const permisosIniciales = {
  Administrador: [
    "usuarios_ver",
    "usuarios_crear",
    "usuarios_editar",
    "usuarios_estado",
    "roles_gestionar",

    "buques_ver",
    "buques_crear",
    "buques_editar",
    "buques_estado",

    "operaciones_ver",
    "operaciones_crear",
    "operaciones_editar",
    "operaciones_finalizar",

    "muelles_ver",
    "muelles_gestionar",
    "asignaciones_ver",
    "asignaciones_crear",

    "contenedores_ver",
    "contenedores_crear",
    "contenedores_editar",

    "inspecciones_ver",
    "inspecciones_crear",
    "inspecciones_editar",

    "incidencias_ver",
    "incidencias_crear",
    "incidencias_editar",

    "auditoria_ver",
    "auditoria_detalle",
  ],

  "Operador portuario": [
    "buques_ver",

    "operaciones_ver",
    "operaciones_crear",
    "operaciones_editar",
    "operaciones_finalizar",

    "muelles_ver",
    "asignaciones_ver",
    "asignaciones_crear",

    "contenedores_ver",
    "contenedores_crear",
    "contenedores_editar",
  ],

  Inspector: [
    "operaciones_ver",

    "contenedores_ver",

    "inspecciones_ver",
    "inspecciones_crear",
    "inspecciones_editar",

    "incidencias_ver",
    "incidencias_crear",
    "incidencias_editar",
  ],
};


function RolesPermisosPage() {
  const [
    rolSeleccionado,
    setRolSeleccionado,
  ] = useState("Administrador");


  const [
    permisosPorRol,
    setPermisosPorRol,
  ] = useState(permisosIniciales);


  const [
    guardando,
    setGuardando,
  ] = useState(false);


  const [
    mensajeExito,
    setMensajeExito,
  ] = useState("");


  const rolActual = useMemo(
    () =>
      roles.find(
        (rol) =>
          rol.nombre === rolSeleccionado
      ),
    [rolSeleccionado]
  );


  const permisosActuales =
    permisosPorRol[rolSeleccionado] || [];


  const totalPermisos =
    gruposPermisos.reduce(
      (total, grupo) =>
        total + grupo.permisos.length,
      0
    );


  function tienePermiso(idPermiso) {
    return permisosActuales.includes(
      idPermiso
    );
  }


  function alternarPermiso(idPermiso) {
    setMensajeExito("");


    setPermisosPorRol(
      (estadoActual) => {
        const permisosRol =
          estadoActual[
            rolSeleccionado
          ] || [];


        const nuevosPermisos =
          permisosRol.includes(idPermiso)
            ? permisosRol.filter(
                (permiso) =>
                  permiso !== idPermiso
              )
            : [
                ...permisosRol,
                idPermiso,
              ];


        return {
          ...estadoActual,

          [rolSeleccionado]:
            nuevosPermisos,
        };
      }
    );
  }


  function seleccionarTodosModulo(
    permisosModulo
  ) {
    setMensajeExito("");


    const idsModulo =
      permisosModulo.map(
        (permiso) => permiso.id
      );


    const todosSeleccionados =
      idsModulo.every(
        (id) =>
          permisosActuales.includes(id)
      );


    setPermisosPorRol(
      (estadoActual) => {
        const permisosRol =
          estadoActual[
            rolSeleccionado
          ] || [];


        let nuevosPermisos;


        if (todosSeleccionados) {
          nuevosPermisos =
            permisosRol.filter(
              (permiso) =>
                !idsModulo.includes(
                  permiso
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

          [rolSeleccionado]:
            nuevosPermisos,
        };
      }
    );
  }


  function restablecerPermisos() {
    setPermisosPorRol(
      (estadoActual) => ({
        ...estadoActual,

        [rolSeleccionado]:
          permisosIniciales[
            rolSeleccionado
          ],
      })
    );

    setMensajeExito("");
  }


  function guardarCambios() {
    setGuardando(true);

    setMensajeExito("");


    /*
      TEMPORAL:
      después se enviará esta información
      al backend.
    */

    setTimeout(() => {
      setGuardando(false);

      setMensajeExito(
        `Los permisos de ${rolSeleccionado} se guardaron correctamente.`
      );
    }, 600);
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
          INDICADORES
      ====================================== */}

      <div className="resumen-roles">

        <article className="tarjeta-resumen-rol azul">

          <div className="icono-resumen-rol">
            <ShieldCheck size={24} />
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
            <Users size={24} />
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
            <Check size={24} />
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

            <ShieldCheck size={21} />

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

            {roles.map((rol) => (

              <button
                key={rol.id}
                type="button"
                className={
                  rolSeleccionado ===
                  rol.nombre
                    ? "item-rol seleccionado"
                    : "item-rol"
                }
                onClick={() => {
                  setRolSeleccionado(
                    rol.nombre
                  );

                  setMensajeExito("");
                }}
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
                    {rol.descripcion}
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

            ))}

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
                  {rolSeleccionado}
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
                        permiso.id
                      )
                  );


                return (
                  <section
                    className="modulo-permisos"
                    key={grupo.modulo}
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
                              permiso.id
                            }
                            className={
                              tienePermiso(
                                permiso.id
                              )
                                ? "opcion-permiso seleccionada"
                                : "opcion-permiso"
                            }
                          >

                            <input
                              type="checkbox"
                              checked={
                                tienePermiso(
                                  permiso.id
                                )
                              }
                              onChange={() =>
                                alternarPermiso(
                                  permiso.id
                                )
                              }
                            />


                            <span className="checkbox-personalizado">

                              {tienePermiso(
                                permiso.id
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
              MENSAJE
          ====================================== */}

          {mensajeExito && (
            <div className="mensaje-exito-permisos">

              <Check size={17} />

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
              disabled={guardando}
            >
              <RotateCcw size={17} />

              Restablecer
            </button>


            <button
              type="button"
              className="boton-guardar-permisos"
              onClick={guardarCambios}
              disabled={guardando}
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
                  <Save size={17} />

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