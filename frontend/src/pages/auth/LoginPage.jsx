import { useState } from "react";
import {
  Anchor,
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [mostrarPassword, setMostrarPassword] =
    useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    navigate("/usuarios");
  };

  return (
    <div className="login-screen">
      <div className="login-background" />

      <div className="login-slogan">
        <span />
        <p>
          PUERTOS MÁS INTELIGENTES
          <br />
          PARA UN MUNDO MÁS CONECTADO.
        </p>
      </div>

      <div className="login-panel">
        <div className="login-logo">
          <div className="login-ship">
            🚢
          </div>

          <strong>TALASSA</strong>
        </div>

        <div className="login-title">
          <h1>
            Bienvenido a TALASSA
          </h1>

          <p>
            Gestión y monitoreo de operaciones
            portuarias.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Usuario o correo

            <div className="login-input">
              <UserRound size={20} />

              <input
                placeholder="Ingresa tu usuario o correo"
              />
            </div>
          </label>

          <label>
            Contraseña

            <div className="login-input">
              <LockKeyhole size={20} />

              <input
                type={
                  mostrarPassword
                    ? "text"
                    : "password"
                }
                placeholder="Ingresa tu contraseña"
              />

              <button
                type="button"
                onClick={() =>
                  setMostrarPassword(
                    (valor) => !valor
                  )
                }
              >
                {mostrarPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </label>

          <div className="login-options">
            <label>
              <input
                type="checkbox"
                defaultChecked
              />
              Recordarme en este dispositivo
            </label>

            <button type="button">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button className="login-submit">
            Iniciar sesión
            <span>→</span>
          </button>
        </form>

        <div className="login-first-time">
          <span />
          <p>
            ¿Primera vez en TALASSA?
          </p>
          <span />
        </div>

        <button className="contact-admin">
          Contacta a tu administrador
        </button>
      </div>

      <footer className="login-footer">
        <div>
          <Anchor size={25} />

          <span>
            Conectando puertos. Moviendo el
            mundo.
          </span>
        </div>

        <span>
          TALASSA © 2026
        </span>
      </footer>
    </div>
  );
}

export default LoginPage;