import {
  ArrowLeft,
  AtSign,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "../../styles/formularioUsuario.css";


const formularioInicial = {
  nombres: "",
  apellidos: "",
  correo: "",
  usuario: "",
  password: "",
  confirmarPassword: "",
  rol: "",
  activo: true,
};


function UsuarioFormPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const esEdicion =
    Boolean(id);


  const [
    formulario,
    setFormulario,
  ] = useState(formularioInicial);


  const [
    errores,
    setErrores,
  ] = useState({});


  const [
    mostrarPassword,
    setMostrarPassword,
  ] = useState(false);


  const [
    mostrarConfirmacion,
    setMostrarConfirmacion,
  ] = useState(false);


  const [
    cargandoPagina,
    setCargandoPagina,
  ] = useState(esEdicion);


  const [
    enviando,
    setEnviando,
  ] = useState(false);


  const [
    errorGeneral,
    setErrorGeneral,
  ] = useState("");


  const [
    mensajeExito,
    setMensajeExito,
  ] = useState("");


  /* ======================================
     DATOS TEMPORALES PARA EDICIÓN

     Más adelante esto será reemplazado
     por una consulta a la API.
  ====================================== */

  useEffect(() => {
    if (!esEdicion) {
      return;
    }


    const temporizador =
      setTimeout(() => {
        setFormulario({
          nombres: "Carlos",
          apellidos: "Romero",
          correo:
            "carlos.romero@talassa.com",
          usuario:
            "carlos.romero",
          password: "",
          confirmarPassword: "",
          rol:
            "Operador portuario",
          activo: true,
        });

        setCargandoPagina(false);
      }, 400);


    return () =>
      clearTimeout(temporizador);
  }, [esEdicion, id]);


  function manejarCambio(evento) {
    const {
      name,
      value,
    } = evento.target;


    setFormulario(
      (formularioActual) => ({
        ...formularioActual,
        [name]: value,
      })
    );


    if (errores[name]) {
      setErrores(
        (erroresActuales) => ({
          ...erroresActuales,
          [name]: "",
        })
      );
    }


    if (errorGeneral) {
      setErrorGeneral("");
    }
  }


  function cambiarEstado(estado) {
    setFormulario(
      (formularioActual) => ({
        ...formularioActual,
        activo: estado,
      })
    );
  }


  function validarFormulario() {
    const nuevosErrores = {};


    if (!formulario.nombres.trim()) {
      nuevosErrores.nombres =
        "Ingrese el nombre del usuario.";
    }


    if (!formulario.apellidos.trim()) {
      nuevosErrores.apellidos =
        "Ingrese el apellido del usuario.";
    }


    if (!formulario.correo.trim()) {
      nuevosErrores.correo =
        "Ingrese un correo electrónico.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formulario.correo
      )
    ) {
      nuevosErrores.correo =
        "Ingrese un correo válido.";
    }


    if (!formulario.usuario.trim()) {
      nuevosErrores.usuario =
        "Ingrese un nombre de usuario.";
    }


    /*
      En edición, dejar la contraseña vacía
      significa conservar la contraseña actual.
    */

    if (!esEdicion) {
      if (!formulario.password) {
        nuevosErrores.password =
          "Ingrese una contraseña.";
      } else if (
        formulario.password.length < 8
      ) {
        nuevosErrores.password =
          "La contraseña debe tener al menos 8 caracteres.";
      }


      if (
        formulario.password !==
        formulario.confirmarPassword
      ) {
        nuevosErrores.confirmarPassword =
          "Las contraseñas no coinciden.";
      }
    }


    if (
      esEdicion &&
      formulario.password
    ) {
      if (
        formulario.password.length < 8
      ) {
        nuevosErrores.password =
          "La contraseña debe tener al menos 8 caracteres.";
      }


      if (
        formulario.password !==
        formulario.confirmarPassword
      ) {
        nuevosErrores.confirmarPassword =
          "Las contraseñas no coinciden.";
      }
    }


    if (!formulario.rol) {
      nuevosErrores.rol =
        "Seleccione un rol.";
    }


    setErrores(nuevosErrores);


    return (
      Object.keys(
        nuevosErrores
      ).length === 0
    );
  }


  function regresar() {
    navigate("/usuarios");
  }


  function manejarEnvio(evento) {
    evento.preventDefault();


    if (!validarFormulario()) {
      return;
    }


    setEnviando(true);

    setErrorGeneral("");

    setMensajeExito("");


    /*
      TEMPORAL:
      Más adelante aquí se llamará
      al servicio del backend.
    */

    setTimeout(() => {
      setMensajeExito(
        esEdicion
          ? "Los cambios del usuario se guardaron correctamente."
          : "El usuario fue registrado correctamente."
      );


      setEnviando(false);


      setTimeout(() => {
        navigate("/usuarios");
      }, 700);
    }, 600);
  }


  if (
    cargandoPagina &&
    esEdicion
  ) {
    return (
      <section className="pagina-formulario-usuario">

        <div className="mensaje-informativo-usuario">

          <LoaderCircle
            size={18}
            className="icono-girando-usuario"
          />

          Cargando información del usuario...

        </div>

      </section>
    );
  }


  return (
    <section className="pagina-formulario-usuario">

      {/* ======================================
          ENCABEZADO
      ====================================== */}

      <div className="encabezado-formulario-usuario">

        <button
          type="button"
          className="boton-volver-usuarios"
          onClick={regresar}
        >
          <ArrowLeft size={18} />

          Volver a Usuarios
        </button>


        <div>

          <h1>
            {esEdicion
              ? "Editar usuario"
              : "Registrar nuevo usuario"}
          </h1>


          <p>
            {esEdicion
              ? "Actualice la información, credenciales y permisos generales de la cuenta."
              : "Ingrese la información necesaria para crear una nueva cuenta en TALASSA."}
          </p>

        </div>

      </div>


      {/* ======================================
          FORMULARIO
      ====================================== */}

      <form
        className="glass-card formulario-usuario"
        onSubmit={manejarEnvio}
        noValidate
      >

        {/* ======================================
            INFORMACIÓN PERSONAL
        ====================================== */}

        <section className="seccion-formulario-usuario">

          <div className="titulo-seccion-usuario">

            <div className="icono-seccion-usuario">
              <UserRound size={21} />
            </div>


            <div>

              <h2>
                Información personal
              </h2>

              <p>
                Datos básicos de identificación
                del usuario.
              </p>

            </div>

          </div>


          <div className="rejilla-formulario-usuario">

            {/* NOMBRES */}

            <div className="campo-formulario-usuario">

              <label htmlFor="nombres">
                Nombres
                <span>*</span>
              </label>


              <div
                className={
                  errores.nombres
                    ? "entrada-usuario con-error"
                    : "entrada-usuario"
                }
              >

                <UserRound size={18} />


                <input
                  id="nombres"
                  name="nombres"
                  type="text"
                  value={
                    formulario.nombres
                  }
                  onChange={manejarCambio}
                  placeholder="Ej. Carlos"
                  maxLength={100}
                />

              </div>


              {errores.nombres && (
                <small className="mensaje-error-campo-usuario">
                  {errores.nombres}
                </small>
              )}

            </div>


            {/* APELLIDOS */}

            <div className="campo-formulario-usuario">

              <label htmlFor="apellidos">
                Apellidos
                <span>*</span>
              </label>


              <div
                className={
                  errores.apellidos
                    ? "entrada-usuario con-error"
                    : "entrada-usuario"
                }
              >

                <UserRound size={18} />


                <input
                  id="apellidos"
                  name="apellidos"
                  type="text"
                  value={
                    formulario.apellidos
                  }
                  onChange={manejarCambio}
                  placeholder="Ej. Romero"
                  maxLength={100}
                />

              </div>


              {errores.apellidos && (
                <small className="mensaje-error-campo-usuario">
                  {errores.apellidos}
                </small>
              )}

            </div>


            {/* CORREO */}

            <div className="campo-formulario-usuario">

              <label htmlFor="correo">
                Correo electrónico
                <span>*</span>
              </label>


              <div
                className={
                  errores.correo
                    ? "entrada-usuario con-error"
                    : "entrada-usuario"
                }
              >

                <Mail size={18} />


                <input
                  id="correo"
                  name="correo"
                  type="email"
                  value={
                    formulario.correo
                  }
                  onChange={manejarCambio}
                  placeholder="usuario@talassa.com"
                  maxLength={150}
                />

              </div>


              {errores.correo && (
                <small className="mensaje-error-campo-usuario">
                  {errores.correo}
                </small>
              )}

            </div>


            {/* USUARIO */}

            <div className="campo-formulario-usuario">

              <label htmlFor="usuario">
                Nombre de usuario
                <span>*</span>
              </label>


              <div
                className={
                  errores.usuario
                    ? "entrada-usuario con-error"
                    : "entrada-usuario"
                }
              >

                <AtSign size={18} />


                <input
                  id="usuario"
                  name="usuario"
                  type="text"
                  value={
                    formulario.usuario
                  }
                  onChange={manejarCambio}
                  placeholder="Ej. carlos.romero"
                  maxLength={80}
                />

              </div>


              {errores.usuario && (
                <small className="mensaje-error-campo-usuario">
                  {errores.usuario}
                </small>
              )}

            </div>

          </div>

        </section>


        <div className="separador-formulario-usuario" />


        {/* ======================================
            ACCESO Y SEGURIDAD
        ====================================== */}

        <section className="seccion-formulario-usuario">

          <div className="titulo-seccion-usuario">

            <div className="icono-seccion-usuario">
              <KeyRound size={21} />
            </div>


            <div>

              <h2>
                Acceso y seguridad
              </h2>

              <p>
                Credenciales utilizadas para
                ingresar al sistema.
              </p>

            </div>

          </div>


          {esEdicion && (
            <div className="aviso-password-usuario">

              <KeyRound size={17} />

              <p>
                Deje los campos de contraseña vacíos
                si desea conservar la contraseña
                actual.
              </p>

            </div>
          )}


          <div className="rejilla-formulario-usuario">

            {/* CONTRASEÑA */}

            <div className="campo-formulario-usuario">

              <label htmlFor="password">
                Contraseña

                {!esEdicion && (
                  <span>*</span>
                )}
              </label>


              <div
                className={
                  errores.password
                    ? "entrada-usuario con-error"
                    : "entrada-usuario"
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
                  value={
                    formulario.password
                  }
                  onChange={manejarCambio}
                  placeholder={
                    esEdicion
                      ? "Nueva contraseña"
                      : "Mínimo 8 caracteres"
                  }
                />


                <button
                  type="button"
                  className="boton-ver-password"
                  onClick={() =>
                    setMostrarPassword(
                      (valor) => !valor
                    )
                  }
                  aria-label="Mostrar contraseña"
                >

                  {mostrarPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}

                </button>

              </div>


              {errores.password && (
                <small className="mensaje-error-campo-usuario">
                  {errores.password}
                </small>
              )}

            </div>


            {/* CONFIRMAR */}

            <div className="campo-formulario-usuario">

              <label htmlFor="confirmarPassword">
                Confirmar contraseña

                {!esEdicion && (
                  <span>*</span>
                )}
              </label>


              <div
                className={
                  errores.confirmarPassword
                    ? "entrada-usuario con-error"
                    : "entrada-usuario"
                }
              >

                <KeyRound size={18} />


                <input
                  id="confirmarPassword"
                  name="confirmarPassword"
                  type={
                    mostrarConfirmacion
                      ? "text"
                      : "password"
                  }
                  value={
                    formulario.confirmarPassword
                  }
                  onChange={manejarCambio}
                  placeholder="Repita la contraseña"
                />


                <button
                  type="button"
                  className="boton-ver-password"
                  onClick={() =>
                    setMostrarConfirmacion(
                      (valor) => !valor
                    )
                  }
                  aria-label="Mostrar confirmación"
                >

                  {mostrarConfirmacion ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}

                </button>

              </div>


              {errores.confirmarPassword && (
                <small className="mensaje-error-campo-usuario">
                  {errores.confirmarPassword}
                </small>
              )}

            </div>

          </div>

        </section>


        <div className="separador-formulario-usuario" />


        {/* ======================================
            ROL Y ESTADO
        ====================================== */}

        <section className="seccion-formulario-usuario">

          <div className="titulo-seccion-usuario">

            <div className="icono-seccion-usuario">
              <ShieldCheck size={21} />
            </div>


            <div>

              <h2>
                Rol y estado
              </h2>

              <p>
                Configure el nivel de acceso y
                disponibilidad de la cuenta.
              </p>

            </div>

          </div>


          <div className="rejilla-formulario-usuario">

            {/* ROL */}

            <div className="campo-formulario-usuario">

              <label htmlFor="rol">
                Rol
                <span>*</span>
              </label>


              <div
                className={
                  errores.rol
                    ? "entrada-usuario con-error"
                    : "entrada-usuario"
                }
              >

                <ShieldCheck size={18} />


                <select
                  id="rol"
                  name="rol"
                  value={
                    formulario.rol
                  }
                  onChange={manejarCambio}
                >
                  <option value="">
                    Seleccionar rol
                  </option>

                  <option value="Administrador">
                    Administrador
                  </option>

                  <option value="Operador portuario">
                    Operador portuario
                  </option>

                  <option value="Inspector">
                    Inspector
                  </option>

                </select>

              </div>


              {errores.rol && (
                <small className="mensaje-error-campo-usuario">
                  {errores.rol}
                </small>
              )}

            </div>


            {/* ESTADO */}

            <div className="campo-formulario-usuario">

              <label>
                Estado
                <span>*</span>
              </label>


              <div className="selector-estado-usuario-formulario">

                <button
                  type="button"
                  className={
                    formulario.activo
                      ? "opcion-estado-usuario activo seleccionado"
                      : "opcion-estado-usuario activo"
                  }
                  onClick={() =>
                    cambiarEstado(true)
                  }
                >
                  <i />

                  Activo
                </button>


                <button
                  type="button"
                  className={
                    !formulario.activo
                      ? "opcion-estado-usuario inactivo seleccionado"
                      : "opcion-estado-usuario inactivo"
                  }
                  onClick={() =>
                    cambiarEstado(false)
                  }
                >
                  <i />

                  Inactivo
                </button>

              </div>

            </div>

          </div>

        </section>


        {/* ======================================
            MENSAJES
        ====================================== */}

        {errorGeneral && (
          <div className="mensaje-error-usuario-formulario">
            {errorGeneral}
          </div>
        )}


        {mensajeExito && (
          <div className="mensaje-exito-usuario-formulario">
            {mensajeExito}
          </div>
        )}


        {/* ======================================
            BOTONES
        ====================================== */}

        <div className="acciones-formulario-usuario">

          <button
            type="button"
            className="boton-cancelar-usuario"
            onClick={regresar}
            disabled={enviando}
          >
            Cancelar
          </button>


          <button
            type="submit"
            className="boton-guardar-usuario"
            disabled={enviando}
          >

            {enviando ? (
              <>

                <LoaderCircle
                  size={18}
                  className="icono-girando-usuario"
                />

                {esEdicion
                  ? "Guardando..."
                  : "Registrando..."}

              </>
            ) : (
              <>

                <Save size={18} />

                {esEdicion
                  ? "Guardar cambios"
                  : "Registrar usuario"}

              </>
            )}

          </button>

        </div>

      </form>

    </section>
  );
}


export default UsuarioFormPage;