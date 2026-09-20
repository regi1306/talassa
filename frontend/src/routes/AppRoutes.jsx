import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";

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

import ContenedoresPage from "../pages/contenedores/ContenedoresPage.jsx";
import FormularioContenedorPage from "../pages/contenedores/FormularioContenedorPage.jsx";
import DetalleContenedorPage from "../pages/contenedores/DetalleContenedorPage.jsx";

import PerfilPage from "../pages/perfil/PerfilPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Pantallas sin sidebar/header */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Pantallas internas del sistema */}
      <Route element={<MainLayout />}>

      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/buques" element={<BuquesPage />} />
      <Route path="/buques/nuevo" element={<FormularioBuquePage />} />
      <Route path="/buques/:id" element={<DetalleBuquePage />} />
      <Route path="/buques/:id/editar" element={<FormularioBuquePage />} />
      <Route path="/operaciones" element={<OperacionesPage />} />
      <Route path="/operaciones/nueva" element={<FormularioOperacionPage />} />
      <Route path="/operaciones/:id/editar" element={<FormularioOperacionPage />} />
      <Route path="/operaciones/:id" element={<DetalleOperacionPage />} />
      <Route path="/contenedores" element={<ContenedoresPage />} />
      <Route path="/contenedores/nuevo" element={<FormularioContenedorPage />} />
      <Route path="/contenedores/:id/editar" element={<FormularioContenedorPage />} />
      <Route path="/contenedores/:id" element={<DetalleContenedorPage />} />
      
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/usuarios/nuevo" element={<UsuarioFormPage />} />
        <Route path="/usuarios/:id/editar" element={<UsuarioFormPage />} />
        <Route path="/perfil" element={<PerfilPage />}/>

        <Route path="/roles" element={<RolesPermisosPage />} />

        <Route path="/empresas" element={<EmpresasPage />} />
        <Route path="/catalogos" element={<CatalogosPage />} />

        <Route path="/auditoria" element={<AuditoriaPage />} />
        <Route
          path="/auditoria/:id"
          element={<AuditoriaDetallePage />}
        />
      </Route>

      {/* Ruta inicial */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Cualquier ruta inexistente */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;