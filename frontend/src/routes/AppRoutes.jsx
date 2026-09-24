import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout
  from "../layouts/MainLayout.jsx";

import AuthLayout
  from "../layouts/AuthLayout.jsx";

import ProtectedRoute
  from "./ProtectedRoute.jsx";

import AuthorizedRoute
  from "./AuthorizedRoute.jsx";


/* ======================================
   AUTENTICACIÓN
====================================== */

import LoginPage
  from "../pages/auth/LoginPage.jsx";


/* ======================================
   PERFIL
====================================== */

import PerfilPage
  from "../pages/perfil/PerfilPage.jsx";


/* ======================================
   REGINA - ADMINISTRACIÓN
====================================== */

import UsuariosPage
  from "../pages/usuarios/UsuariosPage.jsx";

import UsuarioFormPage
  from "../pages/usuarios/UsuarioFormPage.jsx";

import RolesPermisosPage
  from "../pages/roles/RolesPermisosPage.jsx";

import EmpresasPage
  from "../pages/empresas/EmpresasPage.jsx";

import CatalogosPage
  from "../pages/catalogos/CatalogosPage.jsx";

import AuditoriaPage
  from "../pages/auditoria/AuditoriaPage.jsx";

import AuditoriaDetallePage
  from "../pages/auditoria/AuditoriaDetallePage.jsx";


/* ======================================
   ALEXANDRA - DASHBOARD / BUQUES
   / OPERACIONES / CONTENEDORES
====================================== */

import DashboardPage
  from "../pages/dashboard/DashboardPage.jsx";

import BuquesPage
  from "../pages/buques/BuquesPage.jsx";

import FormularioBuquePage
  from "../pages/buques/FormularioBuquePage.jsx";

import DetalleBuquePage
  from "../pages/buques/DetalleBuquePage.jsx";

import OperacionesPage
  from "../pages/operaciones/OperacionesPage.jsx";

import FormularioOperacionPage
  from "../pages/operaciones/FormularioOperacionPage.jsx";

import DetalleOperacionPage
  from "../pages/operaciones/DetalleOperacionPage.jsx";

import ContenedoresPage
  from "../pages/contenedores/ContenedoresPage.jsx";

import FormularioContenedorPage
  from "../pages/contenedores/FormularioContenedorPage.jsx";

import DetalleContenedorPage
  from "../pages/contenedores/DetalleContenedorPage.jsx";


/* ======================================
   STEPHANIEE - MUELLES
====================================== */

import MuellesPage
  from "../pages/muelles/MuellesPage.jsx";

import MuelleFormPage
  from "../pages/muelles/MuelleFormPage.jsx";


/* ======================================
   STEPHANIEE - ASIGNACIÓN DE MUELLES
====================================== */

import EvaluacionMuellesPage
  from "../pages/asignaciones/EvaluacionMuellesPage.jsx";


/* ======================================
   STEPHANIEE - INSPECCIONES
====================================== */

import InspeccionesPage
  from "../pages/inspecciones/InspeccionesPage.jsx";

import InspeccionFormPage
  from "../pages/inspecciones/InspeccionFormPage.jsx";


/* ======================================
   STEPHANIEE - INCIDENCIAS
====================================== */

import IncidenciasPage
  from "../pages/incidencias/IncidenciasPage.jsx";

import IncidenciaDetallePage
  from "../pages/incidencias/IncidenciaDetallePage.jsx";


