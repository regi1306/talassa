import pool
  from "../config/db.js";


/* ======================================
   VERIFICAR PERMISO
====================================== */

export function verificarPermiso(
  codigoPermiso
) {

  return async function (
    req,
    res,
    next
  ) {

    try {

      const idUsuario =
        Number(
          req.usuario?.id_usuario
        );


      if (
        !Number.isInteger(idUsuario) ||
        idUsuario <= 0
      ) {

        return res
          .status(401)
          .json({
            ok: false,

            message:
              "No fue posible identificar al usuario autenticado.",
          });
      }


      const consulta = `
        SELECT EXISTS (

          SELECT 1

          FROM usuarios u

          INNER JOIN roles r
            ON r.id_rol =
               u.id_rol

          INNER JOIN rol_permiso rp
            ON rp.id_rol =
               r.id_rol

          INNER JOIN permisos p
            ON p.id_permiso =
               rp.id_permiso

          WHERE
            u.id_usuario = $1

            AND u.activo = TRUE

            AND r.activo = TRUE

            AND p.codigo = $2

        ) AS autorizado;
      `;


      const resultado =
        await pool.query(
          consulta,
          [
            idUsuario,
            codigoPermiso,
          ]
        );


      const autorizado =
        resultado.rows[0]
          ?.autorizado === true;


      if (!autorizado) {

        return res
          .status(403)
          .json({
            ok: false,

            message:
              "No tiene permiso para realizar esta acción.",

            permiso_requerido:
              codigoPermiso,
          });
      }


      next();

    } catch (error) {

      console.error(
        "Error al verificar permiso:",
        error
      );


      return res
        .status(500)
        .json({
          ok: false,

          message:
            "No fue posible verificar los permisos del usuario.",
        });
    }
  };
}