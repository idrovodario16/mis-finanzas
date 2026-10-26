# Mis finanzas

**Ingresos, gastos y metas de ahorro en un dashboard personal.**

Aplicación en español para registrar movimientos, consultar información mensual y separar los ahorros del saldo disponible. Proyecto de portafolio de **Darío Idrovo**.

## Funcionalidades

- Crear, editar y eliminar ingresos, gastos y ahorros.
- Consultar un dashboard mensual y organizar movimientos por categorías.
- Crear metas con importe objetivo y aporte mensual previsto.
- Vincular aportes de ahorro a una meta y seguir su progreso.
- Mantener los movimientos y las metas separados por usuario.

El saldo disponible se calcula como **ingresos − gastos − ahorros registrados**. Configurar una meta no mueve dinero ni crea un cargo bancario: los aportes deben registrarse como ahorro.

## Stack

| Capa | Tecnología |
| --- | --- |
| Interfaz | React, TypeScript y Tailwind CSS |
| Componentes | shadcn y Radix UI |
| Aplicación y rutas API | Vinext, con convenciones de Next.js |
| Validación | Zod |
| Persistencia | Cloudflare D1 (SQLite) y Drizzle ORM |
| Ejecución | Cloudflare Workers |

## Requisitos y ejecución local

- Node.js 22.13 o superior.
- pnpm 11.25.0 (versión declarada en `package.json`).
- Acceso al repositorio privado.

```bash
git clone https://github.com/idrovodario16/mis-finanzas.git
cd mis-finanzas
pnpm install --frozen-lockfile
pnpm exec wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state --file scripts/schema.sql
pnpm dev
```

Abre http://localhost:5173. Para entrar al entorno de desarrollo, visita http://localhost:5173/signin-with-chatgpt?return_to=/ . El modo portable del proyecto incluye una identidad de prueba local; no utiliza tu cuenta real ni copia tus movimientos del despliegue alojado.

Si el servidor imprime otro puerto, utiliza ese puerto. El esquema local completo está en `scripts/schema.sql`; se debe aplicar sobre una base vacía antes de registrar movimientos. Las migraciones históricas de `drizzle/` no incluyen por sí solas las metas de ahorro posteriores.

## Comandos

```bash
pnpm exec tsc --noEmit
pnpm build
```

## Estructura principal

| Ruta | Contenido |
| --- | --- |
| `app/dashboard.tsx` | Dashboard y registro de movimientos |
| `app/savings-goals.tsx` | Interfaz de metas |
| `app/api/movements/route.ts` | Operaciones de movimientos y validación |
| `app/api/goals/route.ts` | Operaciones de metas |
| `app/chatgpt-auth.ts` | Adaptador de identidad del alojamiento original |
| `db/` | Esquema y acceso a D1 |
| `scripts/schema.sql` | Inicialización de la base local completa |

## Comprobar el flujo

1. Inicia sesión con la identidad de desarrollo.
2. Registra un ingreso, un gasto y un ahorro; comprueba el saldo disponible.
3. Crea una meta y vincula otro ahorro a ella.
4. Verifica el progreso de la meta y el descuento del ahorro en el saldo.
5. Edita un movimiento y comprueba que los totales cambian; recarga para verificar persistencia.

## Despliegue y privacidad

Este repositorio conserva el código de la aplicación alojada y su integración técnica de identidad. No contiene una exportación de datos personales ni credenciales. No se incluyen identificadores del proyecto de alojamiento original.

El despliegue original usa autenticación y una base D1 administradas por Sites. Para alojar en un servidor propio hay que adaptar autenticación, persistencia y lista de orígenes autorizados en ambas rutas API. No es una aplicación Laravel/Node/MySQL lista para desplegar sin cambios.

Los encabezados de identidad que usa el adaptador solo son fiables detrás de un proxy de autenticación que los valide y elimine los encabezados aportados por el cliente. La identidad simulada es exclusivamente para desarrollo local. Mantén cualquier despliegue remoto privado; no publiques ni amplíes su acceso sin autorización.

Las licencias de las dependencias y de los archivos de terceros se conservan en sus archivos correspondientes.

## Autor

[Darío Idrovo](https://github.com/idrovodario16)
