import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  obtenerUsuarioGuardado,
  tienePermiso,
} from "../services/auth.service.js";


function AuthorizedRoute({
  permiso,
}) {
  const usuario =
    obtenerUsuarioGuardado();


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
    !tienePermiso(
      permiso
    )
  ) {
    return (
      <Navigate
        to="/perfil"
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