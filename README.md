# 🐷 Cucerdos Mundial

Plataforma fullstack en Next.js para la quiniela/fantasy del mundial entre amigos: países asignados, duelos, tabla de posiciones y vista tipo dashboard + fantasy.

## Stack

- **Frontend/Backend:** Next.js 16 (App Router, Server Components, Server Actions)
- **DB:** PostgreSQL
- **ORM:** Prisma 6
- **UI:** Tailwind CSS 4 + componentes custom
- **Gráficos:** Recharts (listo para usar)
- **Auth:** Por definir (NextAuth o invitación simple)

## Cómo levantar el proyecto

### 1. Dependencias

```bash
pnpm install
```

### 2. Base de datos

Crea una base PostgreSQL y define la URL en `.env`:

```bash
cp .env.example .env
# Edita .env y pon tu DATABASE_URL, por ejemplo:
# DATABASE_URL="postgresql://user:password@localhost:5432/cucerdos_mundial?schema=public"
```

### 3. Prisma

```bash
pnpm db:generate   # Genera el cliente Prisma
pnpm db:push       # Crea/actualiza tablas en la DB (sin migraciones)
pnpm db:seed       # Datos de ejemplo (torneo, participantes, países, una deuda)
```

### 4. Desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Módulos de la plataforma

| Ruta | Descripción |
|------|-------------|
| `/` | Dashboard: pozo, partidos, deudas, top 3, próximo partido, cards de participantes |
| `/participantes` | Lista de amigos con países, saldo y badges |
| `/participantes/[id]` | Detalle de un participante |
| `/paises` | Selecciones por grupo, puntos, estado (vivo/eliminado/campeón) |
| `/duelos` | Cruces entre amigos cuando se enfrentan sus países |
| `/deudas` | Quién debe a quién, historial de pagos |
| `/tabla` | Ranking por saldo |
| `/calendario` | Partidos con fecha, equipos, resultado y duelos vinculados |
| `/admin` | Torneo actual, listado de participantes/países, **marcar deuda como pagada** |

## Próximos pasos (post-MVP)

- Auth (NextAuth o invitación por link)
- Sorteo de países desde la UI
- Carga de resultados de partidos (o integración API)
- Generación automática de duelos cuando hay partido entre dos países con dueños
- Gráficos con Recharts (evolución del pozo, aciertos por participante)
- Vista tipo bracket/torneo
- Subida de avatar/foto por participante

## Scripts

- `pnpm dev` — Servidor de desarrollo
- `pnpm build` — Build de producción (incluye `prisma generate`)
- `pnpm db:studio` — Abre Prisma Studio para ver/editar la DB
