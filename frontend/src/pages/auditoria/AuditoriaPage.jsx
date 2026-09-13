import {
  CalendarDays,
  Eye,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const registros = [
  {
    id: 1,
    fecha: "14 abr. 2024",
    hora: "09:24",
    usuario: "Regina Cadenas",
    accion: "Creación",
    modulo: "Usuarios",
    registro: "USR-028",
    resumen:
      "Nuevo usuario registrado en el sistema.",
  },
  {
    id: 2,
    fecha: "14 abr. 2024",
    hora: "08:17",
    usuario: "Carlos Romero",
    accion: "Asignación",
    modulo: "Muelles",
    registro: "OP-052",
    resumen:
      "Asignación del muelle M-03 a la operación OP-052.",
  },
  {
    id: 3,
    fecha: "14 abr. 2024",
    hora: "07:46",
    usuario: "María López",
    accion: "Creación",
    modulo: "Inspecciones",
    registro: "INS-001",
    resumen:
      "Inspección INS-001 registrada.",
  },
  {
    id: 4,
    fecha: "13 abr. 2024",
    hora: "18:32",
    usuario: "María López",
    accion: "Reporte",
    modulo: "Incidencias",
    registro: "INC-01",
    resumen:
      "Incidencia INC-01 reportada.",
  },
  {
    id: 5,
    fecha: "13 abr. 2024",
    hora: "16:11",
    usuario: "Regina Cadenas",
    accion: "Actualización",
    modulo: "Empresas",
    registro: "EMP-014",
    resumen:
      "Datos de empresa actualizados.",
  },
];

function AuditoriaPage() {
  const navigate = useNavigate();

  return (
    <section>
      <div className="page-heading">
        <div>
          <h1>
            Bitácora de auditoría
          </h1>

          <p>
            Consulta la trazabilidad de acciones
            relevantes dentro del sistema.
          </p>
        </div>
      </div>

      <div className="glass-card audit-card">
        <div className="audit-filters">
          <div className="search-control">
            <Search size={18} />

            <input placeholder="Buscar en la bitácora..." />
          </div>

          <select>
            <option>
              Todos los usuarios
            </option>
          </select>

          <select>
            <option>
              Todos los módulos
            </option>
            <option>Usuarios</option>
            <option>Operaciones</option>
            <option>Muelles</option>
            <option>Inspecciones</option>
            <option>Incidencias</option>
          </select>

          <select>
            <option>
              Todas las acciones
            </option>
          </select>

          <button className="date-filter">
            <CalendarDays size={17} />
            Seleccionar fecha
          </button>
        </div>

        <div className="table-responsive">
          <table className="talassa-table audit-table">
            <thead>
              <tr>
                <th>Fecha y hora</th>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Módulo</th>
                <th>
                  Registro afectado
                </th>
                <th>Resumen</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {registros.map((registro) => (
                <tr key={registro.id}>
                  <td>
                    {registro.fecha}
                    <br />
                    <small>
                      {registro.hora}
                    </small>
                  </td>

                  <td>
                    <div className="user-cell">
                      <div className="mini-avatar">
                        {registro.usuario
                          .split(" ")
                          .map((item) =>
                            item.charAt(0)
                          )
                          .slice(0, 2)
                          .join("")}
                      </div>

                      <strong>
                        {registro.usuario}
                      </strong>
                    </div>
                  </td>

                  <td>
                    <span className="audit-action-pill">
                      {registro.accion}
                    </span>
                  </td>

                  <td>{registro.modulo}</td>

                  <td>
                    {registro.registro}
                  </td>

                  <td>{registro.resumen}</td>

                  <td>
                    <button
                      className="detail-button"
                      onClick={() =>
                        navigate(
                          `/auditoria/${registro.id}`
                        )
                      }
                    >
                      <Eye size={16} />
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>
            Mostrando 1–5 de 142 registros
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

export default AuditoriaPage;