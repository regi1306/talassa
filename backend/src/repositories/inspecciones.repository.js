import pool from "../config/db.js";


/* ======================================
   FUNCIONES AUXILIARES
====================================== */

function obtenerValor(
  objeto,
  posiblesCampos,
  valorDefecto = null
) {
  for (const campo of posiblesCampos) {
    if (
      objeto &&
      Object.prototype.hasOwnProperty.call(
        objeto,
        campo
      ) &&
      objeto[campo] !== null &&
      objeto[campo] !== undefined
    ) {
      return objeto[campo];
    }
  }

  return valorDefecto;
}


function normalizarInspeccion(
  inspeccion
) {
  if (!inspeccion) {
    return null;
  }


  return {
    ...inspeccion,

    fecha_inspeccion:
      obtenerValor(
        inspeccion,
        [
          "fecha_inspeccion",
          "fecha_hora",
          "fecha_revision",
          "fecha",
        ]
      ),
  };
}


/* ======================================
   DETECTAR COLUMNAS DE INSPECCIONES
====================================== */

async function obtenerColumnasInspecciones() {
  const consulta = `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'inspecciones';
  `;


  const resultado =
    await pool.query(
      consulta
    );


  return new Set(
    resultado.rows.map(
      (fila) =>
        fila.column_name
    )
  );
}


function resolverColumna(
  columnas,
  posiblesNombres,
  etiqueta,
  requerida = true
) {
  const encontrada =
    posiblesNombres.find(
      (nombre) =>
        columnas.has(nombre)
    );


  if (
    !encontrada &&
    requerida
  ) {
    const error =
      new Error(
        `No se encontró la columna correspondiente a ${etiqueta} en la tabla inspecciones.`
      );

    error.estadoHttp = 500;

    throw error;
  }


  return encontrada || null;
}


/* ======================================
   LISTAR INSPECCIONES
====================================== */

export async function obtenerTodasLasInspecciones() {
  const consulta = `
    SELECT
      i.*,

      op.codigo AS operacion,

      c.codigo AS contenedor,

      b.nombre AS buque,

      COALESCE(
        NULLIF(
          CONCAT_WS(
            ' ',
            to_jsonb(u)->>'nombres',
            to_jsonb(u)->>'apellidos'
          ),
          ''
        ),
        to_jsonb(u)->>'nombre_completo',
        to_jsonb(u)->>'nombre',
        to_jsonb(u)->>'usuario',
        to_jsonb(u)->>'username',
        to_jsonb(u)->>'correo',
        'Inspector'
      ) AS inspector,

      COALESCE(
        to_jsonb(ti)->>'nombre',
        to_jsonb(ti)->>'descripcion',
        to_jsonb(ti)->>'codigo',
        'Inspección'
      ) AS tipo_inspeccion

    FROM inspecciones i

    LEFT JOIN operaciones_portuarias op
      ON op.id_operacion =
         i.id_operacion

    LEFT JOIN contenedores c
      ON c.id_contenedor =
         i.id_contenedor

    LEFT JOIN usuarios u
      ON u.id_usuario =
         i.id_inspector

    LEFT JOIN tipos_inspeccion ti
      ON ti.id_tipo_inspeccion =
         i.id_tipo_inspeccion

    LEFT JOIN buques b
      ON b.id_buque =
         op.id_buque

    ORDER BY
      i.id_inspeccion DESC;
  `;


  const resultado =
    await pool.query(
      consulta
    );


  return resultado.rows.map(
    normalizarInspeccion
  );
}


/* ======================================
   OBTENER UNA INSPECCIÓN
====================================== */

