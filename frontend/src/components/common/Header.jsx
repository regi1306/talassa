import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  LogOut,
  Search,
  UserRound,
} from "lucide-react";

function Header() {
  const fechaActual = new Intl.DateTimeFormat("es-SV", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] =
    useState(false);

  // =========================================
  // IDENTIFICAR ROL SEGÚN RUTA
  // =========================================

  const esAdministrador =
    location.pathname.startsWith("/usuarios") ||
    location.pathname.startsWith("/roles") ||
    location.pathname.startsWith("/empresas") ||
    location.pathname.startsWith("/catalogos") ||
    location.pathname.startsWith("/auditoria");

  const esRutaOperador =
    location.pathname.startsWith("/muelles") ||
    location.pathname.startsWith("/asignaciones");

  const esRutaInspector =
    location.pathname.startsWith("/inspecciones") ||
    location.pathname.startsWith("/incidencias");

  let rolActual =
    sessionStorage.getItem("talassaRole") ||
    "Operador portuario";

  if (esAdministrador) {
    rolActual = "Administrador";
  }

  if (esRutaOperador) {
    rolActual = "Operador portuario";
  }

  if (esRutaInspector) {
    rolActual = "Inspector";
  }

  let usuarioActual = {
    iniciales: "RC",
    nombre: "Regina Cadenas",
    rol: "Administrador",
    correo: "regina.cadenas@talassa.com",
  };

  if (rolActual === "Operador portuario") {
    usuarioActual = {
      iniciales: "MO",
      nombre: "Martín Oxford",
      rol: "Operador portuario",
      correo: "martin.oxford@talassa.com",
    };
  }

  if (rolActual === "Inspector") {
    usuarioActual = {
      iniciales: "I1",
      nombre: "Inspector 01",
      rol: "Inspector",
      correo: "inspector01@talassa.com",
    };
  }

  const handleLogout = () => {
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <header className="header">
      {/* BUSCADOR */}
      <div className="header-search">
        <Search size={20} />
        <input
          placeholder="Buscar buques, contenedores, operaciones..."
        />
      </div>

      <div className="header-actions">
        {/* FECHA */}
        <div className="header-date">
          <CalendarDays size={19} />
          <span>Hoy, {fechaActual}</span>
        </div>

        {/* NOTIFICACIONES */}
        <button
          className="notification-button"
          type="button"
        >
          <Bell size={21} />
          <span className="notification-number">
            3
          </span>
        </button>

        {/* PERFIL */}
        <div className="profile-container">
          <button
            className="profile-trigger"
            type="button"
            onClick={() =>
              setProfileOpen(
                (value) => !value
              )
            }
          >
            <div className="profile-photo">
              {usuarioActual.iniciales}
            </div>

            <div className="profile-text">
              <strong>
                {usuarioActual.nombre}
              </strong>
              <span>
                {usuarioActual.rol}
              </span>
            </div>

            <ChevronDown size={17} />
          </button>

          {/* MENÚ DEL PERFIL */}
          {profileOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-user">
                <div
                  className="
                    profile-photo
                    profile-photo-large
                  "
                >
                  {usuarioActual.iniciales}
                </div>

                <div>
                  <strong>
                    {usuarioActual.nombre}
                  </strong>
                  <span>
                    {usuarioActual.rol}
                  </span>
                  <small>
                    {usuarioActual.correo}
                  </small>
                </div>
              </div>

              <div className="profile-divider" />

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/perfil");
                }}
              >
                <UserRound size={19} />
                Mi perfil
              </button>

              <div className="profile-divider" />

              <button
                type="button"
                className="logout-option"
                onClick={handleLogout}
              >
                <LogOut size={19} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;