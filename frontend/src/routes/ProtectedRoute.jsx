import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  actualizarUsuarioGuardado,
  cerrarSesion,
  obtenerPerfil,
  obtenerToken,
} from "../services/auth.service.js";


function ProtectedRoute() {
  const [
    estado,
    setEstado,
  ] = useState(
    "verificando"
  );


  useEffect(() => {
    let activo = true;


    async function verificarSesion() {
      const token =
        obtenerToken();


      /* ======================================
         SIN TOKEN
      ====================================== */

      if (!token) {
        if (activo) {
          setEstado(
            "no-autenticado"
          );
        }

        return;
      }


      try {

        /* ======================================
           VALIDAR TOKEN Y OBTENER INFORMACIÓN
           ACTUAL DEL USUARIO
        ====================================== */

        const respuesta =
          await obtenerPerfil();


        if (
          !respuesta?.ok ||
          !respuesta?.data
        ) {
          throw new Error(
            "No fue posible validar la sesión."
          );
        }


        /* ======================================
           SINCRONIZAR USUARIO Y PERMISOS
        ====================================== */

        actualizarUsuarioGuardado(
          respuesta.data
        );


        if (activo) {
          setEstado(
            "autenticado"
          );
        }

      } catch (error) {
        console.error(
          "Sesión inválida:",
          error
        );


        cerrarSesion();


        if (activo) {
          setEstado(
            "no-autenticado"
          );
        }
      }
    }


    verificarSesion();


    return () => {
      activo = false;
    };

  }, []);


  /* ======================================
     VERIFICANDO
  ====================================== */

  if (
    estado ===
    "verificando"
  ) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily:
            "DM Sans, sans-serif",
          color: "#082d69",
          background: "#dcebf6",
        }}
      >
        Verificando sesión...
      </div>
    );
  }


  /* ======================================
     SIN SESIÓN
  ====================================== */

  if (
    estado ===
    "no-autenticado"
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  /* ======================================
     SESIÓN VÁLIDA
  ====================================== */

  return <Outlet />;
}


export default ProtectedRoute;