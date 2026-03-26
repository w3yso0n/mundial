import { prisma } from "@/lib/db";

function Chip({ text }: { text: string }) {
  return (
    <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-200 ring-1 ring-emerald-500/20">
      {text}
    </span>
  );
}

export async function GroupsGridDb() {
  const torneo = await prisma.torneo.findFirst({
    where: { slug: "cucerdos-mundial-2026" },
    select: {
      id: true,
      paises: {
        select: { id: true, nombre: true, codigoFifa: true, grupo: true },
        orderBy: [{ grupo: "asc" }, { nombre: "asc" }],
      },
    },
  });

  if (!torneo) {
    return (
      <div className="rounded-2xl bg-amber-400/8 p-4 text-sm text-amber-200/90 ring-1 ring-amber-400/15">
        No hay torneo activo. Ejecuta el seed primero.
      </div>
    );
  }

  const groups = new Map<string, { id: string; items: { code: string; name: string }[] }>();
  for (const p of torneo.paises) {
    const g = p.grupo ?? "—";
    const arr = groups.get(g) ?? { id: g, items: [] };
    arr.items.push({ code: p.codigoFifa, name: p.nombre });
    groups.set(g, arr);
  }

  const sorted = [...groups.values()].sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sorted.map((g) => (
        <div key={g.id} className="rounded-2xl bg-white/3 p-4 ring-1 ring-white/10">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200/80">
              Grupo {g.id}
            </div>
            <div className="text-xs text-slate-500">{g.items.length} equipos</div>
          </div>

          <div className="space-y-2">
            {g.items.map((t, idx) => (
              <div
                key={`${g.id}-${t.code}`}
                className="flex items-center justify-between rounded-xl bg-white/3 px-3 py-2 ring-1 ring-white/8"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="w-5 text-sm font-semibold text-slate-300">{idx + 1}</div>
                  <div className="grid h-7 w-14 place-items-center rounded-lg bg-emerald-500/10 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-500/20">
                    {t.code}
                  </div>
                  <div className="min-w-0 truncate text-sm font-medium text-slate-100">{t.name}</div>
                </div>
                <div className="hidden sm:block">
                  <Chip text="vivo" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