export async function obtenerInspeccionPorId(
  idInspeccion
) {
  const consulta = `
    SELECT
      i.*,

      op.codigo AS operacion,

      c.codigo AS contenedor,

      b.nombre AS buque,

      COALESCE(
        NULLIF(
          CONCAT_WS(
            ' ',
            to_jsonb(u)->>'nombres',
            to_jsonb(u)->>'apellidos'
          ),
          ''
        ),
        to_jsonb(u)->>'nombre_completo',
        to_jsonb(u)->>'nombre',
        to_jsonb(u)->>'usuario',
        to_jsonb(u)->>'username',
        to_jsonb(u)->>'correo',
        'Inspector'
      ) AS inspector,

      COALESCE(
        to_jsonb(ti)->>'nombre',
        to_jsonb(ti)->>'descripcion',
        to_jsonb(ti)->>'codigo',
        'Inspección'
      ) AS tipo_inspeccion

    FROM inspecciones i

    LEFT JOIN operaciones_portuarias op
      ON op.id_operacion =
         i.id_operacion

    LEFT JOIN contenedores c
      ON c.id_contenedor =
         i.id_contenedor

    LEFT JOIN usuarios u
      ON u.id_usuario =
         i.id_inspector

    LEFT JOIN tipos_inspeccion ti
      ON ti.id_tipo_inspeccion =
         i.id_tipo_inspeccion

    LEFT JOIN buques b
      ON b.id_buque =
         op.id_buque

    WHERE
      i.id_inspeccion = $1;
  `;


  const resultado =
    await pool.query(
      consulta,
      [idInspeccion]
    );


  return normalizarInspeccion(
    resultado.rows[0]
  );
}


/* ======================================
   GENERAR CÓDIGO
====================================== */

export async function generarCodigoInspeccion() {
  const consulta = `
    SELECT codigo
    FROM inspecciones
    WHERE codigo ~ '^INS-[0-9]+$'
    ORDER BY
      CAST(
        SUBSTRING(
          codigo
          FROM '[0-9]+$'
        ) AS INTEGER
      ) DESC
    LIMIT 1;
  `;


  const resultado =
    await pool.query(
      consulta
    );


  if (
    resultado.rows.length === 0
  ) {
    return "INS-001";
  }


  const codigoActual =
    resultado.rows[0].codigo;


  const numeroActual =
    Number(
      codigoActual
        .replace(
          "INS-",
          ""
        )
    );


  const siguiente =
    numeroActual + 1;


  return `INS-${String(
    siguiente
  ).padStart(
    3,
    "0"
  )}`;
}


/* ======================================
   PREPARAR DATOS PARA INSERT / UPDATE
====================================== */

async function prepararDatosDB(
  datos
) {
  const columnas =
    await obtenerColumnasInspecciones();


  const fechaColumna =
    resolverColumna(
      columnas,
      [
        "fecha_inspeccion",
        "fecha_hora",
        "fecha_revision",
        "fecha",
      ],
      "fecha de inspección"
    );


  const payload = {
    codigo:
      datos.codigo,

    id_operacion:
      datos.id_operacion,

    id_inspector:
      datos.id_inspector,

    id_tipo_inspeccion:
      datos.id_tipo_inspeccion,

    estado:
      datos.estado,

    resultado:
      datos.resultado,

    observaciones:
      datos.observaciones,

    [fechaColumna]:
      datos.fecha_inspeccion,
  };


  /*
   * El contenedor es opcional.
   */

  if (
    columnas.has(
      "id_contenedor"
    )
  ) {
    payload.id_contenedor =
      datos.id_contenedor;
  }


  return payload;
}


/* ======================================
   INSERTAR
====================================== */

export async function insertarInspeccion(
  datosInspeccion
) {
  const payload =
    await prepararDatosDB(
      datosInspeccion
    );


  const columnas =
    Object.keys(
      payload
    );


  const valores =
    Object.values(
      payload
    );


  const placeholders =
    columnas.map(
      (_, indice) =>
        `$${indice + 1}`
    );


  const consulta = `
    INSERT INTO inspecciones (
      ${columnas.join(", ")}
    )
    VALUES (
      ${placeholders.join(", ")}
    )
    RETURNING
      id_inspeccion;
  `;


  const resultado =
    await pool.query(
      consulta,
      valores
    );


  return resultado.rows[0];
}


