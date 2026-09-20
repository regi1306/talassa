import {
  actualizarEstadoEmpresa,
  editarEmpresa,
  obtenerEmpresas,
  registrarEmpresa,
} from "../services/empresas.service.js";


function responderError(
  res,
  error
) {
  console.error(
    "Error en empresas:",
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
   LISTAR
====================================== */

export async function listar(
  req,
  res
) {
  try {
    const empresas =
      await obtenerEmpresas();


    return res.json({
      ok: true,
      data: empresas,
    });


  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* ======================================
   CREAR
====================================== */

export async function crear(
  req,
  res
) {
  try {
    const empresa =
      await registrarEmpresa(
        req.body ?? {},
        req.usuario?.id_usuario
      );


    return res.status(201).json({
      ok: true,

      message:
        "La empresa fue registrada correctamente.",

      data:
        empresa,
    });


  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* ======================================
   ACTUALIZAR
====================================== */

export async function actualizar(
  req,
  res
) {
  try {
    const empresa =
      await editarEmpresa(
        req.params.id,
        req.body ?? {},
        req.usuario?.id_usuario
      );


    return res.json({
      ok: true,

      message:
        "La empresa fue actualizada correctamente.",

      data:
        empresa,
    });


  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* ======================================
   CAMBIAR ESTADO
====================================== */

export async function cambiarEstado(
  req,
  res
) {
  try {
    const empresa =
      await actualizarEstadoEmpresa(
        req.params.id,
        req.body?.activo,
        req.usuario?.id_usuario
      );


    return res.json({
      ok: true,

      message:
        empresa.activo
          ? "La empresa fue reactivada correctamente."
          : "La empresa fue desactivada correctamente.",

      data:
        empresa,
    });


  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}