-- ============================================================
-- TALASSA
-- DATOS INICIALES DE DESARROLLO
-- seed.sql
-- ============================================================

BEGIN;

-- ============================================================
-- 1. ROLES
-- ============================================================

INSERT INTO roles (
    nombre,
    descripcion,
    activo
)
VALUES
    (
        'Administrador',
        'Administración general del sistema.',
        TRUE
    ),
    (
        'Operador portuario',
        'Gestión de operaciones portuarias.',
        TRUE
    ),
    (
        'Inspector',
        'Gestión de inspecciones e incidencias.',
        TRUE
    )
ON CONFLICT (nombre)
DO UPDATE SET
    descripcion = EXCLUDED.descripcion,
    activo = TRUE;


-- ============================================================
-- 2. EMPRESA DE PRUEBA
-- ============================================================

INSERT INTO empresas (
    nombre,
    tipo,
    pais,
    activo
)
SELECT
    'Naviera Oceanic',
    'Naviera',
    'Panamá',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM empresas
    WHERE nombre = 'Naviera Oceanic'
);


-- ============================================================
-- 3. CATÁLOGOS BÁSICOS
-- ============================================================

INSERT INTO tipos_buque (
    nombre,
    descripcion,
    activo
)
VALUES (
    'Portacontenedores',
    'Buque destinado principalmente al transporte de contenedores.',
    TRUE
)
ON CONFLICT (nombre)
DO NOTHING;


INSERT INTO tipos_carga (
    nombre,
    descripcion,
    activo
)
VALUES (
    'Contenedores',
    'Carga transportada mediante contenedores.',
    TRUE
)
ON CONFLICT (nombre)
DO NOTHING;


INSERT INTO tipos_contenedor (
    nombre,
    descripcion,
    activo
)
VALUES (
    'Estándar 40 pies',
    'Contenedor estándar de cuarenta pies.',
    TRUE
)
ON CONFLICT (nombre)
DO NOTHING;


INSERT INTO tipos_inspeccion (
    nombre,
    descripcion,
    activo
)
VALUES (
    'Inspección general',
    'Revisión general asociada a una operación portuaria.',
    TRUE
)
ON CONFLICT (nombre)
DO NOTHING;


INSERT INTO tipos_incidencia (
    nombre,
    descripcion,
    activo
)
VALUES (
    'Operativa',
    'Incidencia relacionada con el desarrollo de una operación portuaria.',
    TRUE
)
ON CONFLICT (nombre)
DO NOTHING;


-- ============================================================
-- 4. BUQUES DE PRUEBA
-- ============================================================

INSERT INTO buques (
    nombre,
    identificacion,
    id_empresa,
    id_tipo_buque,
    bandera,
    eslora_m,
    manga_m,
    calado_m,
    activo
)
SELECT
    'Ocean Star',
    'IMO-9000001',
    e.id_empresa,
    tb.id_tipo_buque,
    'Panamá',
    220.00,
    32.00,
    11.50,
    TRUE
FROM empresas e
CROSS JOIN tipos_buque tb
WHERE e.nombre = 'Naviera Oceanic'
  AND tb.nombre = 'Portacontenedores'
  AND NOT EXISTS (
      SELECT 1
      FROM buques
      WHERE identificacion = 'IMO-9000001'
  );


INSERT INTO buques (
    nombre,
    identificacion,
    id_empresa,
    id_tipo_buque,
    bandera,
    eslora_m,
    manga_m,
    calado_m,
    activo
)
SELECT
    'Pacific Trader',
    'IMO-9000002',
    e.id_empresa,
    tb.id_tipo_buque,
    'Panamá',
    180.00,
    28.00,
    9.50,
    TRUE
FROM empresas e
CROSS JOIN tipos_buque tb
WHERE e.nombre = 'Naviera Oceanic'
  AND tb.nombre = 'Portacontenedores'
  AND NOT EXISTS (
      SELECT 1
      FROM buques
      WHERE identificacion = 'IMO-9000002'
  );


-- ============================================================
-- 5. MUELLES
-- ============================================================

INSERT INTO muelles (
    codigo,
    nombre,
    longitud_maxima,
    calado_maximo,
    estado_operativo,
    activo
)
VALUES
    (
        'M-01',
        'Muelle 01',
        260.00,
        14.00,
        'Disponible',
        TRUE
    ),
    (
        'M-02',
        'Muelle 02',
        190.00,
        10.00,
        'Disponible',
        TRUE
    ),
    (
        'M-03',
        'Muelle 03',
        250.00,
        13.00,
        'Disponible',
        TRUE
    ),
    (
        'M-04',
        'Muelle 04',
        260.00,
        14.00,
        'Mantenimiento',
        TRUE
    )
ON CONFLICT (codigo)
DO NOTHING;


-- ============================================================
-- 6. COMPATIBILIDAD MUELLE - TIPO DE CARGA
-- ============================================================

INSERT INTO muelle_tipo_carga (
    id_muelle,
    id_tipo_carga
)
SELECT
    m.id_muelle,
    tc.id_tipo_carga
FROM muelles m
CROSS JOIN tipos_carga tc
WHERE
    m.codigo IN (
        'M-01',
        'M-02',
        'M-03',
        'M-04'
    )
    AND tc.nombre = 'Contenedores'
ON CONFLICT (
    id_muelle,
    id_tipo_carga
)
DO NOTHING;


-- ============================================================
-- 7. OPERACIÓN QUE GENERARÁ CONFLICTO EN M-01
-- ============================================================

