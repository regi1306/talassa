import {
  Building2,
  Filter,
  LoaderCircle,
  MapPin,
  Pencil,
  Plus,
  Power,
  RefreshCw,
  Save,
  Search,
  Ship,
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
  actualizarEmpresa,
  cambiarEstadoEmpresa,
  crearEmpresa,
  listarEmpresas,
} from "../../services/empresas.service.js";

import {
  cerrarSesion,
  obtenerUsuarioGuardado,
} from "../../services/auth.service.js";

import "../../styles/empresas.css";


const formularioInicial = {
  nombre: "",
  tipo: "",
  pais: "",
  activo: true,
};


function formatearFecha(fecha) {
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


function EmpresasPage() {
  const navigate =
    useNavigate();


  const usuario =
    obtenerUsuarioGuardado();


  const puedeGestionar =
    usuario?.permisos?.includes(
      "EMP_GESTIONAR"
    ) ?? false;


  const [
    empresas,
    setEmpresas,
  ] = useState([]);


  const [
    busqueda,
    setBusqueda,
  ] = useState("");


  const [
    filtroTipo,
    setFiltroTipo,
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
    empresaEditando,
    setEmpresaEditando,
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


  /* ======================================
     CARGA INICIAL
  ====================================== */

  useEffect(() => {
    let componenteActivo =
      true;


    async function cargarInicial() {
      try {
        const respuesta =
          await listarEmpresas();


        if (!componenteActivo) {
          return;
        }


        setEmpresas(
          respuesta.data || []
        );


      } catch (error) {
        console.error(
          "Error al cargar empresas:",
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
          "No fue posible cargar las empresas."
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
     ACTUALIZAR LISTADO
  ====================================== */

  async function cargarEmpresas() {
    try {
      setCargando(true);

      setErrorGeneral("");


      const respuesta =
        await listarEmpresas();


      setEmpresas(
        respuesta.data || []
      );


    } catch (error) {
      console.error(
        "Error al actualizar empresas:",
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
        "No fue posible actualizar las empresas."
      );


    } finally {
      setCargando(false);
    }
  }


  /* ======================================
     FILTROS
  ====================================== */

  const tiposEmpresa =
    useMemo(() => {
      return [
        ...new Set(
          empresas
            .map(
              (empresa) =>
                empresa.tipo
            )
            .filter(Boolean)
        ),
      ].sort();

    }, [empresas]);


  const empresasFiltradas =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();


      return empresas.filter(
        (empresa) => {
          const coincideBusqueda =
            !texto
            ||
            empresa.nombre
              ?.toLowerCase()
              .includes(texto)
            ||
            (
              empresa.pais || ""
            )
              .toLowerCase()
              .includes(texto);


          const coincideTipo =
            !filtroTipo
            ||
            empresa.tipo ===
              filtroTipo;


          const coincideEstado =
            !filtroEstado
            ||
            String(
              empresa.activo
            ) === filtroEstado;


          return (
            coincideBusqueda
            &&
            coincideTipo
            &&
            coincideEstado
          );
        }
      );

    }, [
      empresas,
      busqueda,
      filtroTipo,
      filtroEstado,
    ]);


  const totalActivas =
    empresas.filter(
      (empresa) =>
        empresa.activo
    ).length;


  const totalInactivas =
    empresas.length
    -
    totalActivas;


  const totalNavieras =
    empresas.filter(
      (empresa) =>
        empresa.tipo ===
        "Naviera"
    ).length;


  function limpiarFiltros() {
    setBusqueda("");

    setFiltroTipo("");

    setFiltroEstado("");
  }


  /* ======================================
     PANEL
  ====================================== */

  function abrirNuevaEmpresa() {
    if (!puedeGestionar) {
      return;
    }


    setEmpresaEditando(null);

    setFormulario({
      ...formularioInicial,
    });

    setErrores({});

    setMensajeExito("");

    setErrorGeneral("");

    setPanelAbierto(true);
  }


  function abrirEditarEmpresa(
    empresa
  ) {
    if (!puedeGestionar) {
      return;
    }


    setEmpresaEditando(
      empresa
    );


    setFormulario({
      nombre:
        empresa.nombre || "",

      tipo:
        empresa.tipo || "",

      pais:
        empresa.pais || "",

      activo:
        empresa.activo,
    });


    setErrores({});

    setMensajeExito("");

    setErrorGeneral("");

    setPanelAbierto(true);
  }


  function cerrarPanel() {
    if (guardando) {
      return;
    }


    setPanelAbierto(false);

    setEmpresaEditando(null);

    setFormulario({
      ...formularioInicial,
    });

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
  }


  /* ======================================
     VALIDACIÓN
  ====================================== */

  function validarFormulario() {
    const nuevosErrores = {};


    if (
      !formulario.nombre.trim()
    ) {
      nuevosErrores.nombre =
        "Ingrese el nombre de la empresa.";
    }


    if (!formulario.tipo) {
      nuevosErrores.tipo =
        "Seleccione un tipo de empresa.";
    }


    if (
      !formulario.pais.trim()
    ) {
      nuevosErrores.pais =
        "Ingrese el país de la empresa.";
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
     CREAR / EDITAR
  ====================================== */

  async function guardarEmpresa(
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


      const datos = {
        nombre:
          formulario.nombre.trim(),

        tipo:
          formulario.tipo,

        pais:
          formulario.pais.trim(),

        activo:
          formulario.activo,
      };


      if (empresaEditando) {
        const respuesta =
          await actualizarEmpresa(
            empresaEditando.id_empresa,
            datos
          );


        setEmpresas(
          (actuales) =>
            actuales.map(
              (empresa) =>
                empresa.id_empresa ===
                empresaEditando.id_empresa
                  ? respuesta.data
                  : empresa
            )
        );


        setMensajeExito(
          "La empresa fue actualizada correctamente."
        );


      } else {
        const respuesta =
          await crearEmpresa(
            datos
          );


        setEmpresas(
          (actuales) => [
            respuesta.data,
            ...actuales,
          ]
        );


        setMensajeExito(
          "La empresa fue registrada correctamente."
        );
      }


      setTimeout(() => {
        cerrarPanel();
      }, 650);


    } catch (error) {
      console.error(
        "Error al guardar empresa:",
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
        "No fue posible guardar la empresa."
      );


    } finally {
      setGuardando(false);
    }
  }


  /* ======================================
     ACTIVAR / DESACTIVAR
  ====================================== */

  async function cambiarEstadoRegistro(
    empresa
  ) {
    if (!puedeGestionar) {
      return;
    }


    try {
      setErrorGeneral("");


      const nuevoEstado =
        !empresa.activo;


      const respuesta =
        await cambiarEstadoEmpresa(
          empresa.id_empresa,
          nuevoEstado
        );


      setEmpresas(
        (actuales) =>
          actuales.map(
            (actual) =>
              actual.id_empresa ===
              empresa.id_empresa
                ? respuesta.data
                : actual
          )
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
        "No fue posible cambiar el estado de la empresa."
      );
    }
  }


  return (
    <section className="pagina-empresas">

      <div className="fondo-empresas" />


      {/* ENCABEZADO */}

      <div className="encabezado-empresas">

        <div>

          <h1>
            Empresas
          </h1>

          <p>
            Gestiona las empresas relacionadas
            con los buques y operaciones de
            TALASSA.
          </p>

        </div>


        {puedeGestionar && (

          <button
            type="button"
            className="boton-nueva-empresa"
            onClick={
              abrirNuevaEmpresa
            }
          >

            <Plus size={19} />

            Nueva empresa

          </button>

        )}

      </div>


      {errorGeneral && (

        <div className="mensaje-error-general-empresa">

          <TriangleAlert
            size={17}
          />

          {errorGeneral}

        </div>

      )}


      {/* RESUMEN */}

      <div className="resumen-empresas">

        <article className="tarjeta-resumen-empresa azul">

          <div className="icono-resumen-empresa">
            <Building2 size={24} />
          </div>

          <div>
            <span>
              Total registradas
            </span>

            <strong>
              {empresas.length}
            </strong>

            <small>
              Empresas en el sistema
            </small>
          </div>

        </article>


        <article className="tarjeta-resumen-empresa menta">

          <div className="icono-resumen-empresa">
            <Building2 size={24} />
          </div>

          <div>
            <span>
              Empresas activas
            </span>

            <strong>
              {totalActivas}
            </strong>

            <small>
              Disponibles actualmente
            </small>
          </div>

        </article>


        <article className="tarjeta-resumen-empresa rojo">

          <div className="icono-resumen-empresa">
            <Power size={24} />
          </div>

          <div>
            <span>
              Empresas inactivas
            </span>

            <strong>
              {totalInactivas}
            </strong>

            <small>
              Registros deshabilitados
            </small>
          </div>

        </article>


        <article className="tarjeta-resumen-empresa blanco">

          <div className="icono-resumen-empresa">
            <Ship size={24} />
          </div>

          <div>
            <span>
              Navieras
            </span>

            <strong>
              {totalNavieras}
            </strong>

            <small>
              Empresas tipo naviera
            </small>
          </div>

        </article>

      </div>


      {/* LISTADO */}

      <article className="glass-card tarjeta-listado-empresas">

        <div className="encabezado-listado-empresas">

          <div>

            <h2>
              <Building2 size={21} />
              Listado de empresas
            </h2>

            <span>
              {empresasFiltradas.length}
              {" "}
              resultado
              {empresasFiltradas.length !== 1
                ? "s"
                : ""}
            </span>

          </div>


          <button
            type="button"
            className="boton-actualizar-empresas"
            onClick={
              cargarEmpresas
            }
            disabled={cargando}
          >

            <RefreshCw
              size={17}
              className={
                cargando
                  ? "icono-girando-empresas"
                  : ""
              }
            />

            Actualizar

          </button>

        </div>


        {/* FILTROS */}

        <div className="filtros-empresas">

          <div className="buscador-empresas">

            <Search size={18} />

            <input
              type="text"
              value={busqueda}
              onChange={(evento) =>
                setBusqueda(
                  evento.target.value
                )
              }
              placeholder="Buscar por nombre o país..."
            />

          </div>


          <div className="campo-filtro-empresas">

            <Filter size={16} />

            <select
              value={filtroTipo}
              onChange={(evento) =>
                setFiltroTipo(
                  evento.target.value
                )
              }
            >

              <option value="">
                Todos los tipos
              </option>

              {tiposEmpresa.map(
                (tipo) => (
                  <option
                    key={tipo}
                    value={tipo}
                  >
                    {tipo}
                  </option>
                )
              )}

            </select>

          </div>


          <div className="campo-filtro-empresas">

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
                Activas
              </option>

              <option value="false">
                Inactivas
              </option>

            </select>

          </div>


          <button
            type="button"
            className="boton-limpiar-empresas"
            onClick={
              limpiarFiltros
            }
          >
            Limpiar
          </button>

        </div>


        {cargando && (

          <div className="estado-carga-empresas">

            <RefreshCw
              size={24}
              className="icono-girando-empresas"
            />

            <span>
              Actualizando empresas...
            </span>

          </div>

        )}


        {!cargando && (

          <div className="contenedor-tabla-empresas">

            <table className="tabla-empresas">

              <thead>

                <tr>
                  <th>Empresa</th>
                  <th>Tipo</th>
                  <th>País</th>
                  <th>Estado</th>
                  <th>
                    Fecha de registro
                  </th>
                  <th>Acciones</th>
                </tr>

              </thead>


              <tbody>

                {empresasFiltradas.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="tabla-sin-empresas"
                    >
                      No se encontraron empresas.
                    </td>

                  </tr>

                ) : (

                  empresasFiltradas.map(
                    (empresa) => (

                      <tr
                        key={
                          empresa.id_empresa
                        }
                      >

                        <td>

                          <div className="empresa-tabla">

                            <div className="icono-empresa-tabla">
                              <Building2
                                size={17}
                              />
                            </div>

                            <strong>
                              {empresa.nombre}
                            </strong>

                          </div>

                        </td>


                        <td>
                          <span className="tipo-empresa">
                            {empresa.tipo}
                          </span>
                        </td>


                        <td>

                          <div className="pais-empresa">

                            <MapPin size={14} />

                            {empresa.pais || "—"}

                          </div>

                        </td>


                        <td>

                          <span
                            className={
                              empresa.activo
                                ? "estado-empresa activo"
                                : "estado-empresa inactivo"
                            }
                          >
                            <i />

                            {empresa.activo
                              ? "Activa"
                              : "Inactiva"}
                          </span>

                        </td>


                        <td>
                          {formatearFecha(
                            empresa.fecha_creacion
                          )}
                        </td>


                        <td>

                          {puedeGestionar ? (

                            <div className="acciones-empresa">

                              <button
                                type="button"
                                title="Editar empresa"
                                onClick={() =>
                                  abrirEditarEmpresa(
                                    empresa
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
                                  empresa.activo
                                    ? "Desactivar empresa"
                                    : "Reactivar empresa"
                                }
                                className={
                                  empresa.activo
                                    ? "accion-desactivar"
                                    : "accion-reactivar"
                                }
                                onClick={() =>
                                  cambiarEstadoRegistro(
                                    empresa
                                  )
                                }
                              >
                                <Power
                                  size={16}
                                />
                              </button>

                            </div>

                          ) : (
                            <span>—</span>
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


      {/* PANEL */}

      {panelAbierto && (

        <div
          className="fondo-panel-empresa"
          onMouseDown={(evento) => {
            if (
              evento.target ===
              evento.currentTarget
            ) {
              cerrarPanel();
            }
          }}
        >

          <aside className="panel-formulario-empresa">

            <button
              type="button"
              className="cerrar-panel-empresa"
              onClick={
                cerrarPanel
              }
              disabled={
                guardando
              }
              aria-label="Cerrar"
            >
              <X size={19} />
            </button>


            <div className="encabezado-panel-empresa">

              <div className="icono-panel-empresa">
                <Building2 size={23} />
              </div>


              <div>

                <h2>
                  {empresaEditando
                    ? "Editar empresa"
                    : "Nueva empresa"}
                </h2>

                <p>
                  {empresaEditando
                    ? "Actualice la información general de la empresa."
                    : "Registre una nueva empresa relacionada con las operaciones portuarias."}
                </p>

              </div>

            </div>


            <form
              className="formulario-empresa"
              onSubmit={
                guardarEmpresa
              }
              noValidate
            >

              {/* NOMBRE */}

              <div className="campo-formulario-empresa">

                <label htmlFor="nombre">
                  Nombre de la empresa
                  <span>*</span>
                </label>


                <div
                  className={
                    errores.nombre
                      ? "entrada-empresa con-error"
                      : "entrada-empresa"
                  }
                >

                  <Building2 size={17} />

                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={
                      formulario.nombre
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="Ej. Pacific Shipping"
                    maxLength={150}
                  />

                </div>


                {errores.nombre && (
                  <small className="mensaje-error-campo-empresa">
                    {errores.nombre}
                  </small>
                )}

              </div>


              {/* TIPO */}

              <div className="campo-formulario-empresa">

                <label htmlFor="tipo">
                  Tipo de empresa
                  <span>*</span>
                </label>


                <div
                  className={
                    errores.tipo
                      ? "entrada-empresa con-error"
                      : "entrada-empresa"
                  }
                >

                  <Ship size={17} />

                  <select
                    id="tipo"
                    name="tipo"
                    value={
                      formulario.tipo
                    }
                    onChange={
                      manejarCambio
                    }
                  >

                    <option value="">
                      Seleccionar tipo
                    </option>

                    <option value="Naviera">
                      Naviera
                    </option>

                    <option value="Armador">
                      Armador
                    </option>

                    <option value="Operador portuario">
                      Operador portuario
                    </option>

                    <option value="Operador logístico">
                      Operador logístico
                    </option>

                  </select>

                </div>


                {errores.tipo && (
                  <small className="mensaje-error-campo-empresa">
                    {errores.tipo}
                  </small>
                )}

              </div>


              {/* PAÍS */}

              <div className="campo-formulario-empresa">

                <label htmlFor="pais">
                  País
                  <span>*</span>
                </label>


                <div
                  className={
                    errores.pais
                      ? "entrada-empresa con-error"
                      : "entrada-empresa"
                  }
                >

                  <MapPin size={17} />

                  <input
                    id="pais"
                    name="pais"
                    type="text"
                    value={
                      formulario.pais
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="Ej. Panamá"
                    maxLength={80}
                  />

                </div>


                {errores.pais && (
                  <small className="mensaje-error-campo-empresa">
                    {errores.pais}
                  </small>
                )}

              </div>


              {/* ESTADO */}

              <div className="campo-formulario-empresa">

                <label>
                  Estado
                  <span>*</span>
                </label>


                <div className="selector-estado-empresa">

                  <button
                    type="button"
                    className={
                      formulario.activo
                        ? "opcion-estado-empresa activa seleccionada"
                        : "opcion-estado-empresa activa"
                    }
                    onClick={() =>
                      cambiarEstadoFormulario(
                        true
                      )
                    }
                  >
                    <i />
                    Activa
                  </button>


                  <button
                    type="button"
                    className={
                      !formulario.activo
                        ? "opcion-estado-empresa inactiva seleccionada"
                        : "opcion-estado-empresa inactiva"
                    }
                    onClick={() =>
                      cambiarEstadoFormulario(
                        false
                      )
                    }
                  >
                    <i />
                    Inactiva
                  </button>

                </div>

              </div>


              {mensajeExito && (
                <div className="mensaje-exito-empresa">
                  {mensajeExito}
                </div>
              )}


              <div className="acciones-formulario-empresa">

                <button
                  type="button"
                  className="boton-cancelar-empresa"
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
                  className="boton-guardar-empresa"
                  disabled={
                    guardando
                  }
                >

                  {guardando ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="icono-girando-empresas"
                      />

                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={17} />

                      {empresaEditando
                        ? "Guardar cambios"
                        : "Registrar empresa"}
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


export default EmpresasPage;