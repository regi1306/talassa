import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import "../../styles/confirmDeleteModal.css";


function ConfirmDeleteModal({
  abierto,
  titulo = "Confirmar eliminación",
  mensaje,
  nombre,
  onCancelar,
  onConfirmar,
}) {
  const [
    eliminando,
    setEliminando,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {
    if (abierto) {
      setError("");
    }
  }, [abierto]);


  if (!abierto) {
    return null;
  }


  async function manejarConfirmacion() {
    try {
      setEliminando(true);
      setError("");

      await onConfirmar();

    } catch (error) {
      setError(
        error.response?.data?.mensaje ||
        error.message ||
        "No fue posible eliminar el registro."
      );

    } finally {
      setEliminando(false);
    }
  }


  function cerrarModal() {
    if (eliminando) {
      return;
    }

    setError("");
    onCancelar();
  }


  return (
    <div
      className="delete-modal-overlay"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          cerrarModal();
        }
      }}
    >

      <div
        className="delete-modal"
        role="dialog"
        aria-modal="true"
      >

        {/* CERRAR */}

        <button
          type="button"
          className="delete-modal-close"
          onClick={cerrarModal}
          disabled={eliminando}
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>


        {/* ICONO */}

        <div className="delete-modal-icon">

          <AlertTriangle size={31} />

        </div>


        {/* TEXTO */}

        <h2>
          {titulo}
        </h2>


        <p>
          {mensaje}
        </p>


        {nombre && (

          <div className="delete-modal-record">

            {nombre}

          </div>

        )}


        <span className="delete-modal-warning">

          Esta acción no se puede deshacer.

        </span>


        {/* ERROR */}

        {error && (

          <div className="delete-modal-error">

            {error}

          </div>

        )}


        {/* BOTONES */}

        <div className="delete-modal-actions">

          <button
            type="button"
            className="delete-modal-cancel"
            onClick={cerrarModal}
            disabled={eliminando}
          >
            Cancelar
          </button>


          <button
            type="button"
            className="delete-modal-confirm"
            onClick={manejarConfirmacion}
            disabled={eliminando}
          >

            <Trash2 size={17} />

            {
              eliminando
                ? "Eliminando..."
                : "Sí, eliminar"
            }

          </button>

        </div>

      </div>

    </div>
  );
}


export default ConfirmDeleteModal;