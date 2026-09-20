import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ClipboardList,
  FileClock,
  FileText,
  Layers3,
  LoaderCircle,
  ShieldCheck,
  TriangleAlert,
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

import {
  obtenerDetalleAuditoria,
} from "../../services/auditoria.service.js";

import {
  cerrarSesion,
} from "../../services/auth.service.js";

import "../../styles/detalleAuditoria.css";


/* ======================================
   FORMATEAR FECHA
====================================== */

function formatearFecha(
  fecha
) {
  if (!fecha) {
    return "—";
  }


  const valor =
    new Date(fecha);


  if (
    Number.isNaN(
      valor.getTime()
    )
  ) {
    return "—";
  }


  return new Intl.DateTimeFormat(
    "es-SV",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(valor);
}


/* ======================================
   FORMATEAR HORA
====================================== */

function formatearHora(
  fecha
) {
  if (!fecha) {
    return "—";
  }


  const valor =
    new Date(fecha);


  if (
    Number.isNaN(
      valor.getTime()
    )
  ) {
    return "—";
  }


  return new Intl.DateTimeFormat(
    "es-SV",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  ).format(valor);
}


/* ======================================
   NOMBRE AMIGABLE DEL CAMPO
====================================== */

function formatearCampo(
  campo
) {
  const texto =
    String(campo)
      .replaceAll(
        "_",
        " "
      );


  return (
    texto.charAt(0).toUpperCase()
    +
    texto.slice(1)
  );
}


/* ======================================
   FORMATEAR VALOR SIMPLE
====================================== */

function formatearValor(
  valor
) {
  if (
    valor === null
    ||
    valor === undefined
    ||
    valor === ""
  ) {
    return "—";
  }


  if (
    typeof valor ===
    "boolean"
  ) {
    return valor
      ? "Sí"
      : "No";
  }


  if (
    typeof valor ===
      "object"
    &&
    !Array.isArray(
      valor
    )
  ) {
    return JSON.stringify(
      valor
    );
  }


  return String(valor);
}


/* ======================================
   MOSTRAR VALOR DE AUDITORÍA
====================================== */

function mostrarValorAuditoria(
  valor
) {
  if (
    Array.isArray(
      valor
    )
  ) {
    if (
      valor.length === 0
    ) {
      return (
        <span>
          Sin permisos
        </span>
      );
    }


    return (
      <div className="lista-permisos-auditoria">

        {valor.map(
          (
            permiso,
            indice
          ) => (

            <span
              key={
                `${permiso}-${indice}`
              }
              className="permiso-detalle-auditoria"
            >
              {permiso}
            </span>

          )
        )}

      </div>
    );
  }


  return formatearValor(
    valor
  );
}


/* ======================================
   COMPROBAR SI HAY DATOS
====================================== */

function tieneDatos(
  datos
) {
  return (
    datos
    &&
    typeof datos ===
      "object"
    &&
    Object.keys(
      datos
    ).length > 0
  );
}


function AuditoriaDetallePage() {
  const navigate =
    useNavigate();


  const {
    id,
  } =
    useParams();


  /* ======================================
     ESTADOS
  ====================================== */

  const [
    auditoria,
    setAuditoria,
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
     CARGAR DETALLE
  ====================================== */

  useEffect(() => {
    let componenteActivo =
      true;


    async function cargarDetalle() {
      try {
        setCargando(true);

        setError("");


        const respuesta =
          await obtenerDetalleAuditoria(
            id
          );


        if (
          !componenteActivo
        ) {
          return;
        }


        setAuditoria(
          respuesta.data
        );


      } catch (error) {
        console.error(
          "Error al cargar detalle de auditoría:",
          error
        );


        if (
          !componenteActivo
        ) {
          return;
        }


        if (
          error.response?.status ===
          401
        ) {
          cerrarSesion();


          navigate(
            "/login",
            {
              replace: true,
            }
          );


          return;
        }


        setError(
          error.response?.data?.message
          ||
          "No fue posible cargar el evento de auditoría."
        );


      } finally {
        if (
          componenteActivo
        ) {
          setCargando(false);
        }
      }
    }


    cargarDetalle();


    return () => {
      componenteActivo =
        false;
    };

  }, [
    id,
    navigate,
  ]);


  /* ======================================
     CARGANDO
  ====================================== */

  if (
    cargando
  ) {
    return (
      <section className="pagina-detalle-auditoria">

        <div className="auditoria-no-encontrada">

          <LoaderCircle
            size={38}
            className="icono-girando-detalle-auditoria"
          />


          <h2>
            Cargando auditoría
          </h2>


          <p>
            Consultando la información del evento.
          </p>

        </div>

      </section>
    );
  }


  /* ======================================
     ERROR / NO ENCONTRADO
  ====================================== */

  if (
    error
    ||
    !auditoria
  ) {
    return (
      <section className="pagina-detalle-auditoria">

        <button
          type="button"
          className="boton-volver-auditoria"
          onClick={() =>
            navigate(
              "/auditoria"
            )
          }
        >

          <ArrowLeft
            size={18}
          />

          Volver a Auditoría

        </button>


        <div className="auditoria-no-encontrada">

          <TriangleAlert
            size={38}
          />


          <h2>
            Registro no encontrado
          </h2>


          <p>
            {error
              ||
              "No fue posible encontrar el evento de auditoría solicitado."}
          </p>

        </div>

      </section>
    );
  }


  /* ======================================
     DATOS DEL EVENTO
  ====================================== */

  const iniciales =
    String(
      auditoria.usuario
      ||
      "Sistema"
    )
      .split(" ")
      .filter(Boolean)
      .map(
        (parte) =>
          parte.charAt(0)
      )
      .slice(0, 2)
      .join("")
      .toUpperCase();


  const datosAnteriores =
    auditoria.datos_anteriores;


  const datosNuevos =
    auditoria.datos_nuevos;


  const existeComparacion =
    tieneDatos(
      datosAnteriores
    )
    ||
    tieneDatos(
      datosNuevos
    );


  return (
    <section className="pagina-detalle-auditoria">

      {/* ======================================
          VOLVER
      ====================================== */}

      <button
        type="button"
        className="boton-volver-auditoria"
        onClick={() =>
          navigate(
            "/auditoria"
          )
        }
      >

        <ArrowLeft
          size={18}
        />

        Volver a Auditoría

      </button>


      {/* ======================================
          ENCABEZADO
      ====================================== */}

      <div className="encabezado-detalle-auditoria">

        <div className="titulo-detalle-auditoria">

          <div className="icono-principal-auditoria">

            <FileClock
              size={29}
            />

          </div>


          <div>

            <div className="titulo-evento-auditoria">

              <h1>
                Detalle de auditoría
              </h1>


              <span className="codigo-auditoria">

                AUD-

                {String(
                  auditoria.id_auditoria
                ).padStart(
                  4,
                  "0"
                )}

              </span>

            </div>


            <p>
              Información completa del evento
              registrado en la bitácora del sistema.
            </p>

          </div>

        </div>

      </div>


      {/* ======================================
          INFORMACIÓN GENERAL
      ====================================== */}

      <article className="glass-card tarjeta-informacion-auditoria">

        <div className="titulo-tarjeta-auditoria">

          <ClipboardList
            size={20}
          />


          <h2>
            Información general
          </h2>

        </div>


        <div className="rejilla-informacion-auditoria">

          {/* USUARIO */}

          <div className="dato-auditoria">

            <div className="icono-dato-auditoria">

              <UserRound
                size={18}
              />

            </div>


            <div>

              <span>
                Usuario
              </span>


              <strong>
                {auditoria.usuario}
              </strong>


              <small>
                {auditoria.rol}
              </small>

            </div>

          </div>


          {/* ACCIÓN */}

          <div className="dato-auditoria">

            <div className="icono-dato-auditoria azul">

              <ShieldCheck
                size={18}
              />

            </div>


            <div>

              <span>
                Acción
              </span>


              <strong>
                {auditoria.accion}
              </strong>

            </div>

          </div>


          {/* MÓDULO */}

          <div className="dato-auditoria">

            <div className="icono-dato-auditoria morado">

              <Layers3
                size={18}
              />

            </div>


            <div>

              <span>
                Módulo
              </span>


              <strong>
                {auditoria.modulo}
              </strong>

            </div>

          </div>


          {/* ENTIDAD */}

          <div className="dato-auditoria">

            <div className="icono-dato-auditoria azul">

              <FileText
                size={18}
              />

            </div>


            <div>

              <span>
                Entidad
              </span>


              <strong>
                {auditoria.entidad || "—"}
              </strong>

            </div>

          </div>


          {/* REGISTRO */}

          <div className="dato-auditoria">

            <div className="icono-dato-auditoria azul">

              <FileText
                size={18}
              />

            </div>


            <div>

              <span>
                Registro afectado
              </span>


              <strong>

                {auditoria.id_registro_afectado
                  ||
                  "—"}

              </strong>

            </div>

          </div>


          {/* FECHA */}

          <div className="dato-auditoria">

            <div className="icono-dato-auditoria verde">

              <CalendarDays
                size={18}
              />

            </div>


            <div>

              <span>
                Fecha y hora
              </span>


              <strong>
                {formatearFecha(
                  auditoria.fecha
                )}
              </strong>


              <small>
                {formatearHora(
                  auditoria.fecha
                )}
              </small>

            </div>

          </div>

        </div>

      </article>


      {/* ======================================
          USUARIO DEL EVENTO
      ====================================== */}

      <article className="glass-card tarjeta-usuario-evento">

        <div className="avatar-detalle-auditoria">
          {iniciales}
        </div>


        <div>

          <span>
            Evento realizado por
          </span>


          <strong>
            {auditoria.usuario}
          </strong>


          <small>
            {auditoria.rol}
          </small>

        </div>


        <div className="separador-usuario-evento" />


        <div className="resumen-evento-auditoria">

          <span>
            Acción
          </span>


          <strong>
            {auditoria.accion}
          </strong>

        </div>


        <div className="resumen-evento-auditoria">

          <span>
            Módulo
          </span>


          <strong>
            {auditoria.modulo}
          </strong>

        </div>


        <div className="resumen-evento-auditoria">

          <span>
            Registro
          </span>


          <strong>
            {auditoria.id_registro_afectado || "—"}
          </strong>

        </div>

      </article>


      {/* ======================================
          CAMBIOS REGISTRADOS
      ====================================== */}

      <article className="glass-card tarjeta-comparacion-auditoria">

        <div className="titulo-tarjeta-auditoria">

          <Layers3
            size={20}
          />


          <h2>
            Cambios registrados
          </h2>

        </div>


        <p className="descripcion-comparacion-auditoria">
          Comparación de la información antes y
          después de la acción realizada.
        </p>


        {existeComparacion ? (

          <div className="comparacion-auditoria">

            {/* ======================================
                ANTES
            ====================================== */}

            <div className="estado-comparacion antes">

              <div className="encabezado-estado-comparacion">

                <span className="punto-comparacion" />


                <div>

                  <strong>
                    Antes
                  </strong>


                  <small>
                    Estado previo
                  </small>

                </div>

              </div>


              {tieneDatos(
                datosAnteriores
              ) ? (

                <div className="lista-cambios-auditoria">

                  {Object.entries(
                    datosAnteriores
                  ).map(
                    ([
                      campo,
                      valor,
                    ]) => (

                      <div
                        className="fila-cambio-auditoria"
                        key={campo}
                      >

                        <span>
                          {formatearCampo(
                            campo
                          )}
                        </span>


                        <div className="valor-cambio-auditoria">

                          {mostrarValorAuditoria(
                            valor
                          )}

                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="sin-estado-anterior">

                  <FileText
                    size={22}
                  />


                  <span>
                    No existe un estado anterior.
                  </span>


                  <small>
                    El registro fue creado durante
                    este evento.
                  </small>

                </div>

              )}

            </div>


            {/* ======================================
                FLECHA
            ====================================== */}

            <div className="flecha-comparacion-auditoria">

              <ArrowRight
                size={26}
              />

            </div>


            {/* ======================================
                DESPUÉS
            ====================================== */}

            <div className="estado-comparacion despues">

              <div className="encabezado-estado-comparacion">

                <span className="punto-comparacion" />


                <div>

                  <strong>
                    Después
                  </strong>


                  <small>
                    Estado resultante
                  </small>

                </div>

              </div>


              {tieneDatos(
                datosNuevos
              ) ? (

                <div className="lista-cambios-auditoria">

                  {Object.entries(
                    datosNuevos
                  ).map(
                    ([
                      campo,
                      valor,
                    ]) => (

                      <div
                        className="fila-cambio-auditoria"
                        key={campo}
                      >

                        <span>
                          {formatearCampo(
                            campo
                          )}
                        </span>


                        <div className="valor-cambio-auditoria">

                          {mostrarValorAuditoria(
                            valor
                          )}

                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="sin-estado-anterior">

                  <FileText
                    size={22}
                  />


                  <span>
                    No se registraron datos posteriores.
                  </span>

                </div>

              )}

            </div>

          </div>

        ) : (

          <div className="sin-comparacion-auditoria">

            <FileText
              size={27}
            />


            <strong>
              Sin comparación de datos
            </strong>


            <span>
              Este evento no modificó información que
              requiera mostrar un estado anterior y posterior.
            </span>

          </div>

        )}

      </article>


      {/* ======================================
          DESCRIPCIÓN
      ====================================== */}

      <article className="glass-card tarjeta-descripcion-auditoria">

        <div className="titulo-tarjeta-auditoria">

          <FileText
            size={20}
          />


          <h2>
            Descripción del evento
          </h2>

        </div>


        <div className="contenido-descripcion-auditoria">

          <div className="icono-descripcion-auditoria">

            <FileClock
              size={20}
            />

          </div>


          <p>

            {auditoria.descripcion
              ||
              "No se proporcionó una descripción para este evento."}

          </p>

        </div>

      </article>

    </section>
  );
}


export default AuditoriaDetallePage;