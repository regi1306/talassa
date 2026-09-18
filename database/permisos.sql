-- ============================================================
-- TALASSA
-- PERMISOS Y ASIGNACIÓN POR ROL
-- ============================================================

BEGIN;


-- ============================================================
-- 1. PERMISOS
-- ============================================================

INSERT INTO permisos (
    codigo,
    nombre,
    modulo,
    descripcion
)
VALUES

    -- DASHBOARD
    (
        'DASH_VER',
        'Ver dashboard',
        'Dashboard',
        'Permite consultar el dashboard general.'
    ),

    -- USUARIOS
    (
        'USR_VER',
        'Ver usuarios',
        'Usuarios',
        'Permite consultar usuarios.'
    ),
    (
        'USR_CREAR',
        'Crear usuarios',
        'Usuarios',
        'Permite registrar usuarios.'
    ),
    (
        'USR_EDITAR',
        'Editar usuarios',
        'Usuarios',
        'Permite modificar usuarios.'
    ),

    -- ROLES
    (
        'ROL_GESTIONAR',
        'Gestionar roles y permisos',
        'Roles',
        'Permite administrar roles y permisos.'
    ),

    -- EMPRESAS
    (
        'EMP_VER',
        'Ver empresas',
        'Empresas',
        'Permite consultar empresas.'
    ),
    (
        'EMP_GESTIONAR',
        'Gestionar empresas',
        'Empresas',
        'Permite registrar y modificar empresas.'
    ),

    -- CATÁLOGOS
    (
        'CAT_VER',
        'Ver catálogos',
        'Catálogos',
        'Permite consultar catálogos.'
    ),
    (
        'CAT_GESTIONAR',
        'Gestionar catálogos',
        'Catálogos',
        'Permite registrar y modificar valores de catálogo.'
    ),

    -- AUDITORÍA
    (
        'AUD_VER',
        'Ver auditoría',
        'Auditoría',
        'Permite consultar la trazabilidad del sistema.'
    ),

    -- BUQUES
    (
        'BUQ_VER',
        'Ver buques',
        'Buques',
        'Permite consultar buques.'
    ),
    (
        'BUQ_GESTIONAR',
        'Gestionar buques',
        'Buques',
        'Permite registrar y modificar buques.'
    ),

    -- OPERACIONES
    (
        'OPE_VER',
        'Ver operaciones',
        'Operaciones',
        'Permite consultar operaciones portuarias.'
    ),
    (
        'OPE_GESTIONAR',
        'Gestionar operaciones',
        'Operaciones',
        'Permite crear y modificar operaciones portuarias.'
    ),

    -- MUELLES
    (
        'MUE_VER',
        'Ver muelles',
        'Muelles',
        'Permite consultar muelles y asignaciones.'
    ),
    (
        'MUE_GESTIONAR',
        'Gestionar muelles',
        'Muelles',
        'Permite administrar muelles y asignaciones.'
    ),

    -- CONTENEDORES
    (
        'CONT_VER',
        'Ver contenedores',
        'Contenedores',
        'Permite consultar contenedores.'
    ),
    (
        'CONT_GESTIONAR',
        'Gestionar contenedores',
        'Contenedores',
        'Permite registrar y modificar contenedores.'
    ),

    -- INSPECCIONES
    (
        'INS_VER',
        'Ver inspecciones',
        'Inspecciones',
        'Permite consultar inspecciones.'
    ),
    (
        'INS_GESTIONAR',
        'Gestionar inspecciones',
        'Inspecciones',
        'Permite registrar y modificar inspecciones.'
    ),

    -- INCIDENCIAS
    (
        'INC_VER',
        'Ver incidencias',
        'Incidencias',
        'Permite consultar incidencias.'
    ),
    (
        'INC_GESTIONAR',
        'Gestionar incidencias',
        'Incidencias',
        'Permite registrar y dar seguimiento a incidencias.'
    )

ON CONFLICT (codigo)
DO NOTHING;


-- ============================================================
-- 2. ADMINISTRADOR
-- Recibe TODOS los permisos.
-- ============================================================

INSERT INTO rol_permiso (
    id_rol,
    id_permiso
)
SELECT
    r.id_rol,
    p.id_permiso
FROM roles r
CROSS JOIN permisos p
WHERE r.nombre = 'Administrador'
ON CONFLICT (
    id_rol,
    id_permiso
)
DO NOTHING;


-- ============================================================
-- 3. OPERADOR PORTUARIO
-- ============================================================

INSERT INTO rol_permiso (
    id_rol,
    id_permiso
)
SELECT
    r.id_rol,
    p.id_permiso
FROM roles r
JOIN permisos p
    ON p.codigo IN (
        'DASH_VER',

        'BUQ_VER',
        'BUQ_GESTIONAR',

        'OPE_VER',
        'OPE_GESTIONAR',

        'MUE_VER',
        'MUE_GESTIONAR',

        'CONT_VER',
        'CONT_GESTIONAR'
    )
WHERE r.nombre = 'Operador portuario'
ON CONFLICT (
    id_rol,
    id_permiso
)
DO NOTHING;


-- ============================================================
-- 4. INSPECTOR
-- ============================================================

INSERT INTO rol_permiso (
    id_rol,
    id_permiso
)
SELECT
    r.id_rol,
    p.id_permiso
FROM roles r
JOIN permisos p
    ON p.codigo IN (
        'DASH_VER',

        'BUQ_VER',

        'OPE_VER',

        'CONT_VER',

        'INS_VER',
        'INS_GESTIONAR',

        'INC_VER',
        'INC_GESTIONAR'
    )
WHERE r.nombre = 'Inspector'
ON CONFLICT (
    id_rol,
    id_permiso
)
DO NOTHING;


COMMIT;