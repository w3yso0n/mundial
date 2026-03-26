const ROWS = [
  { pos: 1, jugador: "Carlos", vivos: "2/2", equipos: ["MEX", "ARG"], premio: 800 },
  { pos: 2, jugador: "Sofía", vivos: "2/2", equipos: ["BRA", "ESP"], premio: 0 },
  { pos: 3, jugador: "Miguel", vivos: "2/2", equipos: ["FRA", "ALG"], premio: 0 },
  { pos: 4, jugador: "Ana", vivos: "2/2", equipos: ["NED", "POR"], premio: 0 },
] as const;

function TeamChip({ code }: { code: string }) {
  return (
    <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-200 ring-1 ring-emerald-500/20">
      {code}
    </span>
  );
}

export function RankingTable() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white/3 ring-1 ring-white/10">
      <div className="grid grid-cols-[80px_1fr_160px_240px_140px] gap-2 border-b border-white/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
        <div>#</div>
        <div>Jugador</div>
        <div>Equipos vivos</div>
        <div>Equipos</div>
        <div className="text-right">Premio est.</div>
      </div>

      <div className="divide-y divide-white/8">
        {ROWS.map((r) => (
          <div
            key={r.pos}
            className="grid grid-cols-[80px_1fr_160px_240px_140px] items-center gap-2 px-5 py-4 text-sm text-slate-200"
          >
            <div className="font-semibold text-slate-100">{r.pos}</div>
            <div className="font-semibold text-slate-100">{r.jugador}</div>
            <div className="text-emerald-200">{r.vivos}</div>
            <div className="flex flex-wrap gap-1">
              {r.equipos.map((c) => (
                <TeamChip key={c} code={c} />
              ))}
            </div>
            <div className="text-right">
              {r.premio ? (
                <span className="inline-flex items-center justify-end rounded-full bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-300 ring-1 ring-amber-400/20">
                  ${r.premio}
                </span>
              ) : (
                <span className="text-slate-500">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

