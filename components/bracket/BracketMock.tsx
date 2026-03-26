import { clsx } from "clsx";
import { Trophy } from "lucide-react";

type Team = {
  code: string;
  name: string;
};

type Match = {
  a?: Team;
  b?: Team;
  status?: "pending" | "done";
};

const TEAMS: Record<string, Team> = {
  MEX: { code: "MX", name: "México" },
  ARG: { code: "AR", name: "Argentina" },
  USA: { code: "US", name: "Estados Unidos" },
  BRA: { code: "BR", name: "Brasil" },
  ESP: { code: "ES", name: "España" },
  GER: { code: "DE", name: "Alemania" },
  FRA: { code: "FR", name: "Francia" },
  ENG: { code: "GB", name: "Inglaterra" },
  POR: { code: "PT", name: "Portugal" },
  COL: { code: "CO", name: "Colombia" },
  NED: { code: "NL", name: "Países Bajos" },
  MAR: { code: "MA", name: "Marruecos" },
  JPN: { code: "JP", name: "Japón" },
  KSA: { code: "SA", name: "Arabia Saudita" },
  ECU: { code: "EC", name: "Ecuador" },
  SEN: { code: "SN", name: "Senegal" },
};

const octavos: Match[] = [
  { a: TEAMS.MEX, b: TEAMS.ARG, status: "done" },
  { a: TEAMS.USA, b: TEAMS.BRA, status: "done" },
  { a: TEAMS.ESP, b: TEAMS.GER, status: "done" },
  { a: TEAMS.FRA, b: TEAMS.ENG, status: "done" },
  { a: TEAMS.POR, b: TEAMS.COL, status: "done" },
  { a: TEAMS.NED, b: TEAMS.MAR, status: "pending" },
  { a: TEAMS.JPN, b: TEAMS.KSA, status: "pending" },
  { a: TEAMS.ECU, b: TEAMS.SEN, status: "pending" },
];

function TeamRow({ team, muted }: { team?: Team; muted?: boolean }) {
  if (!team) {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-white/3 px-3 py-2 ring-1 ring-white/6">
        <div className="grid h-6 w-6 place-items-center rounded-md bg-white/5 text-xs font-semibold text-slate-400">
          ?
        </div>
        <div className="text-sm text-slate-400">Por definir</div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center gap-3 rounded-lg px-3 py-2 ring-1",
        muted
          ? "bg-white/3 text-slate-300 ring-white/6"
          : "bg-emerald-500/8 text-slate-100 ring-emerald-500/12"
      )}
    >
      <div className="grid h-6 w-6 place-items-center rounded-md bg-emerald-500/10 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-500/15">
        {team.code}
      </div>
      <div className="min-w-0 flex-1 truncate text-sm font-medium">{team.name}</div>
      <div className="text-xs text-slate-500">—</div>
    </div>
  );
}

function MatchCard({ match }: { match: Match }) {
  return (
    <div className="rounded-xl bg-white/3 p-3 ring-1 ring-white/8">
      <div className="space-y-2">
        <TeamRow team={match.a} muted={match.status !== "done"} />
        <TeamRow team={match.b} muted={match.status !== "done"} />
      </div>
    </div>
  );
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-[260px]">
      <div className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
        {title}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function BracketMock() {
  const cuartos = new Array(4).fill(0).map(() => ({ status: "pending" as const }));
  const semis = new Array(2).fill(0).map(() => ({ status: "pending" as const }));
  const final = [{ status: "pending" as const }];

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[1100px] gap-6">
        <Column title="Octavos">
          {octavos.slice(0, 8).map((m, i) => (
            <MatchCard key={i} match={m} />
          ))}
        </Column>

        <div className="flex items-center">
          <div className="h-[680px] w-px bg-white/8" />
        </div>

        <Column title="Cuartos">
          {cuartos.map((_, i) => (
            <MatchCard key={i} match={{}} />
          ))}
        </Column>

        <div className="flex items-center">
          <div className="h-[680px] w-px bg-white/8" />
        </div>

        <Column title="Semifinal">
          {semis.map((_, i) => (
            <MatchCard key={i} match={{}} />
          ))}
        </Column>

        <div className="flex items-center">
          <div className="h-[680px] w-px bg-white/8" />
        </div>

        <Column title="Final">
          {final.map((_, i) => (
            <MatchCard key={i} match={{}} />
          ))}

          <div className="mt-5 rounded-xl bg-amber-400/8 p-4 ring-1 ring-amber-400/15">
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200/80">
              Campeón
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-400/10 text-base font-bold text-amber-200 ring-1 ring-amber-400/20">
                <Trophy className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100">Por definir</div>
                <div className="text-xs text-slate-400">Final pendiente</div>
              </div>
            </div>
          </div>
        </Column>
      </div>
    </div>
  );
}

