import {
  useState,
} from "react";

import {
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

import {
  cerrarSesion,
  obtenerUsuarioGuardado,
} from "../../services/auth.service.js";


function Header() {
  const navigate =
    useNavigate();


  /* ======================================
     DROPDOWN
  ====================================== */

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);


  /* ======================================
     FECHA
  ====================================== */

  const fechaActual =
    new Intl.DateTimeFormat(
      "es-SV",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(
      new Date()
    );


  /* ======================================
     USUARIO AUTENTICADO
  ====================================== */

  const [usuario] =
    useState(() =>
      obtenerUsuarioGuardado()
    );


  const nombres =
    usuario?.nombres
    ||
    "Usuario";


  const apellidos =
    usuario?.apellidos
    ||
    "";


  const nombreCompleto =
    `${nombres} ${apellidos}`
      .trim();


  const rol =
    usuario?.rol
    ||
    "Sin rol";


  const correo =
    usuario?.correo
    ||
    "";


  const iniciales =
    `${nombres.charAt(0)}${apellidos.charAt(0)}`
      .toUpperCase();


  /* ======================================
     CERRAR SESIÓN
  ====================================== */

  function handleLogout() {
    setProfileOpen(
      false
    );


    cerrarSesion();


    navigate(
      "/login",
      {
        replace: true,
      }
    );
  }


  return (
    <header className="header">

      {/* ==================================
          BUSCADOR
      ================================== */}

      <div className="header-search">

        <Search
          size={20}
        />

        <input
          placeholder="Buscar buques, contenedores, operaciones..."
        />

      </div>


      {/* ==================================
          ACCIONES
      ================================== */}

      <div className="header-actions">


        {/* ==================================
            FECHA
        ================================== */}

        <div className="header-date">

          <CalendarDays
            size={19}
          />

          <span>
            Hoy, {fechaActual}
          </span>

        </div>


        {/* ==================================
            NOTIFICACIONES
        ================================== */}

        <button
          className="notification-button"
          type="button"
        >

          <Bell
            size={21}
          />

          <span className="notification-number">
            3
          </span>

        </button>


        {/* ==================================
            PERFIL
        ================================== */}

        <div className="profile-container">

          <button
            className="profile-trigger"
            type="button"
            onClick={() =>
              setProfileOpen(
                (value) =>
                  !value
              )
            }
          >

            <div className="profile-photo">

              {iniciales}

            </div>


            <div className="profile-text">

              <strong>
                {nombreCompleto}
              </strong>

              <span>
                {rol}
              </span>

            </div>


            <ChevronDown
              size={17}
            />

          </button>


          {/* ==================================
              MENÚ DEL PERFIL
          ================================== */}

          {profileOpen && (

            <div className="profile-dropdown">

              <div className="profile-dropdown-user">

                <div
                  className="
                    profile-photo
                    profile-photo-large
                  "
                >

                  {iniciales}

                </div>


                <div>

                  <strong>
                    {nombreCompleto}
                  </strong>

                  <span>
                    {rol}
                  </span>

                  {correo && (

                    <small>
                      {correo}
                    </small>

                  )}

                </div>

              </div>


              <div className="profile-divider" />


              {/* PERFIL */}

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(
                    false
                  );

                  navigate(
                    "/perfil"
                  );
                }}
              >

                <UserRound
                  size={19}
                />

                Mi perfil

              </button>


              <div className="profile-divider" />


              {/* CERRAR SESIÓN */}

              <button
                type="button"
                className="logout-option"
                onClick={
                  handleLogout
                }
              >

                <LogOut
                  size={19}
                />

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