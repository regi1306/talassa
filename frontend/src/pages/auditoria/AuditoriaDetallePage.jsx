import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ClipboardList,
  FileClock,
  FileText,
  Layers3,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "../../styles/detalleAuditoria.css";


/* ======================================
   DATOS TEMPORALES

   Más adelante este detalle será
   obtenido desde la API.
====================================== */

const detallesAuditoria = {
  "1": {
    id_auditoria: 1,

    usuario: "Carlos Romero",
    rol: "Operador portuario",

    accion: "Actualización",
    modulo: "Operaciones",

    entidad: "Operación portuaria",
    registro: "OP-052",

    fecha: "15 sep. 2026",
    hora: "08:17",

    ip: "192.168.10.25",

    descripcion:
      "Se asignó el muelle M-03 a la operación OP-052.",

    antes: {
      Muelle: "Sin asignar",
      Estado: "Programada",
    },

    despues: {
      Muelle: "M-03",
      Estado: "Muelle asignado",
    },
  },


  "2": {
    id_auditoria: 2,

    usuario: "Regina Cadenas",
    rol: "Administrador",

    accion: "Creación",
    modulo: "Usuarios",

    entidad: "Usuario",
    registro: "USR-024",

    fecha: "15 sep. 2026",
    hora: "07:42",

    ip: "192.168.10.10",

    descripcion:
      "Se registró una nueva cuenta de usuario en TALASSA.",

    antes: null,

    despues: {
      Usuario: "sofia.torres",
      Rol: "Inspector",
      Estado: "Activo",
    },
  },


  "3": {
    id_auditoria: 3,

    usuario: "María López",
    rol: "Inspector",

    accion: "Registro",
    modulo: "Inspecciones",

    entidad: "Inspección",
    registro: "INS-001",

    fecha: "14 sep. 2026",
    hora: "16:30",

    ip: "192.168.10.42",

    descripcion:
      "Se registró una inspección asociada a la operación OP-052.",

    antes: null,

    despues: {
      Código: "INS-001",
      Operación: "OP-052",
      Estado: "Registrada",
    },
  },


  "4": {
    id_auditoria: 4,

    usuario: "Regina Cadenas",
    rol: "Administrador",

    accion: "Actualización",
    modulo: "Empresas",

    entidad: "Empresa",
    registro: "EMP-003",

    fecha: "14 sep. 2026",
    hora: "14:06",

    ip: "192.168.10.10",

    descripcion:
      "Se actualizó la información general de la empresa.",

    antes: {
      Nombre: "Blue Harbor",
      País: "Estados Unidos",
    },

    despues: {
      Nombre: "Blue Harbor Line",
      País: "Estados Unidos",
    },
  },


  "5": {
    id_auditoria: 5,

    usuario: "Sofía Torres",
    rol: "Inspector",

    accion: "Registro",
    modulo: "Incidencias",

    entidad: "Incidencia",
    registro: "INC-014",

    fecha: "13 sep. 2026",
    hora: "11:18",

    ip: "192.168.10.51",

    descripcion:
      "Se registró una incidencia durante una operación portuaria.",

    antes: null,

    despues: {
      Código: "INC-014",
      Tipo: "Retraso operativo",
      Estado: "Activa",
    },
  },


  "6": {
    id_auditoria: 6,

    usuario: "Carlos Romero",
    rol: "Operador portuario",

    accion: "Creación",
    modulo: "Operaciones",

    entidad: "Operación portuaria",
    registro: "OP-053",

    fecha: "13 sep. 2026",
    hora: "09:25",

    ip: "192.168.10.25",

    descripcion:
      "Se creó una nueva operación portuaria.",

    antes: null,

    despues: {
      Código: "OP-053",
      Estado: "Programada",
      Muelle: "Sin asignar",
    },
  },


  "7": {
    id_auditoria: 7,

    usuario: "Regina Cadenas",
    rol: "Administrador",

    accion: "Cambio de estado",
    modulo: "Catálogos",

    entidad: "Tipo de carga",
    registro: "CAT-018",

    fecha: "12 sep. 2026",
    hora: "15:47",

    ip: "192.168.10.10",

    descripcion:
      "Se desactivó un registro del catálogo de tipos de carga.",

    antes: {
      Nombre: "Granel líquido",
      Estado: "Activo",
    },

    despues: {
      Nombre: "Granel líquido",
      Estado: "Inactivo",
    },
  },


  "8": {
    id_auditoria: 8,

    usuario: "Carlos Romero",
    rol: "Operador portuario",

    accion: "Actualización",
    modulo: "Buques",

    entidad: "Buque",
    registro: "BUQ-008",

    fecha: "12 sep. 2026",
    hora: "10:03",

    ip: "192.168.10.25",

    descripcion:
      "Se actualizaron las características físicas del buque.",

    antes: {
      Eslora: "285.00 m",
      Calado: "11.50 m",
    },

    despues: {
      Eslora: "294.50 m",
      Calado: "12.50 m",
    },
  },
};


