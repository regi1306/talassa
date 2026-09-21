import {
  NavLink,
} from "react-router-dom";

import {
  Anchor,
  Boxes,
  Building2,
  ClipboardCheck,
  ClipboardList,
  Home,
  Package,
  RefreshCw,
  ShieldCheck,
  Ship,
  TriangleAlert,
  Users,
} from "lucide-react";

import {
  obtenerDatosSesion,
} from "../../utils/usuarioSesion.js";


function Sidebar() {


  /* ======================================
     CLASE DEL LINK
  ====================================== */

  const linkClass = ({
    isActive,
  }) =>
    `sidebar-link ${
      isActive
        ? "active"
        : ""
    }`;


  /* ======================================
     ROL REAL DEL USUARIO AUTENTICADO
  ====================================== */

  const usuario =
    obtenerDatosSesion();


  const rolActual =
    usuario?.rolMostrar ??
    "";


  return (
    <aside className="sidebar">


      {/* ==================================
          LOGO
      ================================== */}

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

      {rolActual ===
        "Administrador" && (

        <nav className="sidebar-nav">


          <div className="sidebar-link sidebar-disabled">

            <Home size={22} />

            <span>
              Dashboard
            </span>

          </div>


          <NavLink
            to="/usuarios"
            className={
              linkClass
            }
          >

            <Users size={22} />

            <span>
              Usuarios
            </span>

          </NavLink>


          <NavLink
            to="/roles"
            className={
              linkClass
            }
          >

            <ShieldCheck
              size={22}
            />

            <span>
              Roles y permisos
            </span>

          </NavLink>


          <NavLink
            to="/empresas"
            className={
              linkClass
            }
          >

            <Building2
              size={22}
            />

            <span>
              Empresas
            </span>

          </NavLink>


          <NavLink
            to="/catalogos"
            className={
              linkClass
            }
          >

            <Boxes size={22} />

            <span>
              Catálogos
            </span>

          </NavLink>


          <NavLink
            to="/auditoria"
            className={
              linkClass
            }
          >

            <ClipboardList
              size={22}
            />

            <span>
              Auditoría
            </span>

          </NavLink>

        </nav>

      )}


      {/* ==================================
          OPERADOR PORTUARIO
      ================================== */}

      {rolActual ===
        "Operador portuario" && (

        <nav className="sidebar-nav">


          <NavLink
            to="/dashboard"
            className={
              linkClass
            }
          >

            <Home size={22} />

            <span>
              Dashboard
            </span>

          </NavLink>


          <NavLink
            to="/buques"
            className={
              linkClass
            }
          >

            <Ship size={22} />

            <span>
              Buques
            </span>

          </NavLink>


          <NavLink
            to="/muelles"
            className={
              linkClass
            }
          >

            <Anchor size={22} />

            <span>
              Muelles
            </span>

          </NavLink>


          <NavLink
            to="/operaciones"
            className={
              linkClass
            }
          >

            <RefreshCw
              size={22}
            />

            <span>
              Operaciones
            </span>

          </NavLink>


          <NavLink
            to="/contenedores"
            className={
              linkClass
            }
          >

            <Package size={22} />

            <span>
              Contenedores
            </span>

          </NavLink>

        </nav>

      )}


      {/* ==================================
          INSPECTOR
      ================================== */}

      {rolActual ===
        "Inspector" && (

        <nav className="sidebar-nav">


          <NavLink
            to="/dashboard"
            className={
              linkClass
            }
          >

            <Home size={22} />

            <span>
              Resumen
            </span>

          </NavLink>


          <NavLink
            to="/operaciones"
            className={
              linkClass
            }
          >

            <RefreshCw
              size={22}
            />

            <span>
              Operaciones
            </span>

          </NavLink>


          <NavLink
            to="/contenedores"
            className={
              linkClass
            }
          >

            <Package size={22} />

            <span>
              Contenedores
            </span>

          </NavLink>


          <NavLink
            to="/inspecciones"
            className={
              linkClass
            }
          >

            <ClipboardCheck
              size={22}
            />

            <span>
              Inspecciones
            </span>

          </NavLink>


          <NavLink
            to="/incidencias"
            className={
              linkClass
            }
          >

            <TriangleAlert
              size={22}
            />

            <span>
              Incidencias
            </span>

          </NavLink>

        </nav>

      )}


      {/* ==================================
          ROL NO RECONOCIDO
      ================================== */}

      {![
        "Administrador",
        "Operador portuario",
        "Inspector",
      ].includes(
        rolActual
      ) && (

        <nav className="sidebar-nav">

          <div className="sidebar-link sidebar-disabled">

            <Users size={22} />

            <span>
              Sesión sin rol válido
            </span>

          </div>

        </nav>

      )}


      {/* ==================================
          FOOTER
      ================================== */}

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