import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit3,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

const usuariosIniciales = [
  {
    id: 1,
    nombre: "Regina Cadenas",
    correo: "regina.cadenas@talassa.com",
    rol: "Administrador",
    estado: "Activo",
    ultimoAcceso: "Hoy, 09:24",
  },
  {
    id: 2,
    nombre: "Carlos Romero",
    correo: "carlos.romero@talassa.com",
    rol: "Operador portuario",
    estado: "Activo",
    ultimoAcceso: "Hoy, 08:17",
  },
  {
    id: 3,
    nombre: "María López",
    correo: "maria.lopez@talassa.com",
    rol: "Inspector",
    estado: "Activo",
    ultimoAcceso: "Ayer, 17:36",
  },
  {
    id: 4,
    nombre: "José Martínez",
    correo: "jose.martinez@talassa.com",
    rol: "Operador portuario",
    estado: "Inactivo",
    ultimoAcceso: "Hace 5 días",
  },
  {
    id: 5,
    nombre: "Sofía Torres",
    correo: "sofia.torres@talassa.com",
    rol: "Inspector",
    estado: "Activo",
    ultimoAcceso: "Hoy, 11:03",
  },
  {
    id: 6,
    nombre: "Andrés Ruiz",
    correo: "andres.ruiz@talassa.com",
    rol: "Operador portuario",
    estado: "Inactivo",
    ultimoAcceso: "Hace 12 días",
  },
];

function UsuariosPage() {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [rol, setRol] = useState("");
  const [estado, setEstado] = useState("");

  const usuariosFiltrados = useMemo(() => {
    return usuariosIniciales.filter((usuario) => {
      const coincideBusqueda =
        usuario.nombre
          .toLowerCase()
          .includes(busqueda.toLowerCase()) ||
        usuario.correo
          .toLowerCase()
          .includes(busqueda.toLowerCase());

      const coincideRol =
        !rol || usuario.rol === rol;

      const coincideEstado =
        !estado || usuario.estado === estado;

      return (
        coincideBusqueda &&
        coincideRol &&
        coincideEstado
      );
    });
  }, [busqueda, rol, estado]);

  return (
    <section>
      <div className="page-heading">
        <div>
          <h1>Usuarios</h1>
          <p>
            Administra cuentas y accesos del
            sistema.
          </p>
        </div>

        <div className="page-heading-actions">
          <button
            className="button button-primary"
            onClick={() =>
              navigate("/usuarios/nuevo")
            }
          >
            <Plus size={20} />
            Nuevo usuario
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/roles")}
          >
            <Settings size={20} />
            Roles y permisos
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon stat-blue">
            <Users size={24} />
          </div>

          <div>
            <span>Total de usuarios</span>
            <strong>24</strong>
            <small>+3% respecto al mes anterior</small>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon stat-green">
            <UserRound size={24} />
          </div>

          <div>
            <span>Usuarios activos</span>
            <strong>20</strong>
            <small>83% del total</small>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon stat-red">
            <UserRound size={24} />
          </div>

          <div>
            <span>Usuarios inactivos</span>
            <strong>4</strong>
            <small>17% del total</small>
          </div>
        </article>
      </div>

      <div className="glass-card table-card">
        <div className="table-toolbar">
          <h2>
            <Users size={22} />
            Listado de usuarios
          </h2>

          <div className="table-filters">
            <div className="search-control">
              <Search size={18} />

              <input
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(event.target.value)
                }
                placeholder="Buscar usuario..."
              />
            </div>

            <select
              value={rol}
              onChange={(event) =>
                setRol(event.target.value)
              }
            >
              <option value="">
                Todos los roles
              </option>
              <option>Administrador</option>
              <option>
                Operador portuario
              </option>
              <option>Inspector</option>
            </select>

            <select
              value={estado}
              onChange={(event) =>
                setEstado(event.target.value)
              }
            >
              <option value="">
                Todos los estados
              </option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="talassa-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario / Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Último acceso</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuariosFiltrados.map(
                (usuario) => (
                  <tr key={usuario.id}>
                    <td>
                      <div className="user-cell">
                        <div className="mini-avatar">
                          {usuario.nombre
                            .split(" ")
                            .map((palabra) =>
                              palabra.charAt(0)
                            )
                            .slice(0, 2)
                            .join("")}
                        </div>

                        <strong>
                          {usuario.nombre}
                        </strong>
                      </div>
                    </td>

                    <td>{usuario.correo}</td>

                    <td>
                      <span className="role-pill">
                        {usuario.rol}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-pill ${
                          usuario.estado ===
                          "Activo"
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        <span />
                        {usuario.estado}
                      </span>
                    </td>

                    <td>
                      {usuario.ultimoAcceso}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button type="button">
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/usuarios/${usuario.id}/editar`
                            )
                          }
                        >
                          <Edit3 size={17} />
                        </button>

                        <button type="button">
                          <MoreHorizontal
                            size={17}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>
            Mostrando 1–
            {usuariosFiltrados.length} de 24
            usuarios
          </span>

          <div className="pagination">
            <button className="active">
              1
            </button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UsuariosPage;