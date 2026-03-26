import { prisma } from "@/lib/db";
import { AppShell } from "@/components/app/AppShell";

type PlayerVm = {
  id: string;
  nombre: string;
  equipos: string[];
  vivos: string; // "x/y"
  aporte: number;
  color: string;
};

export async function AppShellServer({ children }: { children: React.ReactNode }) {
  const torneo = await prisma.torneo.findFirst({
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
            select: { pais: { select: { codigoFifa: true, estado: true } } },
          },
        },
        orderBy: { nombre: "asc" },
      },
    },
  });

  const precio = torneo?.precioPaisBase ? Number(torneo.precioPaisBase.toString()) : 0;

  const players: PlayerVm[] =
    torneo?.participantes?.map((p) => {
      const equipos = p.paisesAsignados.map((x) => x.pais.codigoFifa);
      const vivosCount = p.paisesAsignados.filter((x) => x.pais.estado !== "eliminado").length;
      const eliminadosCount = p.paisesAsignados.filter((x) => x.pais.estado === "eliminado").length;
      const totalCount = p.paisesAsignados.length;
      // El dinero entra al bote cuando el equipo queda eliminado.
      const aporte = precio && eliminadosCount ? precio * eliminadosCount : 0;
      return {
        id: p.id,
        nombre: p.apodo?.trim() ? p.apodo : p.nombre,
        equipos,
        vivos: `${vivosCount}/${totalCount}`,
        aporte,
        color: p.colorHex ?? "#64748b",
      };
    }) ?? [];

  const totalEquipos = players.reduce((acc, p) => acc + p.equipos.length, 0);
  const boteTotal = players.reduce((acc, p) => acc + p.aporte, 0);

  return (
    <AppShell
      torneo={{
        nombre: torneo?.nombre ?? "Mundial 2026",
        precioPaisBase: precio,
        boteTotal,
        totalEquipos,
        totalParticipantes: players.length,
      }}
      players={players}
    >
      {children}
    </AppShell>
  );
}

