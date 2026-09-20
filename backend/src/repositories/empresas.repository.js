import pool from "../config/db.js";


export async function listarEmpresas() {
  const consulta = `
    SELECT
      id_empresa,
      nombre,
      tipo,
      pais,
      activo,
      fecha_creacion
    FROM empresas
    ORDER BY id_empresa DESC;
  `;

  const resultado = await pool.query(consulta);

  return resultado.rows;
}


export async function buscarEmpresaPorId(idEmpresa) {
  const consulta = `
    SELECT
      id_empresa,
      nombre,
      tipo,
      pais,
      activo,
      fecha_creacion
    FROM empresas
    WHERE id_empresa = $1;
  `;

  const resultado = await pool.query(
    consulta,
    [idEmpresa]
  );

  return resultado.rows[0];
}


export async function crearEmpresa(datos) {
  const {
    nombre,
    tipo,
    pais,
    activo,
  } = datos;


  const consulta = `
    INSERT INTO empresas (
      nombre,
      tipo,
      pais,
      activo,
      fecha_creacion
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      NOW()
    )
    RETURNING
      id_empresa,
      nombre,
      tipo,
      pais,
      activo,
      fecha_creacion;
  `;


  const resultado = await pool.query(
    consulta,
    [
      nombre,
      tipo,
      pais,
      activo,
    ]
  );


  return resultado.rows[0];
}


export async function actualizarEmpresa(
  idEmpresa,
  datos
) {
  const {
    nombre,
    tipo,
    pais,
    activo,
  } = datos;


  const consulta = `
    UPDATE empresas
    SET
      nombre = $1,
      tipo = $2,
      pais = $3,
      activo = $4
    WHERE id_empresa = $5
    RETURNING
      id_empresa,
      nombre,
      tipo,
      pais,
      activo,
      fecha_creacion;
  `;


  const resultado = await pool.query(
    consulta,
    [
      nombre,
      tipo,
      pais,
      activo,
      idEmpresa,
    ]
  );


  return resultado.rows[0];
}


export async function cambiarEstadoEmpresa(
  idEmpresa,
  activo
) {
  const consulta = `
    UPDATE empresas
    SET activo = $1
    WHERE id_empresa = $2
    RETURNING
      id_empresa,
      nombre,
      tipo,
      pais,
      activo,
      fecha_creacion;
  `;


  const resultado = await pool.query(
    consulta,
    [
      activo,
      idEmpresa,
    ]
  );


  return resultado.rows[0];
}