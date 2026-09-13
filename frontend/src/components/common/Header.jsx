import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  LogOut,
  Search,
  Settings,
  UserRound,
} from "lucide-react";

function Header() {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] =
    useState(false);

  const handleLogout = () => {
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-search">
        <Search size={20} />

        <input
          placeholder="Buscar buques, contenedores, operaciones..."
        />
      </div>

      <div className="header-actions">
        <div className="header-date">
          <CalendarDays size={19} />

          <span>Hoy, 14 de abr. de 2024</span>
        </div>

        <button
          className="notification-button"
          type="button"
        >
          <Bell size={21} />

          <span className="notification-number">
            3
          </span>
        </button>

        <div className="profile-container">
          <button
            className="profile-trigger"
            type="button"
            onClick={() =>
              setProfileOpen((value) => !value)
            }
          >
            <div className="profile-photo">
              RC
            </div>

            <div className="profile-text">
              <strong>Regina Cadenas</strong>
              <span>Administrador</span>
            </div>

            <ChevronDown size={17} />
          </button>

          {profileOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-user">
                <div className="profile-photo profile-photo-large">
                  RC
                </div>

                <div>
                  <strong>Regina Cadenas</strong>
                  <span>Administrador</span>
                  <small>
                    regina.cadenas@talassa.com
                  </small>
                </div>
              </div>

              <div className="profile-divider" />

              <button type="button">
                <UserRound size={19} />
                Mi perfil
              </button>

              <button type="button">
                <Settings size={19} />
                Configuración
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