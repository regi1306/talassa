import { NavLink } from "react-router-dom";
import {
  Anchor,
  Building2,
  ClipboardList,
  Home,
  ShieldCheck,
  Users,
  Boxes,
} from "lucide-react";

function Sidebar() {
  const linkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? "active" : ""}`;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-ship">🚢</div>

        <div className="brand-name">
          TALASSA
        </div>
      </div>

      <nav className="sidebar-nav">
        
        <NavLink to="/dashboard" className={linkClass}>
        <Home size={22} />
        <span>Dashboard</span>
        </NavLink>

        <NavLink to="/usuarios" className={linkClass}>
          <Users size={22} />
          <span>Usuarios</span>
        </NavLink>

        <NavLink to="/roles" className={linkClass}>
          <ShieldCheck size={22} />
          <span>Roles y permisos</span>
        </NavLink>

        <NavLink to="/empresas" className={linkClass}>
          <Building2 size={22} />
          <span>Empresas</span>
        </NavLink>

        <NavLink to="/catalogos" className={linkClass}>
          <Boxes size={22} />
          <span>Catálogos</span>
        </NavLink>

        <NavLink to="/auditoria" className={linkClass}>
          <ClipboardList size={22} />
          <span>Auditoría</span>
        </NavLink>
      </nav>

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