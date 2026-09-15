import {
  AtSign,
  CalendarDays,
  CheckCircle2,
  Clock3,
  KeyRound,
  LockKeyhole,
  Mail,
  Monitor,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";

import "../../styles/perfil.css";


function PerfilPage() {
  /*
    Datos temporales.

    Cuando implementemos autenticación real,
    esta información vendrá del usuario
    almacenado en la sesión.
  */

  const [
    perfil,
    setPerfil,
  ] = useState({
    nombres: "Regina",
    apellidos: "Cadenas",
    usuario: "regina.cadenas",
    correo:
      "regina.cadenas@talassa.com",
    rol: "Administrador",
  });


  const [
    formulario,
    setFormulario,
  ] = useState(perfil);


  const [
    editando,
    setEditando,
  ] = useState(false);


  const [
    guardando,
    setGuardando,
  ] = useState(false);


  const [
    mensajeExito,
    setMensajeExito,
  ] = useState("");


  function manejarCambio(
    evento
  ) {
    const {
      name,
      value,
    } = evento.target;


    setFormulario(
      (actual) => ({
        ...actual,
        [name]: value,
      })
    );


    setMensajeExito("");
  }


  function cancelarEdicion() {
    setFormulario(perfil);

    setEditando(false);

    setMensajeExito("");
  }


  function guardarPerfil(
    evento
  ) {
    evento.preventDefault();


    setGuardando(true);

    setMensajeExito("");


    /*
      TEMPORAL.

      Después aquí llamaremos
      al servicio correspondiente.
    */

    setTimeout(() => {
      setPerfil(formulario);

      setGuardando(false);

      setEditando(false);

      setMensajeExito(
        "La información del perfil fue actualizada correctamente."
      );
    }, 600);
  }


  const iniciales =
    `${perfil.nombres.charAt(0)}${perfil.apellidos.charAt(0)}`
      .toUpperCase();


  return (
    <section className="pagina-perfil">

      {/* ======================================
          FONDO
      ====================================== */}

      <div className="fondo-perfil" />


      {/* ======================================
          ENCABEZADO
      ====================================== */}

      <div className="encabezado-perfil">

        <div>

          <h1>
            Mi perfil
          </h1>


          <p>
            Consulta y administra la información
            asociada a tu cuenta de TALASSA.
          </p>

        </div>


        {!editando && (
          <button
            type="button"
            className="boton-editar-perfil"
            onClick={() => {
              setFormulario(perfil);

              setEditando(true);

              setMensajeExito("");
            }}
          >
            <UserRound size={18} />

            Editar perfil
          </button>
        )}

      </div>


      {/* ======================================
          RESUMEN DE USUARIO
      ====================================== */}

      <article className="glass-card tarjeta-identidad-perfil">

        <div className="avatar-principal-perfil">
          {iniciales}
        </div>


        <div className="identidad-perfil">

          <span>
            Usuario actual
          </span>


          <h2>
            {perfil.nombres}
            {" "}
            {perfil.apellidos}
          </h2>


          <p>
            @{perfil.usuario}
          </p>

        </div>


        <div className="separador-identidad-perfil" />


        <div className="dato-rapido-perfil">

          <span>
            Rol
          </span>


          <strong>
            <ShieldCheck size={16} />

            {perfil.rol}
          </strong>

        </div>


        <div className="dato-rapido-perfil">

          <span>
            Estado
          </span>


          <strong className="estado-cuenta-perfil">
            <i />

            Activo
          </strong>

        </div>


        <div className="dato-rapido-perfil">

          <span>
            Cuenta creada
          </span>


          <strong>
            12 ene. 2026
          </strong>

        </div>

      </article>


      {/* ======================================
          CONTENIDO PRINCIPAL
      ====================================== */}

      <div className="rejilla-perfil">

        {/* ======================================
            INFORMACION PERSONAL
        ====================================== */}

        <article className="glass-card tarjeta-perfil">

          <div className="titulo-tarjeta-perfil">

            <div className="icono-titulo-perfil">
              <UserRound size={20} />
            </div>


            <div>

              <h2>
                Información personal
              </h2>


              <p>
                Datos asociados a tu cuenta.
              </p>

            </div>

          </div>


          {!editando ? (

            <div className="lista-informacion-perfil">

              <div className="dato-perfil">

                <div className="icono-dato-perfil">
                  <UserRound size={18} />
                </div>


                <div>

                  <span>
                    Nombre completo
                  </span>


                  <strong>
                    {perfil.nombres}
                    {" "}
                    {perfil.apellidos}
                  </strong>

                </div>

              </div>


              <div className="dato-perfil">

                <div className="icono-dato-perfil">
                  <AtSign size={18} />
                </div>


                <div>

                  <span>
                    Nombre de usuario
                  </span>


                  <strong>
                    {perfil.usuario}
                  </strong>

                </div>

              </div>


              <div className="dato-perfil">

                <div className="icono-dato-perfil">
                  <Mail size={18} />
                </div>


                <div>

                  <span>
                    Correo electrónico
                  </span>


                  <strong>
                    {perfil.correo}
                  </strong>

                </div>

              </div>


              <div className="dato-perfil">

                <div className="icono-dato-perfil">
                  <ShieldCheck size={18} />
                </div>


                <div>

                  <span>
                    Rol asignado
                  </span>


                  <strong>
                    {perfil.rol}
                  </strong>


                  <small>
                    El rol solo puede ser modificado
                    desde Administración de usuarios.
                  </small>

                </div>

              </div>

            </div>

          ) : (

            <form
              className="formulario-editar-perfil"
              onSubmit={guardarPerfil}
            >

              <div className="rejilla-formulario-perfil">

                <div className="campo-perfil">

                  <label htmlFor="nombres">
                    Nombres
                  </label>


                  <div className="entrada-perfil">

                    <UserRound size={17} />


                    <input
                      id="nombres"
                      name="nombres"
                      type="text"
                      value={
                        formulario.nombres
                      }
                      onChange={
                        manejarCambio
                      }
                    />

                  </div>

                </div>


                <div className="campo-perfil">

                  <label htmlFor="apellidos">
                    Apellidos
                  </label>


                  <div className="entrada-perfil">

                    <UserRound size={17} />


                    <input
                      id="apellidos"
                      name="apellidos"
                      type="text"
                      value={
                        formulario.apellidos
                      }
                      onChange={
                        manejarCambio
                      }
                    />

                  </div>

                </div>


                <div className="campo-perfil campo-perfil-completo">

                  <label htmlFor="correo">
                    Correo electrónico
                  </label>


                  <div className="entrada-perfil">

                    <Mail size={17} />


                    <input
                      id="correo"
                      name="correo"
                      type="email"
                      value={
                        formulario.correo
                      }
                      onChange={
                        manejarCambio
                      }
                    />

                  </div>

                </div>


                <div className="campo-perfil campo-perfil-completo">

                  <label htmlFor="usuario">
                    Nombre de usuario
                  </label>


                  <div className="entrada-perfil">

                    <AtSign size={17} />


                    <input
                      id="usuario"
                      name="usuario"
                      type="text"
                      value={
                        formulario.usuario
                      }
                      onChange={
                        manejarCambio
                      }
                    />

                  </div>

                </div>

              </div>


              <div className="acciones-editar-perfil">

                <button
                  type="button"
                  className="boton-cancelar-perfil"
                  onClick={
                    cancelarEdicion
                  }
                  disabled={
                    guardando
                  }
                >
                  Cancelar
                </button>


                <button
                  type="submit"
                  className="boton-guardar-perfil"
                  disabled={
                    guardando
                  }
                >
                  <Save size={17} />

                  {guardando
                    ? "Guardando..."
                    : "Guardar cambios"}
                </button>

              </div>

            </form>

          )}


          {mensajeExito && (

            <div className="mensaje-exito-perfil">

              <CheckCircle2 size={17} />

              {mensajeExito}

            </div>

          )}

        </article>


        {/* ======================================
            SEGURIDAD
        ====================================== */}

        <article className="glass-card tarjeta-perfil">

          <div className="titulo-tarjeta-perfil">

            <div className="icono-titulo-perfil seguridad">
              <LockKeyhole size={20} />
            </div>


            <div>

              <h2>
                Seguridad de la cuenta
              </h2>


              <p>
                Información relacionada con
                tus credenciales.
              </p>

            </div>

          </div>


          <div className="lista-seguridad-perfil">

            <div className="item-seguridad-perfil">

              <div className="icono-opcion-seguridad">
                <KeyRound size={19} />
              </div>


              <div>

                <strong>
                  Contraseña
                </strong>


                <span>
                  Última actualización:
                  {" "}
                  20 ago. 2026
                </span>

              </div>


              <button
                type="button"
                disabled
                title="Disponible al conectar la autenticación"
              >
                Cambiar
              </button>

            </div>


            <div className="aviso-seguridad-perfil">

              <ShieldCheck size={18} />


              <p>
                Las credenciales y cambios de
                contraseña estarán protegidos
                por el sistema de autenticación
                cuando conectemos el backend.
              </p>

            </div>

          </div>

        </article>

      </div>


      {/* ======================================
          SESIÓN ACTUAL
      ====================================== */}

      <article className="glass-card tarjeta-sesion-perfil">

        <div className="titulo-tarjeta-perfil">

          <div className="icono-titulo-perfil sesion">
            <Monitor size={20} />
          </div>


          <div>

            <h2>
              Sesión actual
            </h2>


            <p>
              Información de la sesión
              iniciada actualmente.
            </p>

          </div>

        </div>


        <div className="rejilla-sesion-perfil">

          <div className="dato-sesion-perfil">

            <Monitor size={19} />


            <div>

              <span>
                Dispositivo
              </span>


              <strong>
                Navegador web
              </strong>

            </div>

          </div>


          <div className="dato-sesion-perfil">

            <CalendarDays size={19} />


            <div>

              <span>
                Fecha de acceso
              </span>


              <strong>
                15 sep. 2026
              </strong>

            </div>

          </div>


          <div className="dato-sesion-perfil">

            <Clock3 size={19} />


            <div>

              <span>
                Estado
              </span>


              <strong className="sesion-activa-perfil">
                <i />

                Sesión activa
              </strong>

            </div>

          </div>

        </div>

      </article>

    </section>
  );
}


export default PerfilPage;