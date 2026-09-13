import { useState } from "react";
import {
  Building2,
  Edit3,
  MoreHorizontal,
  Plus,
  Search,
  X,
} from "lucide-react";

const empresasIniciales = [
  {
    id: 1,
    nombre: "Pacific Shipping",
    tipo: "Naviera",
    pais: "Panamá",
    estado: "Activa",
    fecha: "12 ene. 2024",
  },
  {
    id: 2,
    nombre: "Ocean Logistics",
    tipo: "Operador portuario",
    pais: "Países Bajos",
    estado: "Activa",
    fecha: "3 mar. 2024",
  },
  {
    id: 3,
    nombre: "Blue Harbor Line",
    tipo: "Naviera",
    pais: "Estados Unidos",
    estado: "Activa",
    fecha: "18 may. 2024",
  },
  {
    id: 4,
    nombre: "Atlantic Marine",
    tipo: "Armador",
    pais: "Reino Unido",
    estado: "Inactiva",
    fecha: "27 jul. 2024",
  },
  {
    id: 5,
    nombre: "Global Containers",
    tipo: "Operador logístico",
    pais: "Alemania",
    estado: "Activa",
    fecha: "4 sep. 2024",
  },
];

function EmpresasPage() {
  const [panelAbierto, setPanelAbierto] =
    useState(false);

  return (
    <section>
      <div className="page-heading">
        <div>
          <h1>Empresas</h1>
          <p>
            Administra las empresas relacionadas
            con los buques del sistema.
          </p>
        </div>

        <button
          className="button button-primary"
          onClick={() =>
            setPanelAbierto(true)
          }
        >
          <Plus size={20} />
          Nueva empresa
        </button>
      </div>

      <div
        className={`split-page ${
          panelAbierto
            ? "panel-open"
            : ""
        }`}
      >
        <div className="glass-card table-card">
          <div className="table-filters standalone-filters">
            <div className="search-control">
              <Search size={18} />
              <input placeholder="Buscar empresa..." />
            </div>

            <select>
              <option>
                Todos los estados
              </option>
              <option>Activa</option>
              <option>Inactiva</option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="talassa-table">
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
                {empresasIniciales.map(
                  (empresa) => (
                    <tr key={empresa.id}>
                      <td>
                        <div className="company-cell">
                          <div className="company-icon">
                            <Building2
                              size={18}
                            />
                          </div>

                          <strong>
                            {empresa.nombre}
                          </strong>
                        </div>
                      </td>

                      <td>{empresa.tipo}</td>
                      <td>{empresa.pais}</td>

                      <td>
                        <span
                          className={`status-pill ${
                            empresa.estado ===
                            "Activa"
                              ? "status-active"
                              : "status-inactive"
                          }`}
                        >
                          <span />
                          {empresa.estado}
                        </span>
                      </td>

                      <td>{empresa.fecha}</td>

                      <td>
                        <div className="action-buttons">
                          <button>
                            <Edit3 size={17} />
                          </button>

                          <button>
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
              Mostrando 1–5 de 18 empresas
            </span>

            <div className="pagination">
              <button className="active">
                1
              </button>
              <button>2</button>
              <button>3</button>
            </div>
          </div>
        </div>

        {panelAbierto && (
          <aside className="side-form-panel">
            <button
              className="side-panel-close"
              onClick={() =>
                setPanelAbierto(false)
              }
            >
              <X size={20} />
            </button>

            <div className="side-form-heading">
              <div className="form-section-icon">
                <Building2 />
              </div>

              <div>
                <h2>Nueva empresa</h2>
                <p>
                  Registra una empresa para
                  asociarla con los buques del
                  sistema.
                </p>
              </div>
            </div>

            <label>
              Nombre *
              <input placeholder="Ej. Pacific Shipping" />
            </label>

            <label>
              Tipo *
              <select>
                <option>
                  Selecciona un tipo
                </option>
                <option>Naviera</option>
                <option>Armador</option>
                <option>
                  Operador portuario
                </option>
                <option>
                  Operador logístico
                </option>
              </select>
            </label>

            <label>
              País *
              <input placeholder="Ej. Panamá" />
            </label>

            <label>
              Estado *
              <select>
                <option>Activa</option>
                <option>Inactiva</option>
              </select>
            </label>

            <div className="side-form-actions">
              <button
                className="button button-secondary"
                onClick={() =>
                  setPanelAbierto(false)
                }
              >
                Cancelar
              </button>

              <button className="button button-primary">
                Guardar
              </button>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}

export default EmpresasPage;