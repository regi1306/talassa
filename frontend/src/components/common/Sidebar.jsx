import { NavLink } from "react-router-dom";

import {
  Anchor,
  Building2,
  ClipboardList,
  Home,
  ShieldCheck,
  Users,
  Boxes,
  Ship,
} from "lucide-react";

import {
  obtenerUsuarioGuardado,
} from "../../services/auth.service.js";


function Sidebar() {
  const usuario =
    obtenerUsuarioGuardado();


  const permisos =
    usuario?.permisos || [];


  /* ======================================
     COMPROBAR PERMISO
  ====================================== */

  function tienePermiso(
    permiso
  ) {
    return permisos.includes(
      permiso
    );
  }


  /* ======================================
     CLASE DE LOS ENLACES
  ====================================== */

  const linkClass = ({
    isActive,
  }) =>
    `sidebar-link ${
      isActive
        ? "active"
        : ""
    }`;


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
          NAVEGACIÓN
      ================================== */}

      <nav className="sidebar-nav">


        {/* DASHBOARD */}

        {tienePermiso(
          "DASH_VER"
        ) && (

          <NavLink
            to="/dashboard"
            className={linkClass}
          >

            <Home size={22} />

            <span>
              Dashboard
            </span>

          </NavLink>

        )}


        {/* ==================================
            BUQUES
        ================================== */}

        {tienePermiso(
          "BUQ_VER"
        ) && (

          <NavLink
            to="/buques"
            className={linkClass}
          >

            <Ship size={22} />

            <span>
              Buques
            </span>

          </NavLink>

        )}


        {/* ==================================
            OPERACIONES
        ================================== */}

        {tienePermiso(
          "OPE_VER"
        ) && (

          <NavLink
            to="/operaciones"
            className={linkClass}
          >

            <ClipboardList size={22} />

            <span>
              Operaciones
            </span>

          </NavLink>

        )}


        {/* ==================================
            USUARIOS
        ================================== */}

        {tienePermiso(
          "USR_VER"
        ) && (

          <NavLink
            to="/usuarios"
            className={linkClass}
          >

            <Users size={22} />

            <span>
              Usuarios
            </span>

          </NavLink>

        )}


        {/* ==================================
            ROLES Y PERMISOS
        ================================== */}

        {tienePermiso(
          "ROL_GESTIONAR"
        ) && (

          <NavLink
            to="/roles"
            className={linkClass}
          >

            <ShieldCheck size={22} />

            <span>
              Roles y permisos
            </span>

          </NavLink>

        )}


        {/* ==================================
            EMPRESAS
        ================================== */}

        {tienePermiso(
          "EMP_VER"
        ) && (

          <NavLink
            to="/empresas"
            className={linkClass}
          >

            <Building2 size={22} />

            <span>
              Empresas
            </span>

          </NavLink>

        )}


        {/* ==================================
            CATÁLOGOS
        ================================== */}

        {tienePermiso(
          "CAT_VER"
        ) && (

          <NavLink
            to="/catalogos"
            className={linkClass}
          >

            <Boxes size={22} />

            <span>
              Catálogos
            </span>

          </NavLink>

        )}


        {/* ==================================
            AUDITORÍA
        ================================== */}

        {tienePermiso(
          "AUD_VER"
        ) && (

          <NavLink
            to="/auditoria"
            className={linkClass}
          >

            <ClipboardList size={22} />

            <span>
              Auditoría
            </span>

          </NavLink>

        )}

      </nav>


      {/* ==================================
          PIE DEL SIDEBAR
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