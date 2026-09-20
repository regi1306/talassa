import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfirmacionAsignacionModal
  from "../../components/asignaciones/ConfirmacionAsignacionModal.jsx";

import {
    Anchor,
    ArrowLeft,
    ArrowRight,
    Building2,
    CalendarDays,
    Check,
    CheckCircle2,
    Clock3,
    Container,
    FileText,
    Ruler,
    Search,
    Ship,
    TriangleAlert,
    Wrench,
} from "lucide-react";


const muellesCandidatos = [
    {
        id: 3,
        codigo: "M-03",
        nombre: "Muelle Central",
        longitudMaxima: 320,
        caladoMaximo: 14,
        estadoOperativo: "Operativo",
        resultado: "Disponible / Compatible",
        tipoResultado: "compatible",
        motivo:
            "Cumple longitud y calado. Sin conflicto horario. Estado operativo activo.",
        seleccionable: true,
    },
    {
        id: 1,
        codigo: "M-01",
        nombre: "Muelle Norte",
        longitudMaxima: 280,
        caladoMaximo: 12,
        estadoOperativo: "Operativo",
        resultado: "Conflicto de horario",
        tipoResultado: "conflicto",
        motivo:
            "Ocupado por Pacific Queen entre 09:00 y 13:00.",
        seleccionable: false,
    },
    {
        id: 2,
        codigo: "M-02",
        nombre: "Muelle Este",
        longitudMaxima: 220,
        caladoMaximo: 9,
        estadoOperativo: "Operativo",
        resultado: "Restricción física",
        tipoResultado: "restriccion",
        motivo:
            "Longitud y calado insuficientes para Ocean Star.",
        seleccionable: false,
    },
    {
        id: 4,
        codigo: "M-04",
        nombre: "Muelle Sur",
        longitudMaxima: 300,
        caladoMaximo: 13,
        estadoOperativo: "Mantenimiento",
        resultado: "Mantenimiento",
        tipoResultado: "mantenimiento",
        motivo:
            "Muelle en mantenimiento preventivo hasta las 18:00.",
        seleccionable: false,
    },
];


