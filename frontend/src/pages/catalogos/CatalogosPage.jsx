import {
  Box,
  ClipboardCheck,
  Filter,
  LoaderCircle,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Ship,
  Tag,
  TriangleAlert,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import "../../styles/catalogos.css";


/* ======================================
   CONFIGURACIÓN DE CATÁLOGOS
====================================== */

const catalogosDisponibles = [
  {
    clave: "tipos_buque",
    nombre: "Tipos de buque",
    singular: "tipo de buque",
    icono: Ship,
  },
  {
    clave: "tipos_carga",
    nombre: "Tipos de carga",
    singular: "tipo de carga",
    icono: Package,
  },
  {
    clave: "tipos_contenedor",
    nombre: "Tipos de contenedor",
    singular: "tipo de contenedor",
    icono: Box,
  },
  {
    clave: "tipos_inspeccion",
    nombre: "Tipos de inspección",
    singular: "tipo de inspección",
    icono: ClipboardCheck,
  },
  {
    clave: "tipos_incidencia",
    nombre: "Tipos de incidencia",
    singular: "tipo de incidencia",
    icono: TriangleAlert,
  },
];


/* ======================================
   DATOS TEMPORALES

   Más adelante serán sustituidos
   por información proveniente de la API.
====================================== */

const datosIniciales = {
  tipos_buque: [
    {
      id: 1,
      nombre: "Portacontenedores",
      descripcion:
        "Buque diseñado para transportar contenedores.",
      activo: true,
      fecha_actualizacion: "Hoy, 09:15",
    },
    {
      id: 2,
      nombre: "Granelero",
      descripcion:
        "Embarcación destinada al transporte de carga a granel.",
      activo: true,
      fecha_actualizacion: "12 sep. 2026",
    },
    {
      id: 3,
      nombre: "Tanquero",
      descripcion:
        "Buque utilizado para transportar líquidos a granel.",
      activo: true,
      fecha_actualizacion: "08 sep. 2026",
    },
    {
      id: 4,
      nombre: "Ro-Ro",
      descripcion:
        "Buque especializado en carga rodada.",
      activo: true,
      fecha_actualizacion: "04 sep. 2026",
    },
  ],

  tipos_carga: [
    {
      id: 1,
      nombre: "Carga general",
      descripcion:
        "Mercancías transportadas de manera convencional.",
      activo: true,
      fecha_actualizacion: "Hoy, 10:20",
    },
    {
      id: 2,
      nombre: "Contenedorizada",
      descripcion:
        "Carga movilizada mediante contenedores.",
      activo: true,
      fecha_actualizacion: "13 sep. 2026",
    },
    {
      id: 3,
      nombre: "Granel sólido",
      descripcion:
        "Carga sólida transportada sin embalaje.",
      activo: true,
      fecha_actualizacion: "10 sep. 2026",
    },
    {
      id: 4,
      nombre: "Granel líquido",
      descripcion:
        "Carga líquida transportada en grandes cantidades.",
      activo: false,
      fecha_actualizacion: "02 sep. 2026",
    },
  ],

  tipos_contenedor: [
    {
      id: 1,
      nombre: "Dry Van 20'",
      descripcion:
        "Contenedor estándar de veinte pies.",
      activo: true,
      fecha_actualizacion: "Hoy, 08:40",
    },
    {
      id: 2,
      nombre: "Dry Van 40'",
      descripcion:
        "Contenedor estándar de cuarenta pies.",
      activo: true,
      fecha_actualizacion: "11 sep. 2026",
    },
    {
      id: 3,
      nombre: "Reefer",
      descripcion:
        "Contenedor refrigerado para carga sensible a temperatura.",
      activo: true,
      fecha_actualizacion: "05 sep. 2026",
    },
  ],

  tipos_inspeccion: [
    {
      id: 1,
      nombre: "Documental",
      descripcion:
        "Verificación de documentación relacionada con la operación.",
      activo: true,
      fecha_actualizacion: "Hoy, 07:55",
    },
    {
      id: 2,
      nombre: "Visual",
      descripcion:
        "Inspección física visual del elemento revisado.",
      activo: true,
      fecha_actualizacion: "09 sep. 2026",
    },
    {
      id: 3,
      nombre: "Seguridad",
      descripcion:
        "Inspección asociada al cumplimiento de condiciones de seguridad.",
      activo: true,
      fecha_actualizacion: "01 sep. 2026",
    },
  ],

  tipos_incidencia: [
    {
      id: 1,
      nombre: "Daño de contenedor",
      descripcion:
        "Daño físico detectado en un contenedor.",
      activo: true,
      fecha_actualizacion: "Hoy, 11:05",
    },
    {
      id: 2,
      nombre: "Retraso operativo",
      descripcion:
        "Demora registrada durante una operación portuaria.",
      activo: true,
      fecha_actualizacion: "10 sep. 2026",
    },
    {
      id: 3,
      nombre: "Documentación incompleta",
      descripcion:
        "Información o documentación requerida no disponible.",
      activo: true,
      fecha_actualizacion: "03 sep. 2026",
    },
  ],
};


const formularioInicial = {
  nombre: "",
  descripcion: "",
  activo: true,
};


function CatalogosPage() {
  const [
    catalogoActivo,
    setCatalogoActivo,
  ] = useState("tipos_buque");


  const [
    datosCatalogos,
    setDatosCatalogos,
  ] = useState(datosIniciales);


  const [
    busqueda,
    setBusqueda,
  ] = useState("");


  const [
    filtroEstado,
    setFiltroEstado,
  ] = useState("");


  const [
    cargando,
    setCargando,
  ] = useState(false);


  const [
    panelAbierto,
    setPanelAbierto,
  ] = useState(false);


  const [
    registroEditando,
    setRegistroEditando,
  ] = useState(null);


  const [
    formulario,
    setFormulario,
  ] = useState(formularioInicial);


  const [
    errores,
    setErrores,
  ] = useState({});


  const [
    guardando,
    setGuardando,
  ] = useState(false);


  const [
    mensajeExito,
    setMensajeExito,
  ] = useState("");


  const catalogoSeleccionado =
    catalogosDisponibles.find(
      (catalogo) =>
        catalogo.clave ===
        catalogoActivo
    );


  const registros =
    datosCatalogos[catalogoActivo] || [];


  const registrosFiltrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();


      return registros.filter(
        (registro) => {
          const coincideBusqueda =
            !texto ||
            registro.nombre
              .toLowerCase()
              .includes(texto) ||
            registro.descripcion
              .toLowerCase()
              .includes(texto);


          const coincideEstado =
            !filtroEstado ||
            String(registro.activo) ===
              filtroEstado;


          return (
            coincideBusqueda &&
            coincideEstado
          );
        }
      );
    }, [
      registros,
      busqueda,
      filtroEstado,
    ]);


  const totalActivos =
    registros.filter(
      (registro) =>
        registro.activo
    ).length;


  const totalInactivos =
    registros.length -
    totalActivos;


  function cambiarCatalogo(
    clave
  ) {
    setCatalogoActivo(clave);

    setBusqueda("");

    setFiltroEstado("");

    setPanelAbierto(false);

    setRegistroEditando(null);

    setFormulario(
      formularioInicial
    );
  }


  function limpiarFiltros() {
    setBusqueda("");

    setFiltroEstado("");
  }


  function actualizarCatalogo() {
    setCargando(true);


    setTimeout(() => {
      setCargando(false);
    }, 500);
  }


  function abrirNuevoRegistro() {
    setRegistroEditando(null);

    setFormulario(
      formularioInicial
    );

    setErrores({});

    setMensajeExito("");

    setPanelAbierto(true);
  }


  function abrirEditarRegistro(
    registro
  ) {
    setRegistroEditando(
      registro
    );


    setFormulario({
      nombre:
        registro.nombre,

      descripcion:
        registro.descripcion,

      activo:
        registro.activo,
    });


    setErrores({});

    setMensajeExito("");

    setPanelAbierto(true);
  }


  function cerrarPanel() {
    if (guardando) {
      return;
    }


    setPanelAbierto(false);

    setRegistroEditando(null);

    setFormulario(
      formularioInicial
    );

    setErrores({});

    setMensajeExito("");
  }


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


    if (errores[name]) {
      setErrores(
        (actuales) => ({
          ...actuales,
          [name]: "",
        })
      );
    }
  }


  function cambiarEstado(
    activo
  ) {
    setFormulario(
      (actual) => ({
        ...actual,
        activo,
      })
    );
  }


  function validarFormulario() {
    const nuevosErrores = {};


    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre =
        "Ingrese el nombre del registro.";
    }


    if (
      !formulario.descripcion.trim()
    ) {
      nuevosErrores.descripcion =
        "Ingrese una descripción.";
    }


    setErrores(
      nuevosErrores
    );


    return (
      Object.keys(
        nuevosErrores
      ).length === 0
    );
  }


  function guardarRegistro(
    evento
  ) {
    evento.preventDefault();


    if (!validarFormulario()) {
      return;
    }


    setGuardando(true);

    setMensajeExito("");


    setTimeout(() => {
      if (registroEditando) {
        setDatosCatalogos(
          (actuales) => ({
            ...actuales,

            [catalogoActivo]:
              actuales[
                catalogoActivo
              ].map(
                (registro) =>
                  registro.id ===
                  registroEditando.id
                    ? {
                        ...registro,

                        nombre:
                          formulario.nombre.trim(),

                        descripcion:
                          formulario.descripcion.trim(),

                        activo:
                          formulario.activo,

                        fecha_actualizacion:
                          "Ahora",
                      }
                    : registro
              ),
          })
        );


        setMensajeExito(
          "El registro fue actualizado correctamente."
        );
      } else {
        const nuevoRegistro = {
          id:
            Date.now(),

          nombre:
            formulario.nombre.trim(),

          descripcion:
            formulario.descripcion.trim(),

          activo:
            formulario.activo,

          fecha_actualizacion:
            "Ahora",
        };


        setDatosCatalogos(
          (actuales) => ({
            ...actuales,

            [catalogoActivo]: [
              nuevoRegistro,
              ...actuales[
                catalogoActivo
              ],
            ],
          })
        );


        setMensajeExito(
          "El registro fue creado correctamente."
        );
      }


      setGuardando(false);


      setTimeout(() => {
        cerrarPanel();
      }, 650);
    }, 600);
  }


  function cambiarEstadoRegistro(
    idRegistro
  ) {
    setDatosCatalogos(
      (actuales) => ({
        ...actuales,

        [catalogoActivo]:
          actuales[
            catalogoActivo
          ].map(
            (registro) =>
              registro.id ===
              idRegistro
                ? {
                    ...registro,

                    activo:
                      !registro.activo,

                    fecha_actualizacion:
                      "Ahora",
                  }
                : registro
          ),
      })
    );
  }


  const IconoCatalogo =
    catalogoSeleccionado.icono;


  return (
    <section className="pagina-catalogos">

      {/* ======================================
          FONDO
      ====================================== */}

      <div className="fondo-catalogos" />


      {/* ======================================
          ENCABEZADO
      ====================================== */}

      <div className="encabezado-catalogos">

        <div>

          <h1>
            Catálogos
          </h1>


          <p>
            Administra la información de apoyo
            utilizada por los distintos módulos
            de TALASSA.
          </p>

        </div>


        <button
          type="button"
          className="boton-nuevo-catalogo"
          onClick={
            abrirNuevoRegistro
          }
        >
          <Plus size={19} />

          Nuevo registro
        </button>

      </div>


      {/* ======================================
          SELECTOR DE CATÁLOGOS
      ====================================== */}

      <div className="selector-catalogos">

        {catalogosDisponibles.map(
          (catalogo) => {
            const Icono =
              catalogo.icono;


            const cantidad =
              datosCatalogos[
                catalogo.clave
              ]?.length || 0;


            return (
              <button
                key={
                  catalogo.clave
                }
                type="button"
                className={
                  catalogoActivo ===
                  catalogo.clave
                    ? "tarjeta-catalogo seleccionada"
                    : "tarjeta-catalogo"
                }
                onClick={() =>
                  cambiarCatalogo(
                    catalogo.clave
                  )
                }
              >

                <div className="icono-tarjeta-catalogo">
                  <Icono size={22} />
                </div>


                <div>

                  <strong>
                    {catalogo.nombre}
                  </strong>


                  <span>
                    {cantidad}
                    {" "}
                    registro
                    {cantidad !== 1
                      ? "s"
                      : ""}
                  </span>

                </div>

              </button>
            );
          }
        )}

      </div>


      {/* ======================================
          INDICADORES
      ====================================== */}

      <div className="resumen-catalogos">

        <article className="tarjeta-resumen-catalogo azul">

          <div className="icono-resumen-catalogo">
            <IconoCatalogo size={23} />
          </div>


          <div>

            <span>
              Total de registros
            </span>

            <strong>
              {registros.length}
            </strong>

            <small>
              En {catalogoSeleccionado.nombre.toLowerCase()}
            </small>

          </div>

        </article>


        <article className="tarjeta-resumen-catalogo menta">

          <div className="icono-resumen-catalogo">
            <Tag size={23} />
          </div>


          <div>

            <span>
              Registros activos
            </span>

            <strong>
              {totalActivos}
            </strong>

            <small>
              Disponibles para utilizar
            </small>

          </div>

        </article>


        <article className="tarjeta-resumen-catalogo rojo">

          <div className="icono-resumen-catalogo">
            <Tag size={23} />
          </div>


          <div>

            <span>
              Registros inactivos
            </span>

            <strong>
              {totalInactivos}
            </strong>

            <small>
              No disponibles actualmente
            </small>

          </div>

        </article>

      </div>


      {/* ======================================
          LISTADO
      ====================================== */}

      <article className="glass-card tarjeta-listado-catalogos">

        <div className="encabezado-listado-catalogos">

          <div>

            <h2>
              <IconoCatalogo
                size={21}
              />

              {
                catalogoSeleccionado.nombre
              }
            </h2>


            <span>
              {registrosFiltrados.length}
              {" "}
              resultado
              {registrosFiltrados.length !== 1
                ? "s"
                : ""}
            </span>

          </div>


          <button
            type="button"
            className="boton-actualizar-catalogos"
            onClick={
              actualizarCatalogo
            }
          >
            <RefreshCw
              size={17}
              className={
                cargando
                  ? "icono-girando-catalogos"
                  : ""
              }
            />

            Actualizar
          </button>

        </div>


        {/* ======================================
            FILTROS
        ====================================== */}

        <div className="filtros-catalogos">

          <div className="buscador-catalogos">

            <Search size={18} />


            <input
              type="text"
              value={busqueda}
              onChange={(evento) =>
                setBusqueda(
                  evento.target.value
                )
              }
              placeholder="Buscar por nombre o descripción..."
            />

          </div>


          <div className="campo-filtro-catalogos">

            <Filter size={16} />


            <select
              value={filtroEstado}
              onChange={(evento) =>
                setFiltroEstado(
                  evento.target.value
                )
              }
            >
              <option value="">
                Todos los estados
              </option>

              <option value="true">
                Activos
              </option>

              <option value="false">
                Inactivos
              </option>
            </select>

          </div>


          <button
            type="button"
            className="boton-limpiar-catalogos"
            onClick={limpiarFiltros}
          >
            Limpiar
          </button>

        </div>


        {/* ======================================
            CARGANDO
        ====================================== */}

        {cargando && (
          <div className="estado-carga-catalogos">

            <RefreshCw
              size={24}
              className="icono-girando-catalogos"
            />

            <span>
              Actualizando catálogo...
            </span>

          </div>
        )}


        {/* ======================================
            TABLA
        ====================================== */}

        {!cargando && (
          <div className="contenedor-tabla-catalogos">

            <table className="tabla-catalogos">

              <thead>

                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>
                    Última actualización
                  </th>
                  <th>Acciones</th>
                </tr>

              </thead>


              <tbody>

                {registrosFiltrados.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="tabla-sin-catalogos"
                    >
                      No se encontraron registros.
                    </td>

                  </tr>

                ) : (

                  registrosFiltrados.map(
                    (registro) => (

                      <tr
                        key={registro.id}
                      >

                        <td>

                          <div className="nombre-registro-catalogo">

                            <div className="icono-registro-catalogo">

                              <IconoCatalogo
                                size={17}
                              />

                            </div>


                            <strong>
                              {registro.nombre}
                            </strong>

                          </div>

                        </td>


                        <td className="descripcion-registro-catalogo">
                          {registro.descripcion}
                        </td>


                        <td>

                          <span
                            className={
                              registro.activo
                                ? "estado-catalogo activo"
                                : "estado-catalogo inactivo"
                            }
                          >

                            <i />

                            {registro.activo
                              ? "Activo"
                              : "Inactivo"}

                          </span>

                        </td>


                        <td>
                          {
                            registro.fecha_actualizacion
                          }
                        </td>


                        <td>

                          <div className="acciones-catalogo">

                            <button
                              type="button"
                              title="Editar registro"
                              onClick={() =>
                                abrirEditarRegistro(
                                  registro
                                )
                              }
                            >
                              <Pencil
                                size={16}
                              />
                            </button>


                            <button
                              type="button"
                              title={
                                registro.activo
                                  ? "Desactivar"
                                  : "Reactivar"
                              }
                              className={
                                registro.activo
                                  ? "accion-desactivar-catalogo"
                                  : "accion-reactivar-catalogo"
                              }
                              onClick={() =>
                                cambiarEstadoRegistro(
                                  registro.id
                                )
                              }
                            >
                              <Tag
                                size={16}
                              />
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>
        )}

      </article>


      {/* ======================================
          PANEL LATERAL
      ====================================== */}

      {panelAbierto && (

        <div
          className="fondo-panel-catalogo"
          onMouseDown={(evento) => {
            if (
              evento.target ===
              evento.currentTarget
            ) {
              cerrarPanel();
            }
          }}
        >

          <aside className="panel-formulario-catalogo">

            <button
              type="button"
              className="cerrar-panel-catalogo"
              onClick={cerrarPanel}
              disabled={guardando}
              aria-label="Cerrar"
            >
              <X size={19} />
            </button>


            <div className="encabezado-panel-catalogo">

              <div className="icono-panel-catalogo">
                <IconoCatalogo
                  size={23}
                />
              </div>


              <div>

                <h2>
                  {registroEditando
                    ? `Editar ${catalogoSeleccionado.singular}`
                    : `Nuevo ${catalogoSeleccionado.singular}`}
                </h2>


                <p>
                  {registroEditando
                    ? "Actualice la información del registro seleccionado."
                    : "Registre una nueva opción para utilizarla dentro del sistema."}
                </p>

              </div>

            </div>


            <form
              className="formulario-catalogo"
              onSubmit={
                guardarRegistro
              }
              noValidate
            >

              {/* NOMBRE */}

              <div className="campo-formulario-catalogo">

                <label htmlFor="nombreCatalogo">
                  Nombre
                  <span>*</span>
                </label>


                <div
                  className={
                    errores.nombre
                      ? "entrada-catalogo con-error"
                      : "entrada-catalogo"
                  }
                >
                  <Tag size={17} />


                  <input
                    id="nombreCatalogo"
                    name="nombre"
                    type="text"
                    value={
                      formulario.nombre
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="Ingrese el nombre"
                    maxLength={120}
                  />

                </div>


                {errores.nombre && (
                  <small className="mensaje-error-campo-catalogo">
                    {errores.nombre}
                  </small>
                )}

              </div>


              {/* DESCRIPCIÓN */}

              <div className="campo-formulario-catalogo">

                <label htmlFor="descripcionCatalogo">
                  Descripción
                  <span>*</span>
                </label>


                <textarea
                  id="descripcionCatalogo"
                  name="descripcion"
                  value={
                    formulario.descripcion
                  }
                  onChange={
                    manejarCambio
                  }
                  className={
                    errores.descripcion
                      ? "textarea-catalogo con-error"
                      : "textarea-catalogo"
                  }
                  placeholder="Describa brevemente este registro..."
                  rows="5"
                  maxLength={300}
                />


                {errores.descripcion && (
                  <small className="mensaje-error-campo-catalogo">
                    {
                      errores.descripcion
                    }
                  </small>
                )}

              </div>


              {/* ESTADO */}

              <div className="campo-formulario-catalogo">

                <label>
                  Estado
                  <span>*</span>
                </label>


                <div className="selector-estado-catalogo">

                  <button
                    type="button"
                    className={
                      formulario.activo
                        ? "opcion-estado-catalogo activa seleccionada"
                        : "opcion-estado-catalogo activa"
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
                        ? "opcion-estado-catalogo inactiva seleccionada"
                        : "opcion-estado-catalogo inactiva"
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


              {mensajeExito && (
                <div className="mensaje-exito-catalogo">
                  {mensajeExito}
                </div>
              )}


              <div className="acciones-formulario-catalogo">

                <button
                  type="button"
                  className="boton-cancelar-catalogo"
                  onClick={
                    cerrarPanel
                  }
                  disabled={
                    guardando
                  }
                >
                  Cancelar
                </button>


                <button
                  type="submit"
                  className="boton-guardar-catalogo"
                  disabled={
                    guardando
                  }
                >

                  {guardando ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="icono-girando-catalogos"
                      />

                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={17} />

                      {registroEditando
                        ? "Guardar cambios"
                        : "Registrar"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </aside>

        </div>

      )}

    </section>
  );
}


export default CatalogosPage;