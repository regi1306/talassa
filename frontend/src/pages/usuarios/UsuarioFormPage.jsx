import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Save,
  UserRound,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

function UsuarioFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const editando = Boolean(id);

  const [mostrarPassword, setMostrarPassword] =
    useState(false);

  const [formulario, setFormulario] =
    useState({
      nombre: editando ? "Carlos" : "",
      apellido: editando ? "Romero" : "",
      correo: editando
        ? "carlos.romero@talassa.com"
        : "",
      usuario: editando
        ? "carlos.romero"
        : "",
      password: "",
      rol: editando
        ? "Operador portuario"
        : "",
      estado: "Activo",
    });

  const actualizar = (campo, valor) => {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  const guardar = (event) => {
    event.preventDefault();

    console.log(formulario);

    navigate("/usuarios");
  };

  return (
    <section>
      <button
        className="back-link"
        onClick={() => navigate("/usuarios")}
      >
        <ArrowLeft size={18} />
        Volver al listado
      </button>

      <div className="page-heading">
        <div>
          <h1>
            {editando
              ? "Editar usuario"
              : "Nuevo usuario"}
          </h1>

          <p>
            {editando
              ? "Actualiza la información de la cuenta seleccionada."
              : "Registra una nueva cuenta y asigna su rol en el sistema."}
          </p>
        </div>
      </div>

      <form
        className="glass-card user-form-card"
        onSubmit={guardar}
      >
        <div className="form-section-heading">
          <div className="form-section-icon">
            <UserRound />
          </div>

          <div>
            <h2>Información personal</h2>
            <p>
              Ingresa los datos básicos del
              usuario.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <label>
            Nombre *
            <input
              value={formulario.nombre}
              onChange={(e) =>
                actualizar(
                  "nombre",
                  e.target.value
                )
              }
              placeholder="Ej. Laura"
            />
          </label>

          <label>
            Apellido *
            <input
              value={formulario.apellido}
              onChange={(e) =>
                actualizar(
                  "apellido",
                  e.target.value
                )
              }
              placeholder="Ej. Torres"
            />
          </label>

          <label className="form-full">
            Correo *
            <div className="input-with-icon">
              <input
                type="email"
                value={formulario.correo}
                onChange={(e) =>
                  actualizar(
                    "correo",
                    e.target.value
                  )
                }
                placeholder="usuario@talassa.com"
              />

              {formulario.correo && (
                <Check
                  size={19}
                  className="success-icon"
                />
              )}
            </div>
          </label>
        </div>

        <div className="form-divider" />

        <div className="form-section-heading">
          <div className="form-section-icon">
            <LockKeyhole />
          </div>

          <div>
            <h2>Datos de acceso</h2>
            <p>
              Define las credenciales y el nivel
              de acceso del usuario.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <label>
            Usuario *
            <input
              value={formulario.usuario}
              onChange={(e) =>
                actualizar(
                  "usuario",
                  e.target.value
                )
              }
              placeholder="Ej. laura.torres"
            />
            <small>
              Se utilizará para iniciar sesión.
            </small>
          </label>

          <label>
            Contraseña {editando ? "" : "*"}
            <div className="input-with-icon">
              <input
                type={
                  mostrarPassword
                    ? "text"
                    : "password"
                }
                value={formulario.password}
                onChange={(e) =>
                  actualizar(
                    "password",
                    e.target.value
                  )
                }
                placeholder={
                  editando
                    ? "Dejar vacío para conservar"
                    : "Mínimo 8 caracteres"
                }
              />

              <button
                type="button"
                onClick={() =>
                  setMostrarPassword(
                    (value) => !value
                  )
                }
              >
                {mostrarPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </label>

          <label>
            Rol *
            <select
              value={formulario.rol}
              onChange={(e) =>
                actualizar(
                  "rol",
                  e.target.value
                )
              }
            >
              <option value="">
                Selecciona un rol
              </option>
              <option>
                Administrador
              </option>
              <option>
                Operador portuario
              </option>
              <option>
                Inspector
              </option>
            </select>
          </label>

          <div>
            <span className="field-label">
              Estado *
            </span>

            <div className="state-selector">
              <button
                type="button"
                className={
                  formulario.estado ===
                  "Activo"
                    ? "selected active-state"
                    : ""
                }
                onClick={() =>
                  actualizar(
                    "estado",
                    "Activo"
                  )
                }
              >
                <span />
                Activo
              </button>

              <button
                type="button"
                className={
                  formulario.estado ===
                  "Inactivo"
                    ? "selected inactive-state"
                    : ""
                }
                onClick={() =>
                  actualizar(
                    "estado",
                    "Inactivo"
                  )
                }
              >
                <span />
                Inactivo
              </button>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="button button-secondary"
            onClick={() =>
              navigate("/usuarios")
            }
          >
            Cancelar
          </button>

          <button
            className="button button-primary"
          >
            <Save size={18} />

            {editando
              ? "Guardar cambios"
              : "Guardar usuario"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default UsuarioFormPage;