/* ======================================
   ACTUALIZAR
====================================== */

export async function actualizarInspeccionPorId(
  idInspeccion,
  datosInspeccion
) {
  const payload =
    await prepararDatosDB(
      datosInspeccion
    );


  /*
   * El código NO se modifica.
   */

  delete payload.codigo;


  const columnas =
    Object.keys(
      payload
    );


  const valores =
    Object.values(
      payload
    );


  const asignaciones =
    columnas.map(
      (columna, indice) =>
        `${columna} = $${indice + 1}`
    );


  valores.push(
    idInspeccion
  );


  const consulta = `
    UPDATE inspecciones
    SET
      ${asignaciones.join(", ")}
    WHERE
      id_inspeccion =
      $${valores.length}
    RETURNING
      id_inspeccion;
  `;


  const resultado =
    await pool.query(
      consulta,
      valores
    );


  return (
    resultado.rowCount > 0
  );
}


/* ======================================
   ELIMINAR
====================================== */

export async function eliminarInspeccionPorId(
  idInspeccion
) {
  const consulta = `
    DELETE FROM inspecciones
    WHERE id_inspeccion = $1
    RETURNING
      id_inspeccion,
      codigo;
  `;


  const resultado =
    await pool.query(
      consulta,
      [idInspeccion]
    );


  return (
    resultado.rows[0] ||
    null
  );
}


/* ======================================
   EXISTENCIAS
====================================== */

export async function existeOperacion(
  idOperacion
) {
  const consulta = `
    SELECT EXISTS (
      SELECT 1
      FROM operaciones_portuarias
      WHERE id_operacion = $1
    ) AS existe;
  `;


  const resultado =
    await pool.query(
      consulta,
      [idOperacion]
    );


  return resultado.rows[0].existe;
}


export async function existeContenedor(
  idContenedor
) {
  const consulta = `
    SELECT EXISTS (
      SELECT 1
      FROM contenedores
      WHERE id_contenedor = $1
    ) AS existe;
  `;


  const resultado =
    await pool.query(
      consulta,
      [idContenedor]
    );


  return resultado.rows[0].existe;
}


export async function contenedorPerteneceOperacion(
  idContenedor,
  idOperacion
) {
  const consulta = `
    SELECT EXISTS (
      SELECT 1
      FROM contenedores
      WHERE id_contenedor = $1
        AND id_operacion = $2
    ) AS pertenece;
  `;


  const resultado =
    await pool.query(
      consulta,
      [
        idContenedor,
        idOperacion,
      ]
    );


  return resultado.rows[0].pertenece;
}


export async function existeInspector(
  idInspector
) {
  const consulta = `
    SELECT EXISTS (
      SELECT 1
      FROM usuarios
      WHERE id_usuario = $1
    ) AS existe;
  `;


  const resultado =
    await pool.query(
      consulta,
      [idInspector]
    );


  return resultado.rows[0].existe;
}


export async function existeTipoInspeccion(
  idTipoInspeccion
) {
  const consulta = `
    SELECT EXISTS (
      SELECT 1
      FROM tipos_inspeccion
      WHERE id_tipo_inspeccion = $1
    ) AS existe;
  `;


  const resultado =
    await pool.query(
      consulta,
      [idTipoInspeccion]
    );


  return resultado.rows[0].existe;
}


/* ======================================
   OPCIONES DEL FORMULARIO
====================================== */

