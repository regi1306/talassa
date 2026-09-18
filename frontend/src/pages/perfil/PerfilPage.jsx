import {
  AtSign,
  CalendarDays,
  Clock3,
  KeyRound,
  LockKeyhole,
  Mail,
  Monitor,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  obtenerPerfil,
} from "../../services/auth.service.js";

import "../../styles/perfil.css";


function PerfilPage() {
  /* ======================================
     ESTADOS
  ====================================== */

  const [
    perfil,
    setPerfil,
  ] = useState(null);


  const [
    cargando,
    setCargando,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  /* ======================================
     CARGAR PERFIL REAL
  ====================================== */

  useEffect(() => {
    let componenteActivo = true;


    async function cargarPerfil() {
      try {
        setCargando(true);

        setError("");


        /*
          obtenerPerfil() llama a:

          GET /api/auth/me

          enviando el JWT en:

          Authorization: Bearer TOKEN
        */

        const respuesta =
          await obtenerPerfil();


        if (componenteActivo) {
          setPerfil(
            respuesta.data
          );
        }

      } catch (error) {
        console.error(
          "Error al cargar el perfil:",
          error
        );


        if (componenteActivo) {
          setError(
            error.response
              ?.data
              ?.message
            ||
            "No fue posible cargar la información del perfil."
          );
        }

      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    }


    cargarPerfil();


    return () => {
      componenteActivo = false;
    };
  }, []);


  /* ======================================
     FORMATEAR FECHAS
  ====================================== */

  function formatearFecha(
    fecha
  ) {
    if (!fecha) {
      return "Sin registro";
    }


    return new Intl.DateTimeFormat(
      "es-SV",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(
      new Date(fecha)
    );
  }


  function formatearFechaHora(
    fecha
  ) {
    if (!fecha) {
      return "Sin registro";
    }


    return new Intl.DateTimeFormat(
      "es-SV",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(
      new Date(fecha)
    );
  }


  /* ======================================
     CARGANDO
  ====================================== */

  if (cargando) {
    return (
      <section className="pagina-perfil">

        <div className="fondo-perfil" />


        <div className="encabezado-perfil">

          <div>

            <h1>
              Mi perfil
            </h1>


            <p>
              Consultando la información
              de tu cuenta.
            </p>

          </div>

        </div>


        <article className="glass-card tarjeta-perfil">

          <div className="titulo-tarjeta-perfil">

            <div className="icono-titulo-perfil">
              <UserRound size={20} />
            </div>


            <div>

              <h2>
                Cargando perfil...
              </h2>


              <p>
                Estamos verificando tus
                datos con TALASSA.
              </p>

            </div>

          </div>

        </article>

      </section>
    );
  }


  /* ======================================
     ERROR
  ====================================== */

  if (
    error ||
    !perfil
  ) {
    return (
      <section className="pagina-perfil">

        <div className="fondo-perfil" />


        <div className="encabezado-perfil">

          <div>

            <h1>
              Mi perfil
            </h1>


            <p>
              Información de tu cuenta
              de TALASSA.
            </p>

          </div>

        </div>


        <article className="glass-card tarjeta-perfil">

          <div className="titulo-tarjeta-perfil">

            <div className="icono-titulo-perfil seguridad">
              <LockKeyhole size={20} />
            </div>


            <div>

              <h2>
                No se pudo cargar el perfil
              </h2>


              <p>
                {error}
              </p>

            </div>

          </div>

        </article>

      </section>
    );
  }


  /* ======================================
     DATOS DERIVADOS
  ====================================== */

  const nombres =
    perfil.nombres || "";


  const apellidos =
    perfil.apellidos || "";


  const nombreCompleto =
    `${nombres} ${apellidos}`
      .trim();


  const iniciales =
    `${nombres.charAt(0)}${apellidos.charAt(0)}`
      .toUpperCase();


  const estadoTexto =
    perfil.activo
      ? "Activo"
      : "Inactivo";


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
            Consulta la información
            asociada a tu cuenta de TALASSA.
          </p>

        </div>

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
            {nombreCompleto}
          </h2>


          <p>
            @{perfil.nombre_usuario}
          </p>

        </div>


        <div className="separador-identidad-perfil" />


        {/* ROL */}

        <div className="dato-rapido-perfil">

          <span>
            Rol
          </span>


          <strong>

            <ShieldCheck size={16} />

            {perfil.rol}

          </strong>

        </div>


        {/* ESTADO */}

        <div className="dato-rapido-perfil">

          <span>
            Estado
          </span>


          <strong
            className={
              perfil.activo
                ? "estado-cuenta-perfil"
                : ""
            }
          >

            {perfil.activo && (
              <i />
            )}

            {estadoTexto}

          </strong>

        </div>


        {/* FECHA CREACIÓN */}

        <div className="dato-rapido-perfil">

          <span>
            Cuenta creada
          </span>


          <strong>
            {formatearFecha(
              perfil.fecha_creacion
            )}
          </strong>

        </div>

      </article>


      {/* ======================================
          CONTENIDO PRINCIPAL
      ====================================== */}

      <div className="rejilla-perfil">

        {/* ======================================
            INFORMACIÓN PERSONAL
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
                Datos registrados
                en tu cuenta.
              </p>

            </div>

          </div>


          <div className="lista-informacion-perfil">

            {/* NOMBRE */}

            <div className="dato-perfil">

              <div className="icono-dato-perfil">
                <UserRound size={18} />
              </div>


              <div>

                <span>
                  Nombre completo
                </span>


                <strong>
                  {nombreCompleto}
                </strong>

              </div>

            </div>


            {/* USUARIO */}

            <div className="dato-perfil">

              <div className="icono-dato-perfil">
                <AtSign size={18} />
              </div>


              <div>

                <span>
                  Nombre de usuario
                </span>


                <strong>
                  {perfil.nombre_usuario}
                </strong>

              </div>

            </div>


            {/* CORREO */}

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


            {/* ROL */}

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
                  El rol solo puede ser
                  modificado desde
                  Administración de usuarios.
                </small>

              </div>

            </div>

          </div>

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
                Información relacionada
                con tus credenciales.
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
                  Credencial protegida
                  por el sistema.
                </span>

              </div>


              <button
                type="button"
                disabled
                title="Esta función se implementará posteriormente."
              >
                Cambiar
              </button>

            </div>


            <div className="aviso-seguridad-perfil">

              <ShieldCheck size={18} />


              <p>
                Tu contraseña no se almacena
                en texto plano. El sistema
                utiliza una contraseña
                protegida mediante hash
                para validar el acceso.
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
              Información asociada
              al último inicio de sesión.
            </p>

          </div>

        </div>


        <div className="rejilla-sesion-perfil">

          {/* DISPOSITIVO */}

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


          {/* ÚLTIMO ACCESO */}

          <div className="dato-sesion-perfil">

            <CalendarDays size={19} />


            <div>

              <span>
                Último acceso
              </span>


              <strong>
                {formatearFechaHora(
                  perfil.ultimo_acceso
                )}
              </strong>

            </div>

          </div>


          {/* ESTADO */}

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