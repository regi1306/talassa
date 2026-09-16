import {
  NavLink,
  useLocation,
} from "react-router-dom";

import {
  Anchor,
  Boxes,
  Building2,
  ClipboardCheck,
  ClipboardList,
  Home,
  RefreshCw,
  ShieldCheck,
  Ship,
  TriangleAlert,
  Users,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const linkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? "active" : ""}`;

  /* ======================================
     ROL ACTUAL
  ====================================== */

  const esAdministrador =
    location.pathname.startsWith("/usuarios") ||
    location.pathname.startsWith("/roles") ||
    location.pathname.startsWith("/empresas") ||
    location.pathname.startsWith("/catalogos") ||
    location.pathname.startsWith("/auditoria");

  const esInspector =
    location.pathname.startsWith("/inspecciones") ||
    location.pathname.startsWith("/incidencias");

  const esOperador =
    location.pathname.startsWith("/muelles") ||
    location.pathname.startsWith("/asignaciones");

  let rolActual =
    sessionStorage.getItem("talassaRole") ||
    "Operador portuario";

  if (esAdministrador) {
    rolActual = "Administrador";

    sessionStorage.setItem(
      "talassaRole",
      "Administrador"
    );
  }

  if (esOperador) {
    rolActual = "Operador portuario";

    sessionStorage.setItem(
      "talassaRole",
      "Operador portuario"
    );
  }

  if (esInspector) {
    rolActual = "Inspector";

    sessionStorage.setItem(
      "talassaRole",
      "Inspector"
    );
  }

  const guardarRol = (rol) => {
    sessionStorage.setItem(
      "talassaRole",
      rol
    );
  };

  return (
    <aside className="sidebar">
      {/* LOGO */}
      <div className="sidebar-brand">
        <img
          src="/logo-talassa.png"
          alt="Logo de TALASSA"
          className="logo-sidebar"
        />
      </div>

      {/* ==================================
          ADMINISTRADOR
      ================================== */}
      {rolActual === "Administrador" && (
        <nav className="sidebar-nav">
          <div className="sidebar-link sidebar-disabled">
            <Home size={22} />
            <span>Dashboard</span>
          </div>

          <NavLink
            to="/usuarios"
            className={linkClass}
          >
            <Users size={22} />
            <span>Usuarios</span>
          </NavLink>

          <NavLink
            to="/roles"
            className={linkClass}
          >
            <ShieldCheck size={22} />
            <span>Roles y permisos</span>
          </NavLink>

          <NavLink
            to="/empresas"
            className={linkClass}
          >
            <Building2 size={22} />
            <span>Empresas</span>
          </NavLink>

          <NavLink
            to="/catalogos"
            className={linkClass}
          >
            <Boxes size={22} />
            <span>Catálogos</span>
          </NavLink>

          <NavLink
            to="/auditoria"
            className={linkClass}
          >
            <ClipboardList size={22} />
            <span>Auditoría</span>
          </NavLink>
        </nav>
      )}

      {/* ==================================
          OPERADOR PORTUARIO
      ================================== */}
      {rolActual === "Operador portuario" && (
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={linkClass}
            onClick={() =>
              guardarRol(
                "Operador portuario"
              )
            }
          >
            <Home size={22} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/buques"
            className={linkClass}
            onClick={() =>
              guardarRol(
                "Operador portuario"
              )
            }
          >
            <Ship size={22} />
            <span>Buques</span>
          </NavLink>

          <NavLink
            to="/muelles"
            className={linkClass}
            onClick={() =>
              guardarRol(
                "Operador portuario"
              )
            }
          >
            <Anchor size={22} />
            <span>Muelles</span>
          </NavLink>

          <NavLink
            to="/operaciones"
            className={linkClass}
            onClick={() =>
              guardarRol(
                "Operador portuario"
              )
            }
          >
            <RefreshCw size={22} />
            <span>Operaciones</span>
          </NavLink>

          <NavLink
            to="/contenedores"
            className={linkClass}
            onClick={() =>
              guardarRol(
                "Operador portuario"
              )
            }
          >
            <Boxes size={22} />
            <span>Contenedores</span>
          </NavLink>
        </nav>
      )}

      {/* ==================================
          INSPECTOR
      ================================== */}
      {rolActual === "Inspector" && (
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={linkClass}
            onClick={() =>
              guardarRol("Inspector")
            }
          >
            <Home size={22} />
            <span>Resumen</span>
          </NavLink>

          <NavLink
            to="/operaciones"
            className={linkClass}
            onClick={() =>
              guardarRol("Inspector")
            }
          >
            <RefreshCw size={22} />
            <span>Operaciones</span>
          </NavLink>

          <NavLink
            to="/contenedores"
            className={linkClass}
            onClick={() =>
              guardarRol("Inspector")
            }
          >
            <Boxes size={22} />
            <span>Contenedores</span>
          </NavLink>

          <NavLink
            to="/inspecciones"
            className={linkClass}
            onClick={() =>
              guardarRol("Inspector")
            }
          >
            <ClipboardCheck size={22} />
            <span>Inspecciones</span>
          </NavLink>

          <NavLink
            to="/incidencias"
            className={linkClass}
            onClick={() =>
              guardarRol("Inspector")
            }
          >
            <TriangleAlert size={22} />
            <span>Incidencias</span>
          </NavLink>
        </nav>
      )}

      {/* FOOTER */}
      <div className="sidebar-footer">
        <Anchor size={26} />
        <div className="sidebar-footer-line" />

        <p>
          Conectando puertos.
          <br />
          Moviendo el mundo.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;