function AppRoutes() {
  return (
    <Routes>

      {/* ======================================
          PANTALLAS PÚBLICAS
      ====================================== */}

      <Route element={<AuthLayout />}>

        <Route
          path="/login"
          element={<LoginPage />}
        />

      </Route>


      {/* ======================================
          USUARIO AUTENTICADO
      ====================================== */}

      <Route element={<ProtectedRoute />}>

        <Route element={<MainLayout />}>


          {/* ==================================
              DASHBOARD
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="DASH_VER"
              />
            }
          >

            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

          </Route>


          {/* ==================================
              PERFIL

              Todo usuario autenticado puede
              consultar su propio perfil.
          ================================== */}

          <Route
            path="/perfil"
            element={<PerfilPage />}
          />


          {/* ==================================
              BUQUES - CONSULTA
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="BUQ_VER"
              />
            }
          >

            <Route
              path="/buques"
              element={<BuquesPage />}
            />

            <Route
              path="/buques/:id"
              element={<DetalleBuquePage />}
            />

          </Route>


          {/* ==================================
              BUQUES - GESTIÓN
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="BUQ_GESTIONAR"
              />
            }
          >

            <Route
              path="/buques/nuevo"
              element={
                <FormularioBuquePage />
              }
            />

            <Route
              path="/buques/:id/editar"
              element={
                <FormularioBuquePage />
              }
            />

          </Route>


          {/* ==================================
              OPERACIONES - CONSULTA
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="OPE_VER"
              />
            }
          >

            <Route
              path="/operaciones"
              element={
                <OperacionesPage />
              }
            />

            <Route
              path="/operaciones/:id"
              element={
                <DetalleOperacionPage />
              }
            />

          </Route>


          {/* ==================================
              OPERACIONES - GESTIÓN
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="OPE_GESTIONAR"
              />
            }
          >

            <Route
              path="/operaciones/nueva"
              element={
                <FormularioOperacionPage />
              }
            />

            <Route
              path="/operaciones/:id/editar"
              element={
                <FormularioOperacionPage />
              }
            />

          </Route>


          {/* ==================================
              CONTENEDORES - CONSULTA
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="CONT_VER"
              />
            }
          >

            <Route
              path="/contenedores"
              element={
                <ContenedoresPage />
              }
            />

            <Route
              path="/contenedores/:id"
              element={
                <DetalleContenedorPage />
              }
            />

          </Route>


          {/* ==================================
              CONTENEDORES - GESTIÓN
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="CONT_GESTIONAR"
              />
            }
          >

            <Route
              path="/contenedores/nuevo"
              element={
                <FormularioContenedorPage />
              }
            />

            <Route
              path="/contenedores/:id/editar"
              element={
                <FormularioContenedorPage />
              }
            />

          </Route>


          {/* ==================================
              USUARIOS - CONSULTA
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="USR_VER"
              />
            }
          >

            <Route
              path="/usuarios"
              element={<UsuariosPage />}
            />

          </Route>


          {/* ==================================
              USUARIOS - CREAR
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="USR_CREAR"
              />
            }
          >

            <Route
              path="/usuarios/nuevo"
              element={
                <UsuarioFormPage />
              }
            />

          </Route>


          {/* ==================================
              USUARIOS - EDITAR
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="USR_EDITAR"
              />
            }
          >

            <Route
              path="/usuarios/:id/editar"
              element={
                <UsuarioFormPage />
              }
            />

          </Route>


          {/* ==================================
              ROLES Y PERMISOS
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="ROL_GESTIONAR"
              />
            }
          >

            <Route
              path="/roles"
              element={
                <RolesPermisosPage />
              }
            />

          </Route>


          {/* ==================================
              EMPRESAS
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="EMP_VER"
              />
            }
          >

            <Route
              path="/empresas"
              element={<EmpresasPage />}
            />

          </Route>


          {/* ==================================
              CATÁLOGOS
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="CAT_VER"
              />
            }
          >

            <Route
              path="/catalogos"
              element={
                <CatalogosPage />
              }
            />

          </Route>


          {/* ==================================
              AUDITORÍA
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="AUD_VER"
              />
            }
          >

            <Route
              path="/auditoria"
              element={
                <AuditoriaPage />
              }
            />

            <Route
              path="/auditoria/:id"
              element={
                <AuditoriaDetallePage />
              }
            />

          </Route>


          {/* ==================================
              MUELLES - CONSULTA
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="MUE_VER"
              />
            }
          >

            <Route
              path="/muelles"
              element={<MuellesPage />}
            />

            <Route
              path="/muelles/:id/ver"
              element={<MuelleFormPage />}
            />

          </Route>


          {/* ==================================
              MUELLES - GESTIÓN
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="MUE_GESTIONAR"
              />
            }
          >

            <Route
              path="/muelles/nuevo"
              element={<MuelleFormPage />}
            />

            <Route
              path="/muelles/:id/editar"
              element={<MuelleFormPage />}
            />

            <Route
              path="/operaciones/:id/asignar-muelle"
              element={
                <EvaluacionMuellesPage />
              }
            />

          </Route>


          {/* ==================================
              INSPECCIONES - CONSULTA
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="INS_VER"
              />
            }
          >

            <Route
              path="/inspecciones"
              element={<InspeccionesPage />}
            />

          </Route>


          {/* ==================================
              INSPECCIONES - GESTIÓN
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="INS_GESTIONAR"
              />
            }
          >

            <Route
              path="/inspecciones/nueva"
              element={
                <InspeccionFormPage />
              }
            />

            <Route
              path="/inspecciones/:id/editar"
              element={
                <InspeccionFormPage />
              }
            />

          </Route>


          {/* ==================================
              INCIDENCIAS - CONSULTA
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="INC_VER"
              />
            }
          >

            <Route
              path="/incidencias"
              element={
                <IncidenciasPage />
              }
            />

            <Route
              path="/incidencias/:id"
              element={
                <IncidenciaDetallePage />
              }
            />

          </Route>


          {/* ==================================
              INCIDENCIAS - GESTIÓN
          ================================== */}

          <Route
            element={
              <AuthorizedRoute
                permiso="INC_GESTIONAR"
              />
            }
          >

            <Route
              path="/incidencias/nueva"
              element={
                <IncidenciaDetallePage />
              }
            />

            <Route
              path="/incidencias/:id/editar"
              element={
                <IncidenciaDetallePage />
              }
            />

          </Route>


        </Route>

      </Route>


      {/* ======================================
          RUTA INICIAL
      ====================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      {/* ======================================
          RUTA INEXISTENTE
      ====================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}


export default AppRoutes;