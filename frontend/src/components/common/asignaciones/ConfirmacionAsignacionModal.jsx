import {
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Ship,
  X,
  Anchor,
} from "lucide-react";

import "../../../styles/confirmacionAsignacionModal.css";

function ConfirmacionAsignacionModal({
  abierto,
  operacion,
  muelle,
  validaciones = [],
  confirmando = false,
  error = "",
  onCerrar,
  onConfirmar,
}) {
  if (
    !abierto ||
    !muelle ||
    !operacion
  ) {
    return null;
  }


  return (
    <div
      className="assignment-modal-overlay"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget &&
          !confirmando
        ) {
          onCerrar();
        }
      }}
    >

      <div
        className="assignment-modal"
        role="dialog"
        aria-modal="true"
      >


        {/* ==================================
            CERRAR
        ================================== */}

        <button
          type="button"
          className="assignment-modal-close"
          onClick={onCerrar}
          disabled={confirmando}
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>


        {/* ==================================
            ENCABEZADO
        ================================== */}

        <div className="assignment-modal-header">

          <div className="assignment-modal-check">

            <CheckCircle2 size={34} />

          </div>


          <div className="assignment-modal-header-text">

            <span className="assignment-brand">
              T A L A S S A
            </span>

            <h2>
              Confirmar asignación de muelle
            </h2>

            <p>
              Revisa la información de la asignación antes de continuar.
            </p>

          </div>

        </div>


        {/* ==================================
            DETALLES
        ================================== */}

        <section className="assignment-detail-card">

          <h3>
            Detalles de la asignación
          </h3>


          <div className="assignment-detail-grid">


            {/* IZQUIERDA */}

            <div className="assignment-detail-column">


              <div className="assignment-detail-item">

                <div className="assignment-detail-icon">
                  <ClipboardCheck size={23} />
                </div>

                <div>

                  <span>
                    Operación
                  </span>

                  <strong>
                    {
                      operacion.codigo ||
                      "-"
                    }
                  </strong>

                </div>

              </div>


              <div className="assignment-detail-item">

                <div className="assignment-detail-icon">
                  <Ship size={24} />
                </div>

                <div>

                  <span>
                    Buque
                  </span>

                  <strong>
                    {
                      operacion.buque ||
                      "Sin información"
                    }
                  </strong>

                </div>

              </div>


              <div className="assignment-detail-item">

                <div className="assignment-detail-icon">
                  <Building2 size={23} />
                </div>

                <div>

                  <span>
                    Empresa
                  </span>

                  <strong>
                    {
                      operacion.empresa ||
                      "Sin información"
                    }
                  </strong>

                </div>

              </div>

            </div>


            {/* DERECHA */}

            <div className="assignment-detail-column assignment-detail-column-right">


              <div className="assignment-detail-item">

                <div className="assignment-detail-icon">
                  <Anchor size={24} />
                </div>

                <div>

                  <span>
                    Muelle seleccionado
                  </span>

                  <strong>
                    {
                      muelle.codigo ||
                      "-"
                    }
                  </strong>

                  <small>
                    {
                      muelle.nombre ||
                      ""
                    }
                  </small>

                </div>

              </div>


              <div className="assignment-detail-item">

                <div className="assignment-detail-icon">
                  <CalendarDays size={23} />
                </div>

                <div>

                  <span>
                    Período de asignación
                  </span>

                  <strong>
                    {
                      operacion.fecha ||
                      "-"
                    }
                  </strong>

                  <small>
                    {
                      operacion.horaInicio ||
                      "--:--"
                    }

                    {" — "}

                    {
                      operacion.horaFin ||
                      "--:--"
                    }
                  </small>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================
            VALIDACIONES
        ================================== */}

        <section className="assignment-validation-card">

          <div className="assignment-validation-title">

            <span />

            <h3>
              Validaciones superadas
            </h3>

          </div>


          <div className="assignment-validation-grid">

            {validaciones.map(
              (
                validacion,
                indice
              ) => (

                <div
                  className="assignment-validation-item"
                  key={`${validacion.titulo}-${indice}`}
                >

                  <div className="assignment-validation-check">

                    <Check size={20} />

                  </div>


                  <div>

                    <strong>
                      {
                        validacion.titulo
                      }
                    </strong>

                    <p>
                      {
                        validacion.descripcion
                      }
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        </section>


        {/* ==================================
            INFORMACIÓN
        ================================== */}

        <div className="assignment-info-box">

          <div className="assignment-info-icon">
            i
          </div>


          <p>
            Al confirmar, la operación actualizará su estado a{" "}
            <strong>
              Muelle asignado
            </strong>{" "}
            y la acción quedará registrada en auditoría.
          </p>

        </div>


        {/* ==================================
            ERROR DEL BACKEND
        ================================== */}

        {error && (

          <div className="assignment-modal-error">

            {error}

          </div>

        )}


        {/* ==================================
            ACCIONES
        ================================== */}

        <div className="assignment-modal-actions">

          <button
            type="button"
            className="assignment-button-cancel"
            onClick={onCerrar}
            disabled={confirmando}
          >
            Cancelar
          </button>


          <button
            type="button"
            className="assignment-button-confirm"
            onClick={onConfirmar}
            disabled={confirmando}
          >

            <Check size={22} />

            {
              confirmando
                ? "Confirmando..."
                : "Confirmar asignación"
            }

          </button>

        </div>

      </div>

    </div>
  );
}


export default ConfirmacionAsignacionModal;