function EvaluacionMuellesPage() {
    const navigate = useNavigate();

    const [busqueda, setBusqueda] = useState("");
    const [filtroResultado, setFiltroResultado] =
        useState("Todos");

    const [muelleSeleccionado, setMuelleSeleccionado] =
        useState(null);

    const [
        modalConfirmacionAbierto,
        setModalConfirmacionAbierto,
    ] = useState(false);


    const candidatosFiltrados = useMemo(() => {
        return muellesCandidatos.filter((muelle) => {
            const texto = busqueda.toLowerCase();

            const coincideBusqueda =
                muelle.codigo.toLowerCase().includes(texto) ||
                muelle.nombre.toLowerCase().includes(texto) ||
                muelle.resultado.toLowerCase().includes(texto);

            const coincideFiltro =
                filtroResultado === "Todos" ||
                muelle.tipoResultado === filtroResultado;

            return coincideBusqueda && coincideFiltro;
        });
    }, [busqueda, filtroResultado]);


    const seleccionarMuelle = (muelle) => {
        if (!muelle.seleccionable) {
            return;
        }

        setMuelleSeleccionado(muelle);
    };


    return (
        <section className="evaluacion-muelles-page">

            {/* ===============================
          ENCABEZADO SUPERIOR
      =============================== */}

            <div className="evaluacion-top">

                <div>
                    <button
                        type="button"
                        className="back-link"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={18} />
                        Volver a operación
                    </button>


                    <div className="page-heading evaluacion-heading">
                        <div>
                            <h1>
                                Evaluación de muelles candidatos
                            </h1>

                            <p>
                                Valida disponibilidad, compatibilidad
                                física y conflictos antes de asignar
                                el muelle.
                            </p>
                        </div>
                    </div>
                </div>


                {/* PROGRESO */}

                <div className="assignment-progress">

                    <div className="assignment-step completed">
                        <div className="assignment-step-circle">
                            <Check size={17} />
                        </div>

                        <span>
                            Detalles
                            <br />
                            operación
                        </span>
                    </div>


                    <div className="assignment-progress-line active" />


                    <div className="assignment-step current">
                        <div className="assignment-step-circle">
                            <span />
                        </div>

                        <strong>
                            Evaluación
                            <br />
                            de muelles
                        </strong>
                    </div>


                    <div className="assignment-progress-line" />


                    <div className="assignment-step">
                        <div className="assignment-step-circle" />

                        <span>Confirmación</span>
                    </div>


                    <div className="assignment-progress-line" />


                    <div className="assignment-step">
                        <div className="assignment-step-circle" />

                        <span>
                            Asociar
                            <br />
                            recursos
                        </span>
                    </div>

                </div>

            </div>


            {/* ===============================
          RESUMEN DE OPERACIÓN
      =============================== */}

            <div className="glass-card operation-summary-card">

                <h2>
                    Resumen de la operación
                </h2>


                <div className="operation-summary-grid">

                    <div className="operation-summary-item">
                        <FileText size={26} />

                        <div>
                            <span>Operación</span>
                            <strong>OP-052</strong>
                        </div>
                    </div>


                    <div className="operation-summary-item">
                        <Ship size={27} />

                        <div>
                            <span>Buque</span>
                            <strong>Ocean Star</strong>
                        </div>
                    </div>


                    <div className="operation-summary-item">
                        <Building2 size={25} />

                        <div>
                            <span>Empresa</span>
                            <strong>Pacific Shipping</strong>
                        </div>
                    </div>


                    <div className="operation-summary-item">
                        <CalendarDays size={25} />

                        <div>
                            <span>Ventana horaria</span>
                            <strong>10/09/2026</strong>
                            <small>08:00 – 17:00</small>
                        </div>
                    </div>


                    <div className="operation-summary-item">
                        <Ruler size={25} />

                        <div>
                            <span>Eslora del buque</span>
                            <strong>300 m</strong>
                        </div>
                    </div>


                    <div className="operation-summary-item">
                        <Anchor size={25} />

                        <div>
                            <span>Calado requerido</span>
                            <strong>13 m</strong>
                        </div>
                    </div>


                    <div className="operation-summary-item">
                        <Container size={25} />

                        <div>
                            <span>Tipo de carga</span>
                            <strong>Contenedores</strong>
                        </div>
                    </div>

                </div>
            </div>


            {/* ===============================
          MUELLES CANDIDATOS
      =============================== */}

            <div className="glass-card candidate-card">

                {/* TOOLBAR */}

                <div className="candidate-toolbar">

                    <h2>
                        Muelles candidatos
                        <span>
                            ({candidatosFiltrados.length})
                        </span>
                    </h2>


                    <div className="candidate-filters">

                        <div className="search-control">
                            <Search size={18} />

                            <input
                                type="text"
                                placeholder="Buscar muelle..."
                                value={busqueda}
                                onChange={(event) =>
                                    setBusqueda(event.target.value)
                                }
                            />
                        </div>


                        <select
                            value={filtroResultado}
                            onChange={(event) =>
                                setFiltroResultado(
                                    event.target.value
                                )
                            }
                        >
                            <option value="Todos">
                                Todos los resultados
                            </option>

                            <option value="compatible">
                                Compatible
                            </option>

                            <option value="conflicto">
                                Conflicto de horario
                            </option>

                            <option value="restriccion">
                                Restricción física
                            </option>

                            <option value="mantenimiento">
                                Mantenimiento
                            </option>
                        </select>

                    </div>

                </div>


                {/* LISTADO */}

                <div className="candidate-list">

                    {candidatosFiltrados.map((muelle) => {

                        const seleccionado =
                            muelleSeleccionado?.id === muelle.id;


                        return (
                            <article
                                key={muelle.id}
                                className={`
                  candidate-row
                  candidate-${muelle.tipoResultado}
                  ${seleccionado ? "selected" : ""}
                `}
                            >

                                {/* IDENTIDAD */}

                                <div className="candidate-main">

                                    <div className="candidate-image">
                                        <Anchor size={26} />
                                    </div>


                                    <div className="candidate-title">
                                        <strong>
                                            {muelle.codigo}
                                        </strong>

                                        <span>
                                            {muelle.nombre}
                                        </span>
                                    </div>

                                </div>


                                {/* ESPECIFICACIONES */}

                                <div className="candidate-spec">

                                    <span>
                                        Longitud máxima
                                    </span>

                                    <strong>
                                        {muelle.longitudMaxima} m
                                    </strong>

                                </div>


                                <div className="candidate-spec">

                                    <span>
                                        Calado máximo
                                    </span>

                                    <strong>
                                        {muelle.caladoMaximo} m
                                    </strong>

                                </div>


                                <div className="candidate-spec">

                                    <span>
                                        Estado operativo
                                    </span>

                                    <strong
                                        className={
                                            muelle.estadoOperativo ===
                                                "Operativo"
                                                ? "operational-state"
                                                : "maintenance-state"
                                        }
                                    >
                                        <i />

                                        {muelle.estadoOperativo}
                                    </strong>

                                </div>


                                {/* RESULTADO */}

                                <div className="candidate-result">

                                    <div className="candidate-result-icon">

                                        {muelle.tipoResultado ===
                                            "compatible" && (
                                                <CheckCircle2 size={26} />
                                            )}


                                        {muelle.tipoResultado ===
                                            "conflicto" && (
                                                <Clock3 size={26} />
                                            )}


                                        {muelle.tipoResultado ===
                                            "restriccion" && (
                                                <TriangleAlert size={27} />
                                            )}


                                        {muelle.tipoResultado ===
                                            "mantenimiento" && (
                                                <Wrench size={26} />
                                            )}

                                    </div>


                                    <div>
                                        <strong>
                                            {muelle.resultado}
                                        </strong>

                                        <p>
                                            {muelle.motivo}
                                        </p>
                                    </div>

                                </div>


                                {/* ACCIÓN */}

                                <div className="candidate-action">

                                    {muelle.seleccionable ? (
                                        <button
                                            type="button"
                                            className={
                                                seleccionado
                                                    ? "candidate-selected-button"
                                                    : "candidate-select-button"
                                            }
                                            onClick={() =>
                                                seleccionarMuelle(muelle)
                                            }
                                        >
                                            {seleccionado ? (
                                                <>
                                                    <Check size={18} />
                                                    Seleccionado
                                                </>
                                            ) : (
                                                <>
                                                    Seleccionar
                                                    <ArrowRight size={18} />
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="candidate-disabled-button"
                                            disabled
                                        >
                                            No disponible
                                        </button>
                                    )}

                                </div>

                            </article>
                        );
                    })}


                    {candidatosFiltrados.length === 0 && (
                        <div className="candidate-empty">
                            No se encontraron muelles que
                            coincidan con los filtros.
                        </div>
                    )}

                </div>


                {/* ===============================
            PIE
        =============================== */}

                <div className="evaluation-footer">

                    <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={18} />
                        Volver a operación
                    </button>


                    <div className="evaluation-next">
                        <button
                            type="button"
                            className="button evaluation-next-button"
                            disabled={!muelleSeleccionado}
                            onClick={() =>
                                setModalConfirmacionAbierto(true)
                            }
                        >
                            Continuar con muelle seleccionado

                            <ArrowRight size={18} />
                        </button>

                        {!muelleSeleccionado && (
                            <small>
                                Selecciona un muelle disponible
                                para continuar.
                            </small>
                        )}


                        {muelleSeleccionado && (
                            <small className="candidate-success-text">
                                {muelleSeleccionado.codigo} seleccionado:
                                listo para confirmar la asignación.
                            </small>
                        )}

                    </div>

                </div>

            </div>

            {modalConfirmacionAbierto &&
                muelleSeleccionado && (
                    <ConfirmacionAsignacionModal
                        muelle={muelleSeleccionado}
                        onClose={() =>
                            setModalConfirmacionAbierto(false)
                        }
                        onConfirm={() => {
                            console.log(
                                "Asignación confirmada:",
                                muelleSeleccionado
                            );

                            setModalConfirmacionAbierto(false);
                        }}
                    />
                )}

        </section>

    );
}


export default EvaluacionMuellesPage;