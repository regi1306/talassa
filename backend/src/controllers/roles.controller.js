import {
  actualizarPermisosDeRol,
  obtenerPermisosDeRol,
  obtenerRoles,
  obtenerTodosLosPermisos,
} from "../services/roles.service.js";


function responderError(
  res,
  error
) {
  console.error(
    "Error en roles:",
    error
  );


  return res.status(
    error.status || 500
  ).json({
    ok: false,

    message:
      error.status
        ? error.message
        : "Ocurrió un error interno en el servidor.",
  });
}


/* ======================================
   LISTAR ROLES
====================================== */

export async function listar(
  req,
  res
) {
  try {
    const roles =
      await obtenerRoles();


    return res.json({
      ok: true,
      data: roles,
    });


  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* ======================================
   LISTAR TODOS LOS PERMISOS
====================================== */

export async function listarTodosLosPermisos(
  req,
  res
) {
  try {
    const permisos =
      await obtenerTodosLosPermisos();


    return res.json({
      ok: true,
      data: permisos,
    });


  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* ======================================
   PERMISOS DEL ROL
====================================== */

export async function permisosDelRol(
  req,
  res
) {
  try {
    const permisos =
      await obtenerPermisosDeRol(
        Number(
          req.params.id
        )
      );


    return res.json({
      ok: true,
      data: permisos,
    });


  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* ======================================
   ACTUALIZAR PERMISOS
====================================== */

export async function actualizarPermisos(
  req,
  res
) {
  try {
    const permisos =
      await actualizarPermisosDeRol(
        Number(
          req.params.id
        ),
        req.body?.permisos,
        req.usuario?.id_usuario
      );


    return res.json({
      ok: true,

      message:
        "Los permisos del rol se actualizaron correctamente.",

      data:
        permisos,
    });


  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}