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
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import "../../styles/empresas.css";


/* ======================================
   DATOS TEMPORALES

   Más adelante serán reemplazados
   por información proveniente de la API.
====================================== */

const empresasIniciales = [
  {
    id_empresa: 1,
    nombre: "Pacific Shipping",
    tipo: "Naviera",
    pais: "Panamá",
    activo: true,
    fecha_creacion: "12 ene. 2024",
  },
  {
    id_empresa: 2,
    nombre: "Ocean Logistics",
    tipo: "Operador portuario",
    pais: "Países Bajos",
    activo: true,
    fecha_creacion: "03 mar. 2024",
  },
  {
    id_empresa: 3,
    nombre: "Blue Harbor Line",
    tipo: "Naviera",
    pais: "Estados Unidos",
    activo: true,
    fecha_creacion: "18 may. 2024",
  },
  {
    id_empresa: 4,
    nombre: "Atlantic Marine",
    tipo: "Armador",
    pais: "Reino Unido",
    activo: false,
    fecha_creacion: "27 jul. 2024",
  },
  {
    id_empresa: 5,
    nombre: "Global Containers",
    tipo: "Operador logístico",
    pais: "Alemania",
    activo: true,
    fecha_creacion: "04 sep. 2024",
  },
  {
    id_empresa: 6,
    nombre: "Maritime Cargo",
    tipo: "Naviera",
    pais: "El Salvador",
    activo: true,
    fecha_creacion: "21 oct. 2024",
  },
];


const formularioInicial = {
  nombre: "",
  tipo: "",
  pais: "",
  activo: true,
};


function EmpresasPage() {
  const [
    empresas,
    setEmpresas,
  ] = useState(empresasIniciales);


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
  ] = useState(false);


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


  const tiposEmpresa = useMemo(() => {
    return [
      ...new Set(
        empresas.map(
          (empresa) => empresa.tipo
        )
      ),
    ].sort();
  }, [empresas]);


  const empresasFiltradas = useMemo(() => {
    const texto =
      busqueda
        .trim()
        .toLowerCase();


    return empresas.filter((empresa) => {
      const coincideBusqueda =
        !texto ||
        empresa.nombre
          .toLowerCase()
          .includes(texto) ||
        empresa.pais
          .toLowerCase()
          .includes(texto);


      const coincideTipo =
        !filtroTipo ||
        empresa.tipo ===
          filtroTipo;


      const coincideEstado =
        !filtroEstado ||
        String(empresa.activo) ===
          filtroEstado;


      return (
        coincideBusqueda &&
        coincideTipo &&
        coincideEstado
      );
    });
  }, [
    empresas,
    busqueda,
    filtroTipo,
    filtroEstado,
  ]);


  const totalActivas =
    empresas.filter(
      (empresa) => empresa.activo
    ).length;


  const totalInactivas =
    empresas.length -
    totalActivas;


  const totalNavieras =
    empresas.filter(
      (empresa) =>
        empresa.tipo === "Naviera"
    ).length;


  function limpiarFiltros() {
    setBusqueda("");
    setFiltroTipo("");
    setFiltroEstado("");
  }


  function actualizarEmpresas() {
    setCargando(true);


    setTimeout(() => {
      setEmpresas([
        ...empresasIniciales,
      ]);

      setCargando(false);
    }, 500);
  }


  function abrirNuevaEmpresa() {
    setEmpresaEditando(null);

    setFormulario(
      formularioInicial
    );

    setErrores({});

    setMensajeExito("");

    setPanelAbierto(true);
  }


  function abrirEditarEmpresa(
    empresa
  ) {
    setEmpresaEditando(
      empresa
    );


    setFormulario({
      nombre:
        empresa.nombre,

      tipo:
        empresa.tipo,

      pais:
        empresa.pais,

      activo:
        empresa.activo,
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

    setEmpresaEditando(null);

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
        "Ingrese el nombre de la empresa.";
    }


    if (!formulario.tipo) {
      nuevosErrores.tipo =
        "Seleccione un tipo de empresa.";
    }


    if (!formulario.pais.trim()) {
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


  function guardarEmpresa(
    evento
  ) {
    evento.preventDefault();


    if (!validarFormulario()) {
      return;
    }


    setGuardando(true);

    setMensajeExito("");


    setTimeout(() => {
      if (empresaEditando) {
        setEmpresas(
          (actuales) =>
            actuales.map(
              (empresa) =>
                empresa.id_empresa ===
                empresaEditando.id_empresa
                  ? {
                      ...empresa,

                      nombre:
                        formulario.nombre.trim(),

                      tipo:
                        formulario.tipo,

                      pais:
                        formulario.pais.trim(),

                      activo:
                        formulario.activo,
                    }
                  : empresa
            )
        );


        setMensajeExito(
          "La empresa fue actualizada correctamente."
        );
      } else {
        const nuevaEmpresa = {
          id_empresa:
            Date.now(),

          nombre:
            formulario.nombre.trim(),

          tipo:
            formulario.tipo,

          pais:
            formulario.pais.trim(),

          activo:
            formulario.activo,

          fecha_creacion:
            "Hoy",
        };


        setEmpresas(
          (actuales) => [
            nuevaEmpresa,
            ...actuales,
          ]
        );


        setMensajeExito(
          "La empresa fue registrada correctamente."
        );
      }


      setGuardando(false);


      setTimeout(() => {
        cerrarPanel();
      }, 650);
    }, 600);
  }


  function cambiarEstadoEmpresa(
    idEmpresa
  ) {
    setEmpresas(
      (actuales) =>
        actuales.map(
          (empresa) =>
            empresa.id_empresa ===
            idEmpresa
              ? {
                  ...empresa,

                  activo:
                    !empresa.activo,
                }
              : empresa
        )
    );
  }


  return (
    <section className="pagina-empresas">

      {/* ======================================
          FONDO
      ====================================== */}

      <div className="fondo-empresas" />


      {/* ======================================
          ENCABEZADO
      ====================================== */}

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

      </div>


      {/* ======================================
          RESUMEN
      ====================================== */}

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


      {/* ======================================
          LISTADO
      ====================================== */}

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
              actualizarEmpresas
            }
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


        {/* ======================================
            FILTROS
        ====================================== */}

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
            onClick={limpiarFiltros}
          >
            Limpiar
          </button>

        </div>


        {/* ======================================
            CARGANDO
        ====================================== */}

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


        {/* ======================================
            TABLA
        ====================================== */}

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

                            {empresa.pais}

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
                          {
                            empresa.fecha_creacion
                          }
                        </td>


                        <td>

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
                                cambiarEstadoEmpresa(
                                  empresa.id_empresa
                                )
                              }
                            >
                              <Power
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
          FONDO DEL PANEL
      ====================================== */}

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

          {/* ======================================
              PANEL LATERAL
          ====================================== */}

          <aside className="panel-formulario-empresa">

            <button
              type="button"
              className="cerrar-panel-empresa"
              onClick={cerrarPanel}
              disabled={guardando}
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
                    maxLength={100}
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
                      cambiarEstado(true)
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
                      cambiarEstado(false)
                    }
                  >
                    <i />

                    Inactiva
                  </button>

                </div>

              </div>


              {/* MENSAJE */}

              {mensajeExito && (
                <div className="mensaje-exito-empresa">
                  {mensajeExito}
                </div>
              )}


              {/* BOTONES */}

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
                      <Save
                        size={17}
                      />

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