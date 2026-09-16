import {
  Anchor,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  FileText,
  Info,
  Ship,
  X,
} from "lucide-react";


function ConfirmacionAsignacionModal({
  muelle,
  onClose,
  onConfirm,
}) {
  if (!muelle) {
    return null;
  }


  return (
    <div className="assignment-modal-backdrop">

      <div className="assignment-modal">

        {/* CERRAR */}

        <button
          type="button"
          className="assignment-modal-close"
          onClick={onClose}
        >
          <X size={23} />
        </button>


        {/* ENCABEZADO */}

        <div className="assignment-modal-heading">

          <div className="assignment-modal-success-icon">
            <CheckCircle2 size={30} />
          </div>


          <div>
            <span className="assignment-modal-brand">
              T A L A S S A
            </span>

            <h2>
              Confirmar asignación de muelle
            </h2>

            <p>
              Revisa la información de la
              asignación antes de continuar.
            </p>
          </div>

        </div>


        {/* DETALLES */}

        <div className="assignment-modal-section">

          <h3>
            Detalles de la asignación
          </h3>


          <div className="assignment-details-grid">

            <div className="assignment-detail-column">

              <div className="assignment-detail-item">

                <div className="assignment-detail-icon">
                  <FileText size={21} />
                </div>

                <div>
                  <span>Operación</span>
                  <strong>OP-052</strong>
                </div>

              </div>


              <div className="assignment-detail-item">

                <div className="assignment-detail-icon">
                  <Ship size={21} />
                </div>

                <div>
                  <span>Buque</span>
                  <strong>Ocean Star</strong>
                </div>

              </div>


              <div className="assignment-detail-item">

                <div className="assignment-detail-icon">
                  <Building2 size={21} />
                </div>

                <div>
                  <span>Empresa</span>
                  <strong>
                    Pacific Shipping
                  </strong>
                </div>

              </div>

            </div>


            <div className="assignment-detail-divider" />


            <div className="assignment-detail-column">

              <div className="assignment-detail-item">

                <div className="assignment-detail-icon">
                  <Anchor size={21} />
                </div>

                <div>
                  <span>
                    Muelle seleccionado
                  </span>

                  <strong>
                    {muelle.codigo}
                  </strong>

                  <small>
                    {muelle.nombre}
                  </small>
                </div>

              </div>


              <div className="assignment-detail-item">

                <div className="assignment-detail-icon">
                  <CalendarDays size={21} />
                </div>

                <div>
                  <span>
                    Período de asignación
                  </span>

                  <strong>
                    10/09/2026
                  </strong>

                  <small>
                    08:00 – 17:00
                  </small>
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* VALIDACIONES */}

        <div className="assignment-validations">

          <h3>
            Validaciones superadas
          </h3>


          <div className="assignment-validations-grid">

            <ValidationItem
              titulo="Disponibilidad confirmada"
              texto="El muelle se encuentra disponible en el período solicitado."
            />


            <ValidationItem
              titulo="Sin conflicto horario"
              texto="No se encontraron operaciones solapadas en el muelle."
            />


            <ValidationItem
              titulo="Compatibilidad física verificada"
              texto="El buque cumple con las restricciones de eslora, calado y tipo de carga."
            />


            <ValidationItem
              titulo="Estado operativo activo"
              texto="El muelle se encuentra operativo y sin incidencias."
            />

          </div>

        </div>


        {/* MENSAJE */}

        <div className="assignment-info-message">

          <div>
            <Info size={20} />
          </div>

          <p>
            Al confirmar, la operación
            actualizará su estado a{" "}
            <strong>Muelle asignado</strong>{" "}
            y la acción quedará registrada
            en auditoría.
          </p>

        </div>


        {/* BOTONES */}

        <div className="assignment-modal-actions">

          <button
            type="button"
            className="button button-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>


          <button
            type="button"
            className="button button-primary"
            onClick={onConfirm}
          >
            <Check size={19} />
            Confirmar asignación
          </button>

        </div>

      </div>

    </div>
  );
}


function ValidationItem({
  titulo,
  texto,
}) {
  return (
    <div className="assignment-validation-item">

      <div className="assignment-validation-check">
        <Check size={18} />
      </div>


      <div>
        <strong>
          {titulo}
        </strong>

        <p>
          {texto}
        </p>
      </div>

    </div>
  );
}


export default ConfirmacionAsignacionModal;