export async function obtenerOpcionesInspeccion() {
  const [
    operacionesResultado,
    contenedoresResultado,
    usuariosResultado,
    tiposResultado,
    rolesResultado,
  ] = await Promise.all([

    pool.query(`
      SELECT
        op.*,
        b.nombre AS buque
      FROM operaciones_portuarias op
      LEFT JOIN buques b
        ON b.id_buque =
           op.id_buque
      ORDER BY
        op.id_operacion DESC;
    `),


    pool.query(`
      SELECT *
      FROM contenedores
      ORDER BY codigo ASC;
    `),


    pool.query(`
      SELECT *
      FROM usuarios
      ORDER BY id_usuario ASC;
    `),


    pool.query(`
      SELECT *
      FROM tipos_inspeccion
      ORDER BY id_tipo_inspeccion ASC;
    `),


    pool.query(`
      SELECT *
      FROM roles
      ORDER BY id_rol ASC;
    `),

  ]);


  /* ==============================
     ROLES
  ============================== */

  const mapaRoles =
    new Map();


  rolesResultado.rows.forEach(
    (rol) => {

      const idRol =
        obtenerValor(
          rol,
          [
            "id_rol",
            "id",
          ]
        );


      const nombreRol =
        obtenerValor(
          rol,
          [
            "nombre",
            "nombre_rol",
            "descripcion",
          ],
          ""
        );


      mapaRoles.set(
        String(idRol),
        nombreRol
      );
    }
  );


  /* ==============================
     INSPECTORES
  ============================== */

  const usuariosNormalizados =
    usuariosResultado.rows
      .filter(
        (usuario) =>
          usuario.activo !== false
      )
      .map(
        (usuario) => {

          const idRol =
            obtenerValor(
              usuario,
              [
                "id_rol",
              ]
            );


          const rol =
            mapaRoles.get(
              String(idRol)
            ) || "";


          const nombreCompleto =
            [
              obtenerValor(
                usuario,
                [
                  "nombres",
                  "nombre",
                ],
                ""
              ),

              obtenerValor(
                usuario,
                [
                  "apellidos",
                  "apellido",
                ],
                ""
              ),
            ]
              .filter(Boolean)
              .join(" ")
              .trim();


          const nombre =
            nombreCompleto ||

            obtenerValor(
              usuario,
              [
                "nombre_completo",
                "usuario",
                "username",
                "correo",
              ],
              `Usuario ${usuario.id_usuario}`
            );


          return {
            id_inspector:
              usuario.id_usuario,

            nombre,

            rol,
          };
        }
      );


  const inspectoresEncontrados =
    usuariosNormalizados.filter(
      (usuario) =>
        usuario.rol
          ?.toLowerCase()
          .includes(
            "inspector"
          )
    );


  const inspectores =
    inspectoresEncontrados.length > 0
      ? inspectoresEncontrados
      : usuariosNormalizados;


  /* ==============================
     OPERACIONES
  ============================== */

  const operaciones =
    operacionesResultado.rows.map(
      (operacion) => ({
        id_operacion:
          operacion.id_operacion,

        codigo:
          operacion.codigo,

        buque:
          operacion.buque,

        estado:
          obtenerValor(
            operacion,
            [
              "estado",
            ]
          ),
      })
    );


  /* ==============================
     CONTENEDORES
  ============================== */

  const contenedores =
    contenedoresResultado.rows.map(
      (contenedor) => ({
        id_contenedor:
          contenedor.id_contenedor,

        codigo:
          contenedor.codigo,

        id_operacion:
          contenedor.id_operacion,

        estado:
          contenedor.estado,
      })
    );


  /* ==============================
     TIPOS
  ============================== */

  const tiposInspeccion =
    tiposResultado.rows.map(
      (tipo) => ({
        id_tipo_inspeccion:
          tipo.id_tipo_inspeccion,

        nombre:
          obtenerValor(
            tipo,
            [
              "nombre",
              "descripcion",
              "codigo",
            ],
            `Tipo ${tipo.id_tipo_inspeccion}`
          ),
      })
    );


  return {
    operaciones,
    contenedores,
    inspectores,
    tipos_inspeccion:
      tiposInspeccion,
  };
}