INSERT INTO operaciones_portuarias (
    codigo,
    id_buque,
    id_tipo_carga,
    procedencia,
    destino,
    llegada_estimada,
    salida_estimada,
    estado,
    observaciones
)
SELECT
    'OP-051',
    b.id_buque,
    tc.id_tipo_carga,
    'Puerto Quetzal, Guatemala',
    'Acajutla, El Salvador',
    TIMESTAMPTZ '2026-09-10 09:00:00-06',
    TIMESTAMPTZ '2026-09-10 13:00:00-06',
    'Muelle asignado',
    'Operación de prueba utilizada para generar conflicto horario en M-01.'
FROM buques b
CROSS JOIN tipos_carga tc
WHERE
    b.identificacion = 'IMO-9000002'
    AND tc.nombre = 'Contenedores'
    AND NOT EXISTS (
        SELECT 1
        FROM operaciones_portuarias
        WHERE codigo = 'OP-051'
    );


-- ============================================================
-- 8. OPERACIÓN PRINCIPAL OP-052
-- ============================================================

INSERT INTO operaciones_portuarias (
    codigo,
    id_buque,
    id_tipo_carga,
    procedencia,
    destino,
    llegada_estimada,
    salida_estimada,
    estado,
    observaciones
)
SELECT
    'OP-052',
    b.id_buque,
    tc.id_tipo_carga,
    'Puerto Quetzal, Guatemala',
    'Acajutla, El Salvador',
    TIMESTAMPTZ '2026-09-10 08:00:00-06',
    TIMESTAMPTZ '2026-09-10 17:00:00-06',
    'Programada',
    'Operación principal utilizada para las pruebas compartidas de TALASSA.'
FROM buques b
CROSS JOIN tipos_carga tc
WHERE
    b.identificacion = 'IMO-9000001'
    AND tc.nombre = 'Contenedores'
    AND NOT EXISTS (
        SELECT 1
        FROM operaciones_portuarias
        WHERE codigo = 'OP-052'
    );


-- ============================================================
-- 9. ASIGNACIÓN VIGENTE EN M-01
--
-- Se utiliza para que M-01 tenga conflicto con OP-052.
-- Utiliza el Administrador creado previamente desde Node.
-- ============================================================

INSERT INTO asignaciones_muelle (
    id_operacion,
    id_muelle,
    id_usuario_responsable,
    inicio_asignacion,
    fin_asignacion,
    estado,
    validacion_disponibilidad,
    validacion_compatibilidad_fisica,
    validacion_compatibilidad_carga,
    validacion_sin_conflicto_horario,
    validacion_estado_operativo,
    observaciones
)
SELECT
    op.id_operacion,
    m.id_muelle,
    u.id_usuario,
    TIMESTAMPTZ '2026-09-10 09:00:00-06',
    TIMESTAMPTZ '2026-09-10 13:00:00-06',
    'Confirmada',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    'Asignación de prueba para provocar conflicto de horario en M-01.'
FROM operaciones_portuarias op
CROSS JOIN muelles m
CROSS JOIN usuarios u
WHERE
    op.codigo = 'OP-051'
    AND m.codigo = 'M-01'
    AND u.nombre_usuario = 'regina.cadenas'
    AND NOT EXISTS (
        SELECT 1
        FROM asignaciones_muelle am
        WHERE
            am.id_operacion = op.id_operacion
            AND am.estado = 'Confirmada'
    );


-- ============================================================
-- 10. CONTENEDOR PRINCIPAL
-- ============================================================

INSERT INTO contenedores (
    codigo,
    id_operacion,
    id_tipo_contenedor,
    id_tipo_carga,
    peso_kg,
    estado,
    observaciones
)
SELECT
    'CNT-001',
    op.id_operacion,
    tc.id_tipo_contenedor,
    carga.id_tipo_carga,
    18500.00,
    'Registrado',
    'Contenedor de prueba asociado a OP-052.'
FROM operaciones_portuarias op
CROSS JOIN tipos_contenedor tc
CROSS JOIN tipos_carga carga
WHERE
    op.codigo = 'OP-052'
    AND tc.nombre = 'Estándar 40 pies'
    AND carga.nombre = 'Contenedores'
    AND NOT EXISTS (
        SELECT 1
        FROM contenedores
        WHERE codigo = 'CNT-001'
    );


-- ============================================================
-- 11. INCIDENCIA DE PRUEBA
-- ============================================================

INSERT INTO incidencias (
    codigo,
    id_operacion,
    id_usuario_reportante,
    id_tipo_incidencia,
    prioridad,
    descripcion,
    estado
)
SELECT
    'INC-01',
    op.id_operacion,
    u.id_usuario,
    ti.id_tipo_incidencia,
    'Alta',
    'Incidencia operativa de prueba asociada a OP-052.',
    'Abierta'
FROM operaciones_portuarias op
CROSS JOIN usuarios u
CROSS JOIN tipos_incidencia ti
WHERE
    op.codigo = 'OP-052'
    AND u.nombre_usuario = 'regina.cadenas'
    AND ti.nombre = 'Operativa'
    AND NOT EXISTS (
        SELECT 1
        FROM incidencias
        WHERE codigo = 'INC-01'
    );


-- ============================================================
-- 12. SEGUIMIENTO INICIAL DE INC-01
-- ============================================================

INSERT INTO incidencia_seguimiento (
    id_incidencia,
    id_usuario,
    tipo_evento,
    estado_nuevo,
    comentario
)
SELECT
    i.id_incidencia,
    u.id_usuario,
    'Creación',
    'Abierta',
    'Incidencia registrada inicialmente para pruebas.'
FROM incidencias i
CROSS JOIN usuarios u
WHERE
    i.codigo = 'INC-01'
    AND u.nombre_usuario = 'regina.cadenas'
    AND NOT EXISTS (
        SELECT 1
        FROM incidencia_seguimiento s
        WHERE
            s.id_incidencia = i.id_incidencia
            AND s.tipo_evento = 'Creación'
    );


COMMIT;