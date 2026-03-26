import { prisma } from "@/lib/db";
import { AdminUi } from "@/components/admin/AdminUi";

export default async function AdminPage() {
  // Nota: en Windows + pnpm, el tipado de Prisma puede quedarse desfasado cuando
  // el cliente generado no se actualiza correctamente. Cast a `any` para no
  // bloquear el panel admin por tipos; el runtime sigue consultando vía Prisma.
  const torneo = (await (prisma as any).torneo.findFirst({
    where: { slug: "cucerdos-mundial-2026" },
    select: {
      id: true,
      nombre: true,
      precioPaisBase: true,
      participantes: {
        select: {
          id: true,
          nombre: true,
          apodo: true,
          colorHex: true,
          paisesAsignados: {
            select: {
              id: true,
              paisId: true,
              asignadoEn: true,
              pais: { select: { id: true, codigoFifa: true, nombre: true } },
            },
            orderBy: { asignadoEn: "asc" },
          },
        },
        orderBy: { nombre: "asc" },
      },
      paises: { select: { id: true, nombre: true, codigoFifa: true, grupo: true }, orderBy: { nombre: "asc" } },
      partidos: {
        select: {
          id: true,
          fecha: true,
          estadio: true,
          fase: true,
          grupo: true,
          orden: true,
          estado: true,
          localId: true,
          visitanteId: true,
          ganadorId: true,
          golesLocal: true,
          golesVisitante: true,
          local: { select: { codigoFifa: true, nombre: true } },
          visitante: { select: { codigoFifa: true, nombre: true } },
        } as any,
        orderBy: [{ fecha: "asc" }],
        take: 60,
      },
    },
  })) as any;

  if (!torneo) {
    return (
      <div className="rounded-2xl bg-amber-400/8 p-4 text-sm text-amber-200/90 ring-1 ring-amber-400/15">
        No hay torneo activo. Corre el seed o crea uno desde Prisma Studio.
      </div>
    );
  }

  const fmt = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "UTC",
    hour12: false,
  });

  return (
    <AdminUi
      torneo={{
        id: torneo.id,
        nombre: torneo.nombre,
        precioPaisBase: torneo.precioPaisBase ? torneo.precioPaisBase.toString() : null,
      }}
      participantes={(torneo.participantes ?? []) as any}
      paises={(torneo.paises ?? []) as any}
      partidos={((torneo.partidos ?? []) as any[]).map((p) => ({
        ...p,
        fecha: new Date(p.fecha).toISOString(),
        fechaLabel: fmt.format(new Date(p.fecha)),
      })) as any}
    />
  );
}

