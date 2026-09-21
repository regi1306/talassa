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
} from "../../services/auth.service.js";

import {
  obtenerDatosSesion,
} from "../../utils/usuarioSesion.js";


function Header() {
  const navigate =
    useNavigate();


  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);


  /* ======================================
     USUARIO REAL DE LA SESIÓN
  ====================================== */

  const usuarioActual =
    obtenerDatosSesion();


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
     CERRAR SESIÓN REAL
  ====================================== */

  function handleLogout() {
    setProfileOpen(false);


    cerrarSesion();


    navigate(
      "/login",
      {
        replace: true,
      }
    );
  }


  /*
   * MainLayout normalmente evita llegar
   * aquí sin sesión, pero dejamos un
   * respaldo visual.
   */

  const usuario = {
    iniciales:
      usuarioActual?.iniciales ??
      "US",

    nombre:
      usuarioActual
        ?.nombreMostrar ??
      "Usuario",

    rol:
      usuarioActual
        ?.rolMostrar ??
      "",

    correo:
      usuarioActual
        ?.correoMostrar ??
      "",
  };


  return (
    <header className="header">


      {/* ==================================
          BUSCADOR
      ================================== */}

      <div className="header-search">

        <Search size={20} />

        <input
          placeholder="Buscar buques, contenedores, operaciones..."
        />

      </div>


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

          <Bell size={21} />

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

              {
                usuario.iniciales
              }

            </div>


            <div className="profile-text">

              <strong>
                {
                  usuario.nombre
                }
              </strong>

              <span>
                {
                  usuario.rol
                }
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
                  {
                    usuario.iniciales
                  }
                </div>


                <div>

                  <strong>
                    {
                      usuario.nombre
                    }
                  </strong>

                  <span>
                    {
                      usuario.rol
                    }
                  </span>


                  {usuario.correo && (

                    <small>
                      {
                        usuario.correo
                      }
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