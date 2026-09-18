import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import AuthorizedRoute from "./AuthorizedRoute.jsx";

import LoginPage from "../pages/auth/LoginPage.jsx";

import UsuariosPage from "../pages/usuarios/UsuariosPage.jsx";
import UsuarioFormPage from "../pages/usuarios/UsuarioFormPage.jsx";

import RolesPermisosPage from "../pages/roles/RolesPermisosPage.jsx";

import EmpresasPage from "../pages/empresas/EmpresasPage.jsx";

import CatalogosPage from "../pages/catalogos/CatalogosPage.jsx";

import AuditoriaPage from "../pages/auditoria/AuditoriaPage.jsx";
import AuditoriaDetallePage from "../pages/auditoria/AuditoriaDetallePage.jsx";

import DashboardPage from "../pages/dashboard/DashboardPage.jsx";

import BuquesPage from "../pages/buques/BuquesPage.jsx";
import FormularioBuquePage from "../pages/buques/FormularioBuquePage.jsx";
import DetalleBuquePage from "../pages/buques/DetalleBuquePage.jsx";

import OperacionesPage from "../pages/operaciones/OperacionesPage.jsx";
import FormularioOperacionPage from "../pages/operaciones/FormularioOperacionPage.jsx";
import DetalleOperacionPage from "../pages/operaciones/DetalleOperacionPage.jsx";

import PerfilPage from "../pages/perfil/PerfilPage.jsx";


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

              Todo usuario autenticado
              puede consultar su perfil.
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


          {/*
            Las futuras rutas de Muelles,
            Contenedores, Inspecciones e
            Incidencias también se colocarán
            aquí con sus permisos respectivos.
          */}

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