function AuditoriaDetallePage() {
  const navigate =
    useNavigate();


  const { id } =
    useParams();


  const auditoria =
    detallesAuditoria[id];


  /* ======================================
     REGISTRO NO ENCONTRADO
  ====================================== */

  if (!auditoria) {
    return (
      <section className="pagina-detalle-auditoria">

        <button
          type="button"
          className="boton-volver-auditoria"
          onClick={() =>
            navigate("/auditoria")
          }
        >
          <ArrowLeft size={18} />

          Volver a Auditoría
        </button>


        <div className="auditoria-no-encontrada">

          <FileClock size={38} />


          <h2>
            Registro no encontrado
          </h2>


          <p>
            No fue posible encontrar el evento
            de auditoría solicitado.
          </p>

        </div>

      </section>
    );
  }


  const iniciales =
    auditoria.usuario
      .split(" ")
      .map(
        (parte) =>
          parte.charAt(0)
      )
      .slice(0, 2)
      .join("");


  return (
    <section className="pagina-detalle-auditoria">

      {/* ======================================
          VOLVER
      ====================================== */}

      <button
        type="button"
        className="boton-volver-auditoria"
        onClick={() =>
          navigate("/auditoria")
        }
      >
        <ArrowLeft size={18} />

        Volver a Auditoría
      </button>


      {/* ======================================
          ENCABEZADO
      ====================================== */}

      <div className="encabezado-detalle-auditoria">

        <div className="titulo-detalle-auditoria">

          <div className="icono-principal-auditoria">
            <FileClock size={29} />
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

          <ClipboardList size={20} />

          <h2>
            Información general
          </h2>

        </div>


        <div className="rejilla-informacion-auditoria">

          {/* USUARIO */}

          <div className="dato-auditoria">

            <div className="icono-dato-auditoria">
              <UserRound size={18} />
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
              <ShieldCheck size={18} />
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
              <Layers3 size={18} />
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


          {/* REGISTRO */}

          <div className="dato-auditoria">

            <div className="icono-dato-auditoria azul">
              <FileText size={18} />
            </div>


            <div>

              <span>
                Registro afectado
              </span>


              <strong>
                {auditoria.registro}
              </strong>


              <small>
                {auditoria.entidad}
              </small>

            </div>

          </div>


          {/* FECHA */}

          <div className="dato-auditoria">

            <div className="icono-dato-auditoria verde">
              <CalendarDays size={18} />
            </div>


            <div>

              <span>
                Fecha y hora
              </span>


              <strong>
                {auditoria.fecha}
              </strong>


              <small>
                {auditoria.hora}
              </small>

            </div>

          </div>


          {/* IP */}

          <div className="dato-auditoria">

            <div className="icono-dato-auditoria rojo">
              <MapPin size={18} />
            </div>


            <div>

              <span>
                Dirección IP
              </span>


              <strong>
                {auditoria.ip}
              </strong>

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
            {auditoria.registro}
          </strong>

        </div>

      </article>


      {/* ======================================
          COMPARACIÓN
      ====================================== */}

      <article className="glass-card tarjeta-comparacion-auditoria">

        <div className="titulo-tarjeta-auditoria">

          <Layers3 size={20} />

          <h2>
            Cambios registrados
          </h2>

        </div>


        <p className="descripcion-comparacion-auditoria">
          Comparación de la información antes y
          después de la acción realizada.
        </p>


        <div className="comparacion-auditoria">

          {/* ANTES */}

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


            {auditoria.antes ? (

              <div className="lista-cambios-auditoria">

                {Object.entries(
                  auditoria.antes
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
                        {campo}
                      </span>


                      <strong>
                        {valor}
                      </strong>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="sin-estado-anterior">

                <FileText size={22} />


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


          {/* FLECHA */}

          <div className="flecha-comparacion-auditoria">

            <ArrowRight size={26} />

          </div>


          {/* DESPUÉS */}

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


            <div className="lista-cambios-auditoria">

              {Object.entries(
                auditoria.despues
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
                      {campo}
                    </span>


                    <strong>
                      {valor}
                    </strong>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </article>


      {/* ======================================
          DESCRIPCIÓN
      ====================================== */}

      <article className="glass-card tarjeta-descripcion-auditoria">

        <div className="titulo-tarjeta-auditoria">

          <FileText size={20} />

          <h2>
            Descripción del evento
          </h2>

        </div>


        <div className="contenido-descripcion-auditoria">

          <div className="icono-descripcion-auditoria">
            <FileClock size={20} />
          </div>


          <p>
            {auditoria.descripcion}
          </p>

        </div>

      </article>

    </section>
  );
}


export default AuditoriaDetallePage;