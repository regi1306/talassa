import {
  cambiarEstadoEnCatalogo,
  editarEnCatalogo,
  obtenerCatalogo,
  obtenerTodosLosCatalogos,
  registrarEnCatalogo,
} from "../services/catalogos.service.js";


function responderError(
  res,
  error
) {
  console.error(
    "Error en catálogos:",
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
   LISTAR TODOS
====================================== */

export async function listarTodos(
  req,
  res
) {
  try {
    const catalogos =
      await obtenerTodosLosCatalogos();


    return res.json({
      ok: true,
      data: catalogos,
    });


  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}


/* ======================================
   LISTAR UNO
====================================== */

export async function listarUno(
  req,
  res
) {
  try {
    const registros =
      await obtenerCatalogo(
        req.params.catalogo
      );


    return res.json({
      ok: true,
      data: registros,
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
    const registro =
      await registrarEnCatalogo(
        req.params.catalogo,
        req.body ?? {},
        req.usuario?.id_usuario
      );


    return res.status(201).json({
      ok: true,

      message:
        "El registro fue creado correctamente.",

      data:
        registro,
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
    const registro =
      await editarEnCatalogo(
        req.params.catalogo,
        req.params.id,
        req.body ?? {},
        req.usuario?.id_usuario
      );


    return res.json({
      ok: true,

      message:
        "El registro fue actualizado correctamente.",

      data:
        registro,
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
    const registro =
      await cambiarEstadoEnCatalogo(
        req.params.catalogo,
        req.params.id,
        req.body?.activo,
        req.usuario?.id_usuario
      );


    return res.json({
      ok: true,

      message:
        registro.activo
          ? "El registro fue reactivado correctamente."
          : "El registro fue desactivado correctamente.",

      data:
        registro,
    });


  } catch (error) {
    return responderError(
      res,
      error
    );
  }
}