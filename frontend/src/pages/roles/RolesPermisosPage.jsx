import { useState } from "react";
import {
  Anchor,
  ClipboardCheck,
  FileClock,
  Package,
  Plus,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  Ship,
  TriangleAlert,
  Users,
} from "lucide-react";

const roles = [
  {
    nombre: "Administrador",
    descripcion:
      "Administración del sistema",
  },
  {
    nombre: "Operador portuario",
    descripcion:
      "Gestión operativa diaria",
  },
  {
    nombre: "Inspector",
    descripcion:
      "Inspecciones e incidencias",
  },
];

const gruposPermisos = [
  {
    titulo: "Usuarios",
    icono: Users,
    permisos: [
      "Ver usuarios",
      "Crear usuarios",
      "Editar usuarios",
      "Activar/desactivar usuarios",
      "Gestionar roles",
    ],
  },
  {
    titulo: "Buques",
    icono: Ship,
    permisos: [
      "Ver buques",
      "Crear buques",
      "Editar buques",
    ],
  },
  {
    titulo: "Operaciones",
    icono: Settings,
    permisos: [
      "Ver operaciones",
      "Crear operaciones",
      "Editar operaciones",
    ],
  },
  {
    titulo: "Muelles",
    icono: Anchor,
    permisos: [
      "Ver muelles",
      "Gestionar muelles",
    ],
  },
  {
    titulo: "Asignaciones",
    icono: ClipboardCheck,
    permisos: [
      "Ver asignaciones",
      "Asignar muelles",
    ],
  },
  {
    titulo: "Contenedores",
    icono: Package,
    permisos: [
      "Ver contenedores",
      "Registrar contenedores",
      "Editar contenedores",
    ],
  },
  {
    titulo: "Inspecciones",
    icono: ClipboardCheck,
    permisos: [
      "Ver inspecciones",
      "Registrar inspecciones",
      "Actualizar inspecciones",
    ],
  },
  {
    titulo: "Incidencias",
    icono: TriangleAlert,
    permisos: [
      "Ver incidencias",
      "Registrar incidencias",
      "Actualizar incidencias",
    ],
  },
  {
    titulo: "Auditoría",
    icono: FileClock,
    permisos: [
      "Ver registros de auditoría",
    ],
  },
];

function RolesPermisosPage() {
  const [rolSeleccionado, setRolSeleccionado] =
    useState("Administrador");

  const [permisos, setPermisos] =
    useState(() => {
      const iniciales = {};

      gruposPermisos.forEach((grupo) => {
        grupo.permisos.forEach((permiso) => {
          iniciales[
            `${grupo.titulo}-${permiso}`
          ] = true;
        });
      });

      return iniciales;
    });

  const alternarPermiso = (clave) => {
    setPermisos((actual) => ({
      ...actual,
      [clave]: !actual[clave],
    }));
  };

  return (
    <section>
      <div className="page-heading">
        <div>
          <h1>Roles y permisos</h1>
          <p>
            Configura accesos según las
            responsabilidades de cada usuario.
          </p>
        </div>
      </div>

      <div className="roles-layout">
        <aside className="glass-card roles-list-card">
          <div className="roles-list-header">
            <h2>
              <Users size={21} />
              Roles
            </h2>

            <button className="small-primary-button">
              <Plus size={17} />
              Nuevo rol
            </button>
          </div>

          <div className="roles-list">
            {roles.map((rol) => (
              <button
                key={rol.nombre}
                className={`role-list-item ${
                  rolSeleccionado ===
                  rol.nombre
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setRolSeleccionado(
                    rol.nombre
                  )
                }
              >
                <ShieldCheck size={22} />

                <div>
                  <strong>{rol.nombre}</strong>
                  <span>
                    {rol.descripcion}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <div className="glass-card permissions-card">
          <div className="permissions-heading">
            <div>
              <h2>
                <ShieldCheck size={24} />
                Permisos del rol
                <span className="role-title-pill">
                  {rolSeleccionado}
                </span>
              </h2>

              <p>
                Los cambios se aplicarán a todos
                los usuarios asociados a este rol.
              </p>
            </div>

            <div className="permission-legend">
              <span>
                <span className="legend-check">
                  ✓
                </span>
                Con permiso
              </span>

              <span>
                <span className="legend-empty" />
                Sin permiso
              </span>
            </div>
          </div>

          <div className="permissions-grid">
            {gruposPermisos.map((grupo) => {
              const Icon = grupo.icono;

              return (
                <article
                  className="permission-module"
                  key={grupo.titulo}
                >
                  <div className="permission-module-title">
                    <div className="permission-icon">
                      <Icon size={20} />
                    </div>

                    <strong>
                      {grupo.titulo}
                    </strong>
                  </div>

                  {grupo.permisos.map(
                    (permiso) => {
                      const clave = `${grupo.titulo}-${permiso}`;

                      return (
                        <label
                          className="permission-check"
                          key={clave}
                        >
                          <input
                            type="checkbox"
                            checked={
                              permisos[clave]
                            }
                            onChange={() =>
                              alternarPermiso(
                                clave
                              )
                            }
                          />

                          <span>
                            {permiso}
                          </span>
                        </label>
                      );
                    }
                  )}
                </article>
              );
            })}
          </div>

          <div className="permissions-actions">
            <button className="button button-secondary">
              <RotateCcw size={18} />
              Restablecer
            </button>

            <button className="button button-primary">
              <Save size={18} />
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RolesPermisosPage;