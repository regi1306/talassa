import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Layers3,
  MapPin,
  Settings,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AuditoriaDetallePage() {
  const navigate = useNavigate();

  return (
    <section>
      <button
        className="back-link"
        onClick={() =>
          navigate("/auditoria")
        }
      >
        <ArrowLeft size={18} />
        Bitácora de auditoría
      </button>

      <div className="page-heading">
        <div>
          <h1>
            Detalle de auditoría
          </h1>

          <p>
            Información completa de la acción
            registrada.
          </p>
        </div>

        <button
          className="button button-secondary"
          onClick={() =>
            navigate("/auditoria")
          }
        >
          <ArrowLeft size={18} />
          Volver
        </button>
      </div>

      <div className="audit-detail-grid">
        <article className="glass-card audit-information">
          <h2>
            <FileText size={22} />
            Información general
          </h2>

          <div className="audit-info-grid">
            <div className="audit-info-item">
              <div className="audit-info-icon icon-green">
                <Settings size={21} />
              </div>

              <div>
                <span>Acción</span>
                <strong>
                  Cambio de asignación
                </strong>
                <small>
                  Se modificó la asignación de
                  muelle de una operación.
                </small>
              </div>
            </div>

            <div className="audit-info-item">
              <div className="audit-info-icon">
                <UserRound size={21} />
              </div>

              <div>
                <span>Usuario</span>
                <strong>
                  Carlos Romero
                </strong>
                <small>
                  carlos.romero@talassa.com
                </small>
              </div>
            </div>

            <div className="audit-info-item">
              <div className="audit-info-icon">
                <CalendarDays size={21} />
              </div>

              <div>
                <span>
                  Fecha y hora
                </span>
                <strong>
                  14 abr. 2024, 08:17:32
                </strong>
                <small>
                  Hace 3 horas
                </small>
              </div>
            </div>

            <div className="audit-info-item">
              <div className="audit-info-icon icon-purple">
                <Layers3 size={21} />
              </div>

              <div>
                <span>
                  Módulo / Entidad
                </span>
                <strong>
                  Operaciones
                </strong>
                <small>
                  Operación portuaria
                </small>
              </div>
            </div>

            <div className="audit-info-item">
              <div className="audit-info-icon">
                <FileText size={21} />
              </div>

              <div>
                <span>
                  Registro afectado
                </span>
                <strong>OP-052</strong>
                <small>
                  ID de operación
                </small>
              </div>
            </div>

            <div className="audit-info-item">
              <div className="audit-info-icon icon-red">
                <MapPin size={21} />
              </div>

              <div>
                <span>IP / Origen</span>
                <strong>
                  192.168.10.25
                </strong>
                <small>
                  Panel web
                </small>
              </div>
            </div>
          </div>
        </article>

        <article className="glass-card audit-comparison">
          <h2>
            Comparación de valores
          </h2>

          <div className="comparison-grid">
            <div className="comparison-card comparison-before">
              <h3>Antes</h3>
              <p>
                Valores previos al cambio
              </p>

              <div className="comparison-field">
                <span>Muelle</span>
                <strong>
                  Sin asignar
                </strong>
              </div>

              <div className="comparison-field">
                <span>Estado</span>
                <strong>
                  Programada
                </strong>
              </div>
            </div>

            <div className="comparison-arrow">
              →
            </div>

            <div className="comparison-card comparison-after">
              <h3>Después</h3>
              <p>Nuevos valores</p>

              <div className="comparison-field">
                <span>Muelle</span>
                <strong>M-03</strong>
              </div>

              <div className="comparison-field">
                <span>Estado</span>
                <strong>
                  Muelle asignado
                </strong>
              </div>
            </div>
          </div>
        </article>

        <article className="glass-card event-description">
          <h2>
            <FileText size={21} />
            Descripción del evento
          </h2>

          <p>
            El usuario{" "}
            <strong>
              Carlos Romero
            </strong>{" "}
            asignó el muelle{" "}
            <strong>M-03</strong> a la
            operación{" "}
            <strong>OP-052</strong>,
            cambiando su estado de{" "}
            <strong>Programada</strong> a{" "}
            <strong>
              Muelle asignado
            </strong>
            .
          </p>
        </article>
      </div>
    </section>
  );
}

export default AuditoriaDetallePage;