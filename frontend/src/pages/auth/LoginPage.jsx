import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  guardarSesion,
  iniciarSesion,
} from "../../services/auth.service.js";

import "../../styles/login.css";


function LoginPage() {
  const navigate = useNavigate();


  /* ======================================
     FORMULARIO
  ====================================== */

  const [form, setForm] = useState({
    usuario: "",
    password: "",
    recordar: false,
  });


  const [errores, setErrores] =
    useState({});


  const [
    mostrarPassword,
    setMostrarPassword,
  ] = useState(false);


  const [loading, setLoading] =
    useState(false);


  const [
    errorGeneral,
    setErrorGeneral,
  ] = useState("");


  const [
    mensajeInformativo,
    setMensajeInformativo,
  ] = useState("");


  /* ======================================
     CAMBIO DE CAMPOS
  ====================================== */

  function manejarCambio(evento) {
    const {
      name,
      value,
      type,
      checked,
    } = evento.target;


    setForm((actual) => ({
      ...actual,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));


    setErrores((actual) => ({
      ...actual,
      [name]: "",
    }));


    setErrorGeneral("");

    setMensajeInformativo("");
  }


  /* ======================================
     VALIDAR FORMULARIO
  ====================================== */

  function validarFormulario() {
    const nuevosErrores = {};


    if (!form.usuario.trim()) {
      nuevosErrores.usuario =
        "Ingresa tu nombre de usuario.";
    }


    if (!form.password) {
      nuevosErrores.password =
        "Ingresa tu contraseña.";
    }


    setErrores(nuevosErrores);


    return (
      Object.keys(
        nuevosErrores
      ).length === 0
    );
  }


  /* ======================================
     INICIAR SESIÓN REAL
  ====================================== */

  async function manejarSubmit(evento) {
    evento.preventDefault();


    setErrorGeneral("");

    setMensajeInformativo("");


    if (!validarFormulario()) {
      return;
    }


    try {
      setLoading(true);


      const respuesta =
        await iniciarSesion(
          form.usuario.trim(),
          form.password
        );


      const {
        token,
        usuario,
      } = respuesta.data;


      guardarSesion(
        token,
        usuario,
        form.recordar
      );


      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

    } catch (error) {
      console.error(
        "Error de inicio de sesión:",
        error
      );


      const status =
        error.response?.status;


      const mensajeBackend =
        error.response
          ?.data
          ?.message;


      if (status === 401) {
        setErrorGeneral(
          mensajeBackend ||
            "Usuario o contraseña incorrectos."
        );
      }

      else if (status === 403) {
        setErrorGeneral(
          mensajeBackend ||
            "La cuenta se encuentra inactiva. Contacta al administrador."
        );
      }

      else if (
        error.code ===
        "ERR_NETWORK"
      ) {
        setErrorGeneral(
          "No fue posible conectar con el servidor de TALASSA."
        );
      }

      else {
        setErrorGeneral(
          mensajeBackend ||
            "No fue posible iniciar sesión. Intenta nuevamente."
        );
      }

    } finally {
      setLoading(false);
    }
  }


  /* ======================================
     RECUPERACIÓN
  ====================================== */

  function manejarRecuperacion() {
    setErrorGeneral("");


    setMensajeInformativo(
      "Para restablecer tu acceso, contacta al administrador del sistema."
    );
  }


  return (
    <main className="pagina-login-talassa">

      {/* ==================================
          FONDO
      ================================== */}

      <div className="fondo-login-talassa" />


      {/* ==================================
          MENSAJE SUPERIOR
      ================================== */}

      <div className="mensaje-superior-login">

        <span />


        <p>
          GESTIÓN PORTUARIA
          <br />
          SEGURA Y CENTRALIZADA
        </p>

      </div>


      {/* ==================================
          CONTENIDO
      ================================== */}

      <section className="contenido-login-talassa">

        {/* ================================
            PANEL DEL LOGIN
        ================================ */}

        <article className="panel-login-talassa">

          {/* LOGO */}

          <div className="marca-login-talassa">

            <img
              src="/logo-talassa.png"
              alt="TALASSA"
            />

          </div>


          {/* ENCABEZADO */}

          <div className="encabezado-login-talassa">

            <h1>
              Bienvenido
            </h1>


            <p>
              Ingresa tus credenciales
              para acceder al sistema.
            </p>

          </div>


          {/* FORMULARIO */}

          <form
            className="formulario-login-talassa"
            onSubmit={manejarSubmit}
            noValidate
          >

            {/* USUARIO */}

            <div className="campo-login-talassa">

              <label htmlFor="usuario">
                Usuario
              </label>


              <div
                className={
                  `entrada-login-talassa ${
                    errores.usuario
                      ? "con-error"
                      : ""
                  }`
                }
              >

                <ShieldCheck size={18} />


                <input
                  id="usuario"
                  name="usuario"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  autoComplete="username"
                  value={form.usuario}
                  onChange={manejarCambio}
                  disabled={loading}
                />

              </div>


              {errores.usuario && (

                <span className="error-campo-login">
                  {errores.usuario}
                </span>

              )}

            </div>


            {/* CONTRASEÑA */}

            <div className="campo-login-talassa">

              <label htmlFor="password">
                Contraseña
              </label>


              <div
                className={
                  `entrada-login-talassa ${
                    errores.password
                      ? "con-error"
                      : ""
                  }`
                }
              >

                <KeyRound size={18} />


                <input
                  id="password"
                  name="password"
                  type={
                    mostrarPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={manejarCambio}
                  disabled={loading}
                />


                <button
                  type="button"
                  className="boton-ver-password-login"
                  onClick={() =>
                    setMostrarPassword(
                      (actual) =>
                        !actual
                    )
                  }
                  disabled={loading}
                  aria-label={
                    mostrarPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >

                  {mostrarPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}

                </button>

              </div>


              {errores.password && (

                <span className="error-campo-login">
                  {errores.password}
                </span>

              )}

            </div>


            {/* OPCIONES */}

            <div className="opciones-login-talassa">

              <label className="recordar-login">

                <input
                  type="checkbox"
                  name="recordar"
                  checked={
                    form.recordar
                  }
                  onChange={
                    manejarCambio
                  }
                  disabled={
                    loading
                  }
                />


                <span />


                Recordarme

              </label>


              <button
                type="button"
                className="boton-recuperar-login"
                onClick={
                  manejarRecuperacion
                }
                disabled={
                  loading
                }
              >
                ¿Olvidaste tu contraseña?
              </button>

            </div>


            {/* ERROR DEL BACKEND */}

            {errorGeneral && (

              <div className="mensaje-login-talassa">

                <LockKeyhole size={17} />


                <span>
                  {errorGeneral}
                </span>

              </div>

            )}


            {/* MENSAJE INFORMATIVO */}

            {mensajeInformativo && (

              <div className="mensaje-login-talassa">

                <ShieldCheck size={17} />


                <span>
                  {mensajeInformativo}
                </span>

              </div>

            )}


            {/* BOTÓN LOGIN */}

            <button
              type="submit"
              className="boton-ingresar-talassa"
              disabled={loading}
            >

              <span>
                {loading
                  ? "Verificando..."
                  : "Iniciar sesión"}
              </span>


              {loading ? (

                <LoaderCircle
                  size={18}
                  className="icono-cargando-login"
                />

              ) : (

                <ArrowRight size={18} />

              )}

            </button>

          </form>


          {/* SEGURIDAD */}

          <div className="seguridad-login-talassa">

            <div className="icono-seguridad-login">

              <LockKeyhole size={15} />

            </div>


            <p>
              Acceso protegido para
              usuarios autorizados.
            </p>

          </div>

        </article>


        {/* ================================
            INFORMACIÓN LATERAL
        ================================ */}

        <aside className="informacion-lateral-login">

          <div className="linea-lateral-login" />


          <span>
            SISTEMA TALASSA
          </span>


          <h2>
            Operaciones
            <br />
            portuarias
            <br />
            conectadas.
          </h2>


          <p>
            Gestión, seguimiento y control
            de las operaciones portuarias
            desde una experiencia
            centralizada.
          </p>

        </aside>

      </section>


      {/* ==================================
          FOOTER
      ================================== */}

      <footer className="footer-login-talassa">

        <div>

          <LockKeyhole size={13} />


          <span>
            Acceso seguro
          </span>

        </div>


        <div>

          <span>
            © 2026 TALASSA
          </span>

        </div>

      </footer>

    </main>
  );
}


export default LoginPage;