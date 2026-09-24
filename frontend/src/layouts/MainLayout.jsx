import {
  Navigate,
  Outlet,
} from "react-router-dom";

import Header from "../components/common/Header.jsx";
import Sidebar from "../components/common/Sidebar.jsx";

import {
  haySesionActiva,
} from "../services/auth.service.js";


function MainLayout() {
  /* ======================================
     PROTEGER RUTAS INTERNAS
  ====================================== */

  if (!haySesionActiva()) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  return (
    <div className="talassa-app">

      <div className="talassa-background" />

      <div className="talassa-shell">

        <Sidebar />

        <div className="talassa-main">

          <Header />

          <main className="page-content">

            <Outlet />

          </main>

        </div>

      </div>

    </div>
  );
}


export default MainLayout;