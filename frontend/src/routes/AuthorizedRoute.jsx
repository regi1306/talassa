import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  obtenerUsuarioGuardado,
} from "../services/auth.service.js";


function AuthorizedRoute({
  permiso,
}) {
  const usuario =
    obtenerUsuarioGuardado();


  const permisos =
    usuario?.permisos || [];


  /* ======================================
     SIN USUARIO
  ====================================== */

  if (!usuario) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  /* ======================================
     SIN PERMISO
  ====================================== */

  if (
    permiso &&
    !permisos.includes(
      permiso
    )
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  /* ======================================
     AUTORIZADO
  ====================================== */

  return <Outlet />;
}


export default AuthorizedRoute;