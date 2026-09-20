import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout
  from "../layouts/MainLayout.jsx";

import AuthLayout
  from "../layouts/AuthLayout.jsx";

import LoginPage
  from "../pages/auth/LoginPage.jsx";


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
   PERFIL
====================================== */

import PerfilPage
  from "../pages/perfil/PerfilPage.jsx";


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

// Se activará después de comprobar que
// el archivo existe y está integrado.

// import EvaluacionMuellesPage
//   from "../pages/asignaciones/EvaluacionMuellesPage.jsx";


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

      {/* =====================================
          PANTALLAS SIN SIDEBAR / HEADER
      ===================================== */}

      <Route element={<AuthLayout />}>

        <Route
          path="/login"
          element={<LoginPage />}
        />

      </Route>


      {/* =====================================
          PANTALLAS INTERNAS DEL SISTEMA
      ===================================== */}

      <Route element={<MainLayout />}>


        {/* =====================================
            DASHBOARD
        ===================================== */}

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />


        {/* =====================================
            ALEXANDRA - BUQUES
        ===================================== */}

        <Route
          path="/buques"
          element={<BuquesPage />}
        />

        <Route
          path="/buques/nuevo"
          element={<FormularioBuquePage />}
        />

        <Route
          path="/buques/:id/editar"
          element={<FormularioBuquePage />}
        />

        <Route
          path="/buques/:id"
          element={<DetalleBuquePage />}
        />


        {/* =====================================
            ALEXANDRA - OPERACIONES
        ===================================== */}

        <Route
          path="/operaciones"
          element={<OperacionesPage />}
        />

        <Route
          path="/operaciones/nueva"
          element={<FormularioOperacionPage />}
        />

        <Route
          path="/operaciones/:id/editar"
          element={<FormularioOperacionPage />}
        />


        {/* =====================================
            STEPHANIEE - ASIGNACIÓN DE MUELLES

            Pendiente de comprobar su archivo
            antes de habilitarla.
        ===================================== */}

        {/*
        <Route
          path="/operaciones/:id/asignar-muelle"
          element={<EvaluacionMuellesPage />}
        />
        */}


        <Route
          path="/operaciones/:id"
          element={<DetalleOperacionPage />}
        />


        {/* =====================================
            ALEXANDRA - CONTENEDORES
        ===================================== */}

        <Route
          path="/contenedores"
          element={<ContenedoresPage />}
        />

        <Route
          path="/contenedores/nuevo"
          element={<FormularioContenedorPage />}
        />

        <Route
          path="/contenedores/:id/editar"
          element={<FormularioContenedorPage />}
        />

        <Route
          path="/contenedores/:id"
          element={<DetalleContenedorPage />}
        />


        {/* =====================================
            PERFIL
        ===================================== */}

        <Route
          path="/perfil"
          element={<PerfilPage />}
        />


        {/* =====================================
            REGINA - ADMINISTRACIÓN
        ===================================== */}

        <Route
          path="/usuarios"
          element={<UsuariosPage />}
        />

        <Route
          path="/usuarios/nuevo"
          element={<UsuarioFormPage />}
        />

        <Route
          path="/usuarios/:id/editar"
          element={<UsuarioFormPage />}
        />

        <Route
          path="/roles"
          element={<RolesPermisosPage />}
        />

        <Route
          path="/empresas"
          element={<EmpresasPage />}
        />

        <Route
          path="/catalogos"
          element={<CatalogosPage />}
        />

        <Route
          path="/auditoria"
          element={<AuditoriaPage />}
        />

        <Route
          path="/auditoria/:id"
          element={<AuditoriaDetallePage />}
        />


        {/* =====================================
            STEPHANIEE - MUELLES
        ===================================== */}

        <Route
          path="/muelles"
          element={<MuellesPage />}
        />

        <Route
          path="/muelles/nuevo"
          element={<MuelleFormPage />}
        />

        <Route
          path="/muelles/:id/editar"
          element={<MuelleFormPage />}
        />

        <Route
          path="/muelles/:id/ver"
          element={<MuelleFormPage />}
        />


        {/* =====================================
            STEPHANIEE - INSPECCIONES
        ===================================== */}

        <Route
          path="/inspecciones"
          element={<InspeccionesPage />}
        />

        <Route
          path="/inspecciones/nueva"
          element={<InspeccionFormPage />}
        />

        <Route
          path="/inspecciones/:id/editar"
          element={<InspeccionFormPage />}
        />


        {/* =====================================
            STEPHANIEE - INCIDENCIAS
        ===================================== */}

        <Route
          path="/incidencias"
          element={<IncidenciasPage />}
        />

        <Route
          path="/incidencias/nueva"
          element={<IncidenciaDetallePage />}
        />

        <Route
          path="/incidencias/:id/editar"
          element={<IncidenciaDetallePage />}
        />

        <Route
          path="/incidencias/:id"
          element={<IncidenciaDetallePage />}
        />

      </Route>


      {/* =====================================
          RUTA INICIAL
      ===================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      {/* =====================================
          RUTA INEXISTENTE
      ===================================== */}

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