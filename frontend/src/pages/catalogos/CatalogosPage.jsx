import { useState } from "react";
import {
  Box,
  ClipboardList,
  Edit3,
  Eye,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Ship,
  TriangleAlert,
  X,
} from "lucide-react";

const catalogos = [
  {
    clave: "buques",
    nombre: "Tipos de buque",
    icono: Ship,
  },
  {
    clave: "carga",
    nombre: "Tipos de carga",
    icono: Box,
  },
  {
    clave: "contenedor",
    nombre: "Tipos de contenedor",
    icono: Package,
  },
  {
    clave: "inspeccion",
    nombre: "Tipos de inspección",
    icono: ClipboardList,
  },
  {
    clave: "incidencia",
    nombre: "Tipos de incidencia",
    icono: TriangleAlert,
  },
];

const tiposBuque = [
  {
    id: 1,
    nombre: "Portacontenedores",
    descripcion:
      "Buque diseñado para el transporte de contenedores.",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Granelero",
    descripcion:
      "Buque destinado al transporte de graneles sólidos.",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Tanquero",
    descripcion:
      "Buque destinado al transporte de líquidos a granel.",
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "Ro-Ro",
    descripcion:
      "Buque de carga rodada para vehículos y maquinaria.",
    estado: "Activo",
  },
  {
    id: 5,
    nombre: "Carga general",
    descripcion:
      "Buque multipropósito para carga general.",
    estado: "Activo",
  },
];

function CatalogosPage() {
  const [catalogoActivo, setCatalogoActivo] =
    useState("buques");

  const [panelAbierto, setPanelAbierto] =
    useState(false);

  const catalogoSeleccionado =
    catalogos.find(
      (catalogo) =>
        catalogo.clave === catalogoActivo
    );

  return (
    <section>
      <div className="page-heading">
        <div>
          <h1>Catálogos</h1>
          <p>
            Gestiona la información reutilizable
            por los demás módulos.
          </p>
        </div>
      </div>

      <div className="catalog-tabs glass-card">
        {catalogos.map((catalogo) => {
          const Icon = catalogo.icono;

          return (
            <button
              key={catalogo.clave}
              className={
                catalogoActivo ===
                catalogo.clave
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCatalogoActivo(
                  catalogo.clave
                )
              }
            >
              <Icon size={21} />
              {catalogo.nombre}
            </button>
          );
        })}
      </div>

      <div
        className={`split-page ${
          panelAbierto
            ? "panel-open"
            : ""
        }`}
      >
        <div className="glass-card table-card">
          <div className="table-toolbar">
            <div className="search-control">
              <Search size={18} />

              <input
                placeholder={`Buscar ${catalogoSeleccionado.nombre.toLowerCase()}...`}
              />
            </div>

            <button
              className="button button-primary"
              onClick={() =>
                setPanelAbierto(true)
              }
            >
              <Plus size={19} />
              Nuevo tipo
            </button>
          </div>

          <div className="table-responsive">
            <table className="talassa-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>
                    Última actualización
                  </th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {tiposBuque.map((tipo) => (
                  <tr key={tipo.id}>
                    <td>
                      <div className="company-cell">
                        <div className="company-icon">
                          <Ship size={18} />
                        </div>

                        <strong>
                          {tipo.nombre}
                        </strong>
                      </div>
                    </td>

                    <td>
                      {tipo.descripcion}
                    </td>

                    <td>
                      <span className="status-pill status-active">
                        <span />
                        {tipo.estado}
                      </span>
                    </td>

                    <td>
                      Hoy, 10:24
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button>
                          <Eye size={17} />
                        </button>

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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {panelAbierto && (
          <aside className="side-form-panel compact-panel">
            <button
              className="side-panel-close"
              onClick={() =>
                setPanelAbierto(false)
              }
            >
              <X size={20} />
            </button>

            <h2>
              Nuevo{" "}
              {catalogoSeleccionado.nombre
                .replace("Tipos de ", "tipo de ")
                .replace("Tipos ", "tipo ")}
            </h2>

            <label>
              Nombre *
              <input placeholder="Nombre del tipo" />
            </label>

            <label>
              Descripción
              <textarea
                rows="5"
                placeholder="Describe las características..."
              />
            </label>

            <label>
              Estado
              <select>
                <option>Activo</option>
                <option>Inactivo</option>
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

export default CatalogosPage;