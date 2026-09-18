import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  cerrarSesion,
  obtenerPerfil,
  obtenerToken,
} from "../services/auth.service.js";


function ProtectedRoute() {
  const [
    estado,
    setEstado,
  ] = useState("verificando");


  useEffect(() => {
    let activo = true;


    async function verificarSesion() {
      const token =
        obtenerToken();


      /*
        Si no existe ningún token,
        significa que el usuario
        no ha iniciado sesión.
      */

      if (!token) {
        if (activo) {
          setEstado(
            "no-autenticado"
          );
        }

        return;
      }


      try {
        /*
          No basta solamente con que exista
          un token en el navegador.

          Consultamos /api/auth/me para
          comprobar que el backend lo acepta.
        */

        await obtenerPerfil();


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


        /*
          Si el JWT expiró, fue modificado
          o ya no es válido, eliminamos
          la sesión almacenada.
        */

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
    estado === "verificando"
  ) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "DM Sans, sans-serif",
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
    estado === "no-autenticado"
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