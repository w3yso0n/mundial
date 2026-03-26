import { prisma } from "@/lib/db";
import { RankingTable, type RankingRow } from "@/components/ranking/RankingTable";

export default async function RankingPage() {
  const torneo = await prisma.torneo.findFirst({
    where: { slug: "cucerdos-mundial-2026" },
    select: {
      participantes: {
        select: {
          nombre: true,
          apodo: true,
          paisesAsignados: { select: { pais: { select: { codigoFifa: true, estado: true } } } },
        },
        orderBy: { nombre: "asc" },
      },
    },
  });

  const rows: RankingRow[] =
    torneo?.participantes?.map((p) => {
      const jugador = p.apodo?.trim() ? p.apodo : p.nombre;
      const equipos = p.paisesAsignados.map((x) => x.pais.codigoFifa);
      const vivosCount = p.paisesAsignados.filter((x) => x.pais.estado !== "eliminado").length;
      const totalCount = p.paisesAsignados.length;
      return {
        pos: 0,
        jugador,
        vivos: `${vivosCount}/${totalCount}`,
        equipos,
        premio: 0,
      };
    }) ?? [];

  // Ranking simple: más equipos vivos primero, luego nombre.
  rows.sort((a, b) => {
    const [av, at] = a.vivos.split("/").map(Number);
    const [bv, bt] = b.vivos.split("/").map(Number);
    const d = (bv ?? 0) - (av ?? 0);
    if (d) return d;
    const dt = (bt ?? 0) - (at ?? 0);
    if (dt) return dt;
    return a.jugador.localeCompare(b.jugador, "es");
  });
  rows.forEach((r, i) => (r.pos = i + 1));

  return (
    <div className="h-full">
      <div className="mb-4">
        <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Ranking</div>
        <div className="mt-1 text-lg font-semibold text-slate-100">Tabla general</div>
      </div>
      <RankingTable rows={rows} />
    </div>
  );
}

