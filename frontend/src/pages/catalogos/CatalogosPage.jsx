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
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  actualizarRegistroCatalogo,
  cambiarEstadoRegistroCatalogo,
  crearRegistroCatalogo,
  listarCatalogo,
  listarTodosCatalogos,
} from "../../services/catalogos.service.js";

import {
  cerrarSesion,
  obtenerUsuarioGuardado,
} from "../../services/auth.service.js";

import "../../styles/catalogos.css";


/* ======================================
   CATÁLOGOS DISPONIBLES
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
   ESTADO INICIAL DE LOS CATÁLOGOS
====================================== */

const datosIniciales = {
  tipos_buque: [],
  tipos_carga: [],
  tipos_contenedor: [],
  tipos_inspeccion: [],
  tipos_incidencia: [],
};


/* ======================================
   FORMULARIO INICIAL
====================================== */

const formularioInicial = {
  nombre: "",
  descripcion: "",
  activo: true,
};


function CatalogosPage() {
  const navigate =
    useNavigate();


  const usuario =
    obtenerUsuarioGuardado();


  const puedeGestionar =
    usuario?.permisos?.includes(
      "CAT_GESTIONAR"
    ) ?? false;


  /* ======================================
     ESTADOS
  ====================================== */

  const [
    catalogoActivo,
    setCatalogoActivo,
  ] = useState(
    "tipos_buque"
  );


  const [
    datosCatalogos,
    setDatosCatalogos,
  ] = useState(
    datosIniciales
  );


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
  ] = useState(true);


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
  ] = useState(
    formularioInicial
  );


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


  const [
    errorGeneral,
    setErrorGeneral,
  ] = useState("");


  const [
    errorFormulario,
    setErrorFormulario,
  ] = useState("");


  /* ======================================
     CARGA INICIAL
  ====================================== */

  useEffect(() => {
    let componenteActivo =
      true;


    async function cargarInicial() {
      try {
        const respuesta =
          await listarTodosCatalogos();


        if (!componenteActivo) {
          return;
        }


        setDatosCatalogos({
          ...datosIniciales,
          ...(respuesta.data || {}),
        });


      } catch (error) {
        console.error(
          "Error al cargar catálogos:",
          error
        );


        if (!componenteActivo) {
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


        setErrorGeneral(
          error.response?.data?.message
          ||
          "No fue posible cargar los catálogos."
        );


      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    }


    cargarInicial();


    return () => {
      componenteActivo =
        false;
    };

  }, [navigate]);


  /* ======================================
     CATÁLOGO SELECCIONADO
  ====================================== */

  const catalogoSeleccionado =
    catalogosDisponibles.find(
      (catalogo) =>
        catalogo.clave ===
        catalogoActivo
    );


  const registros =
    datosCatalogos[
      catalogoActivo
    ] || [];


  /* ======================================
     FILTROS
  ====================================== */

  const registrosFiltrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();


      return registros.filter(
        (registro) => {
          const coincideBusqueda =
            !texto
            ||
            registro.nombre
              ?.toLowerCase()
              .includes(texto)
            ||
            (
              registro.descripcion
              || ""
            )
              .toLowerCase()
              .includes(texto);


          const coincideEstado =
            !filtroEstado
            ||
            String(
              registro.activo
            ) ===
              filtroEstado;


          return (
            coincideBusqueda
            &&
            coincideEstado
          );
        }
      );

    }, [
      registros,
      busqueda,
      filtroEstado,
    ]);


  /* ======================================
     INDICADORES
  ====================================== */

  const totalActivos =
    registros.filter(
      (registro) =>
        registro.activo
    ).length;


  const totalInactivos =
    registros.length
    -
    totalActivos;


  /* ======================================
     CAMBIAR CATÁLOGO
  ====================================== */

  function cambiarCatalogo(
    clave
  ) {
    setCatalogoActivo(
      clave
    );


    setBusqueda("");

    setFiltroEstado("");

    setPanelAbierto(false);

    setRegistroEditando(null);

    setFormulario({
      ...formularioInicial,
    });

    setErrores({});

    setMensajeExito("");

    setErrorGeneral("");

    setErrorFormulario("");
  }


  function limpiarFiltros() {
    setBusqueda("");

    setFiltroEstado("");
  }


  /* ======================================
     ACTUALIZAR CATÁLOGO
  ====================================== */

  async function actualizarCatalogo() {
    try {
      setCargando(true);

      setErrorGeneral("");


      const respuesta =
        await listarCatalogo(
          catalogoActivo
        );


      setDatosCatalogos(
        (actuales) => ({
          ...actuales,

          [catalogoActivo]:
            respuesta.data || [],
        })
      );


    } catch (error) {
      console.error(
        "Error al actualizar catálogo:",
        error
      );


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


      setErrorGeneral(
        error.response?.data?.message
        ||
        "No fue posible actualizar el catálogo."
      );


    } finally {
      setCargando(false);
    }
  }


  /* ======================================
     ABRIR NUEVO REGISTRO
  ====================================== */

  function abrirNuevoRegistro() {
    if (!puedeGestionar) {
      return;
    }


    setRegistroEditando(null);


    setFormulario({
      ...formularioInicial,
    });


    setErrores({});

    setMensajeExito("");

    setErrorGeneral("");

    setErrorFormulario("");

    setPanelAbierto(true);
  }


  /* ======================================
     EDITAR REGISTRO
  ====================================== */

  function abrirEditarRegistro(
    registro
  ) {
    if (!puedeGestionar) {
      return;
    }


    setRegistroEditando(
      registro
    );


    setFormulario({
      nombre:
        registro.nombre || "",

      descripcion:
        registro.descripcion || "",

      activo:
        registro.activo,
    });


    setErrores({});

    setMensajeExito("");

    setErrorGeneral("");

    setErrorFormulario("");

    setPanelAbierto(true);
  }


  /* ======================================
     CERRAR PANEL
  ====================================== */

  function cerrarPanel() {
    if (guardando) {
      return;
    }


    setPanelAbierto(false);

    setRegistroEditando(null);


    setFormulario({
      ...formularioInicial,
    });


    setErrores({});

    setMensajeExito("");

    setErrorFormulario("");
  }


  /* ======================================
     CAMBIOS EN FORMULARIO
  ====================================== */

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

        [name]:
          value,
      })
    );


    if (errores[name]) {
      setErrores(
        (actuales) => ({
          ...actuales,

          [name]:
            "",
        })
      );
    }


    if (errorFormulario) {
      setErrorFormulario("");
    }
  }


  function cambiarEstadoFormulario(
    activo
  ) {
    setFormulario(
      (actual) => ({
        ...actual,
        activo,
      })
    );


    if (errorFormulario) {
      setErrorFormulario("");
    }
  }


  /* ======================================
     VALIDAR FORMULARIO
  ====================================== */

  function validarFormulario() {
    const nuevosErrores = {};


    if (
      !formulario.nombre.trim()
    ) {
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


  /* ======================================
     GUARDAR REGISTRO
  ====================================== */

  async function guardarRegistro(
    evento
  ) {
    evento.preventDefault();


    if (
      !puedeGestionar
      ||
      !validarFormulario()
    ) {
      return;
    }


    try {
      setGuardando(true);

      setMensajeExito("");

      setErrorGeneral("");

      setErrorFormulario("");


      const datos = {
        nombre:
          formulario.nombre.trim(),

        descripcion:
          formulario.descripcion.trim(),

        activo:
          formulario.activo,
      };


      /* ======================================
         ACTUALIZAR
      ====================================== */

      if (registroEditando) {
        const respuesta =
          await actualizarRegistroCatalogo(
            catalogoActivo,
            registroEditando.id,
            datos
          );


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
                    ? respuesta.data
                    : registro
              ),
          })
        );


        setMensajeExito(
          "El registro fue actualizado correctamente."
        );


      /* ======================================
         CREAR
      ====================================== */

      } else {
        const respuesta =
          await crearRegistroCatalogo(
            catalogoActivo,
            datos
          );


        setDatosCatalogos(
          (actuales) => ({
            ...actuales,

            [catalogoActivo]: [
              respuesta.data,
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


      /* ======================================
         CERRAR DESPUÉS DEL ÉXITO
      ====================================== */

      setTimeout(() => {
        setPanelAbierto(false);

        setRegistroEditando(null);


        setFormulario({
          ...formularioInicial,
        });


        setErrores({});

        setMensajeExito("");

        setErrorFormulario("");

      }, 650);


    } catch (error) {
      console.error(
        "Error al guardar catálogo:",
        error
      );


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


      /*
        Los errores de creación o edición
        se muestran dentro del formulario.
      */

      setErrorFormulario(
        error.response?.data?.message
        ||
        "No fue posible guardar el registro."
      );


    } finally {
      setGuardando(false);
    }
  }


  /* ======================================
     ACTIVAR / DESACTIVAR
  ====================================== */

  async function cambiarEstadoRegistro(
    registro
  ) {
    if (!puedeGestionar) {
      return;
    }


    try {
      setErrorGeneral("");


      const respuesta =
        await cambiarEstadoRegistroCatalogo(
          catalogoActivo,
          registro.id,
          !registro.activo
        );


      setDatosCatalogos(
        (actuales) => ({
          ...actuales,

          [catalogoActivo]:
            actuales[
              catalogoActivo
            ].map(
              (actual) =>
                actual.id ===
                registro.id
                  ? respuesta.data
                  : actual
            ),
        })
      );


    } catch (error) {
      console.error(
        "Error al cambiar estado:",
        error
      );


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


      setErrorGeneral(
        error.response?.data?.message
        ||
        "No fue posible cambiar el estado del registro."
      );
    }
  }


  /* ======================================
     ICONO DEL CATÁLOGO
  ====================================== */

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


        {puedeGestionar && (

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

        )}

      </div>


      {/* ======================================
          ERROR GENERAL
      ====================================== */}

      {errorGeneral && (

        <div className="mensaje-error-general-catalogo">

          <TriangleAlert
            size={17}
          />

          <span>
            {errorGeneral}
          </span>

        </div>

      )}


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

                  <Icono
                    size={22}
                  />

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
          RESUMEN
      ====================================== */}

      <div className="resumen-catalogos">

        <article className="tarjeta-resumen-catalogo azul">

          <div className="icono-resumen-catalogo">

            <IconoCatalogo
              size={23}
            />

          </div>


          <div>

            <span>
              Total de registros
            </span>


            <strong>
              {registros.length}
            </strong>


            <small>
              En{" "}
              {catalogoSeleccionado.nombre.toLowerCase()}
            </small>

          </div>

        </article>


        <article className="tarjeta-resumen-catalogo menta">

          <div className="icono-resumen-catalogo">

            <Tag
              size={23}
            />

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

            <Tag
              size={23}
            />

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
            disabled={
              cargando
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

            <Search
              size={18}
            />


            <input
              type="text"
              value={
                busqueda
              }
              onChange={(evento) =>
                setBusqueda(
                  evento.target.value
                )
              }
              placeholder="Buscar por nombre o descripción..."
            />

          </div>


          <div className="campo-filtro-catalogos">

            <Filter
              size={16}
            />


            <select
              value={
                filtroEstado
              }
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
            onClick={
              limpiarFiltros
            }
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

                  <th>
                    Nombre
                  </th>

                  <th>
                    Descripción
                  </th>

                  <th>
                    Estado
                  </th>

                  <th>
                    Acciones
                  </th>

                </tr>

              </thead>


              <tbody>

                {registrosFiltrados.length === 0 ? (

                  <tr>

                    <td
                      colSpan="4"
                      className="tabla-sin-catalogos"
                    >
                      No se encontraron registros.
                    </td>

                  </tr>

                ) : (

                  registrosFiltrados.map(
                    (registro) => (

                      <tr
                        key={
                          registro.id
                        }
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

                          {
                            registro.descripcion
                            ||
                            "—"
                          }

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

                          {puedeGestionar ? (

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
                                    registro
                                  )
                                }
                              >

                                <Tag
                                  size={16}
                                />

                              </button>

                            </div>

                          ) : (

                            <span>
                              —
                            </span>

                          )}

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

            {/* CERRAR */}

            <button
              type="button"
              className="cerrar-panel-catalogo"
              onClick={
                cerrarPanel
              }
              disabled={
                guardando
              }
              aria-label="Cerrar"
            >

              <X
                size={19}
              />

            </button>


            {/* ENCABEZADO PANEL */}

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


            {/* FORMULARIO */}

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

                  <span>
                    *
                  </span>

                </label>


                <div
                  className={
                    errores.nombre
                      ? "entrada-catalogo con-error"
                      : "entrada-catalogo"
                  }
                >

                  <Tag
                    size={17}
                  />


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
                    maxLength={100}
                  />

                </div>


                {errores.nombre && (

                  <small className="mensaje-error-campo-catalogo">

                    {
                      errores.nombre
                    }

                  </small>

                )}

              </div>


              {/* DESCRIPCIÓN */}

              <div className="campo-formulario-catalogo">

                <label htmlFor="descripcionCatalogo">

                  Descripción

                  <span>
                    *
                  </span>

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
                  maxLength={250}
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

                  <span>
                    *
                  </span>

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
                      cambiarEstadoFormulario(
                        true
                      )
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
                      cambiarEstadoFormulario(
                        false
                      )
                    }
                  >

                    <i />

                    Inactivo

                  </button>

                </div>

              </div>


              {/* ======================================
                  ERROR DEL FORMULARIO
              ====================================== */}

              {errorFormulario && (

                <div className="mensaje-error-formulario-catalogo">

                  <TriangleAlert
                    size={16}
                  />

                  <span>
                    {errorFormulario}
                  </span>

                </div>

              )}


              {/* ======================================
                  MENSAJE DE ÉXITO
              ====================================== */}

              {mensajeExito && (

                <div className="mensaje-exito-catalogo">

                  {mensajeExito}

                </div>

              )}


              {/* ======================================
                  BOTONES
              ====================================== */}

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

                      <Save
                        size={17}
                      />

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