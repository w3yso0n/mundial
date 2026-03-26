"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, Trophy, Users } from "lucide-react";
import { clsx } from "clsx";
import { useMemo, useState } from "react";

export type Player = {
  id: string;
  nombre: string;
  equipos: string[];
  vivos: string; // e.g. "2/2"
  aporte: number;
  color: string;
};

type TorneoVm = {
  nombre: string;
  precioPaisBase: number;
  boteTotal: number;
  totalEquipos: number;
  totalParticipantes: number;
};

function TabLink({
  href,
  label,
  activePaths,
}: {
  href: string;
  label: string;
  activePaths?: string[];
}) {
  const pathname = usePathname();
  const active = useMemo(() => {
    const paths = activePaths?.length ? activePaths : [href];
    return paths.some((p) => (p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(p + "/")));
  }, [activePaths, href, pathname]);

  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
        active
          ? "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20"
          : "text-slate-300 hover:bg-white/5 hover:text-slate-100"
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-400" : "bg-slate-600")} />
      {label}
    </Link>
  );
}

function Pill({ text }: { text: string }) {
  return (
    <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-200 ring-1 ring-emerald-500/20">
      {text}
    </span>
  );
}

function Sidebar({ torneo, players }: { torneo: TorneoVm; players: Player[] }) {
  return (
    <aside className="glass hidden h-full w-[310px] shrink-0 overflow-hidden rounded-2xl lg:block">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              <div className="text-lg font-semibold tracking-wide text-slate-100">
                {torneo.nombre.toUpperCase()}
              </div>
            </div>
            <div className="mt-1 text-xs tracking-[0.2em] text-slate-400/90">
              QUINIELA · LA APUESTA DE LOS CABRONES
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-slate-400">
          <span className="opacity-80">JUGADORES</span>
        </div>

        <div className="space-y-3">
          {players.map((p, idx) => (
            <div
              key={p.id}
              className="glass-2 rounded-xl px-4 py-3"
              style={{ borderColor: "rgba(148,163,184,0.14)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="grid h-8 w-8 place-items-center rounded-lg"
                    style={{
                      background: `${p.color}20`,
                      border: `1px solid ${p.color}30`,
                    }}
                  >
                    <Crown className="h-4 w-4" style={{ color: p.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-100">{p.nombre}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.equipos.map((e) => (
                        <Pill key={e} text={e} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-widest text-slate-400">vivos</div>
                  <div className="mt-0.5 text-sm font-semibold text-emerald-200">{p.vivos}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <div className="text-slate-400">aporte</div>
                <div className="font-semibold text-amber-300">${p.aporte}</div>
              </div>

              {idx === 0 ? (
                <div className="mt-2 text-[11px] font-medium text-emerald-300/90">Líder actual</div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function PlayersSheet({
  open,
  onClose,
  players,
}: {
  open: boolean;
  onClose: () => void;
  players: Player[];
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Cerrar"
      />
      <div className="absolute bottom-0 left-0 right-0 glass max-h-[80vh] rounded-t-2xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Jugadores
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100 ring-1 ring-white/10"
          >
            Cerrar
          </button>
        </div>
        <div className="space-y-3 overflow-auto pr-1">
          {players.map((p, idx) => (
            <div
              key={p.id}
              className="glass-2 rounded-xl px-4 py-3"
              style={{ borderColor: "rgba(148,163,184,0.14)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="grid h-8 w-8 place-items-center rounded-lg"
                    style={{
                      background: `${p.color}20`,
                      border: `1px solid ${p.color}30`,
                    }}
                  >
                    <Crown className="h-4 w-4" style={{ color: p.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-100">{p.nombre}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.equipos.map((e) => (
                        <Pill key={e} text={e} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-widest text-slate-400">vivos</div>
                  <div className="mt-0.5 text-sm font-semibold text-emerald-200">{p.vivos}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <div className="text-slate-400">aporte</div>
                <div className="font-semibold text-amber-300">${p.aporte}</div>
              </div>

              {idx === 0 ? (
                <div className="mt-2 text-[11px] font-medium text-emerald-300/90">Líder actual</div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopBar({ onOpenPlayers, torneo }: { onOpenPlayers: () => void; torneo: TorneoVm }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onOpenPlayers}
          className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 ring-1 ring-white/10 hover:bg-white/10 lg:hidden"
        >
          <Users className="h-4 w-4" />
          Jugadores
        </button>

        <TabLink href="/" label="Grupos" activePaths={["/", "/grupos"]} />
        <TabLink href="/llave" label="Llave" activePaths={["/llave"]} />
        <TabLink href="/ranking" label="Ranking" activePaths={["/ranking"]} />
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-widest text-slate-400">bote total</div>
          <div className="mt-0.5 text-2xl font-bold text-amber-300">
            ${torneo.boteTotal}
          </div>
          <div className="mt-1 text-[11px] text-slate-400/90">
            {torneo.totalEquipos} equipos asignados · ${torneo.precioPaisBase || 0}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppShell({
  children,
  torneo,
  players,
}: {
  children: React.ReactNode;
  torneo: TorneoVm;
  players: Player[];
}) {
  const [playersOpen, setPlayersOpen] = useState(false);
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[1400px] gap-5 px-4 py-4 sm:px-6 sm:py-6">
      <Sidebar torneo={torneo} players={players} />

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="glass rounded-2xl px-5 py-4">
          <TopBar torneo={torneo} onOpenPlayers={() => setPlayersOpen(true)} />
        </div>

        <main className="glass min-h-[720px] flex-1 rounded-2xl p-4 sm:p-5">
          {children}
        </main>

        <div className="fixed bottom-6 right-6">
          <Link
            href="/admin"
            className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10"
          >
            Administrar
          </Link>
        </div>
      </div>

      <PlayersSheet open={playersOpen} onClose={() => setPlayersOpen(false)} players={players} />
    </div>
  );
}

